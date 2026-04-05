import { mkdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { randomInt, randomUUID } from "crypto";
import {
  createSeedStorefrontData,
  type DeliveryZone,
  type OrderItemInput,
  type OrderRecord,
  type Product,
  type RegisteredUser,
  type StorefrontData,
} from "@/lib/store-data";

type OtpRecord = {
  phone: string;
  name: string;
  code: string;
  expiresAt: number;
};

type SessionRecord = {
  token: string;
  phone: string;
  createdAt: string;
};

type Database = {
  storefront: StorefrontData;
  users: RegisteredUser[];
  otpRecords: OtpRecord[];
  sessions: SessionRecord[];
  orders: OrderRecord[];
};

const DB_PATH = process.env.VERCEL
  ? path.join(os.tmpdir(), "ceylon-cart-store-db.json")
  : path.join(process.cwd(), "data", "store-db.json");
const OTP_TTL_MS = 1000 * 60 * 3;

let writeChain = Promise.resolve();

function seedDatabase(): Database {
  return {
    storefront: createSeedStorefrontData(),
    users: [],
    otpRecords: [],
    sessions: [],
    orders: [],
  };
}

async function ensureDbFile() {
  await mkdir(path.dirname(DB_PATH), { recursive: true });

  try {
    await readFile(DB_PATH, "utf8");
  } catch {
    await writeFile(DB_PATH, JSON.stringify(seedDatabase(), null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDbFile();
  const raw = await readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as Database;
}

async function writeDb(db: Database) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

async function withWriteLock<T>(fn: (db: Database) => Promise<T> | T): Promise<T> {
  const task = writeChain.then(async () => {
    const db = await readDb();
    const result = await fn(db);
    await writeDb(db);
    return result;
  });

  writeChain = task.then(
    () => undefined,
    () => undefined,
  );

  return task;
}

function cleanupOtpRecords(db: Database) {
  const now = Date.now();
  db.otpRecords = db.otpRecords.filter((record) => record.expiresAt > now);
}

export async function getStorefrontData() {
  const db = await readDb();
  return db.storefront;
}

export async function getProducts() {
  const db = await readDb();
  return db.storefront.products;
}

export async function createProduct(
  product: Omit<Product, "id"> & { id?: string },
) {
  return withWriteLock(async (db) => {
    const newProduct: Product = {
      ...product,
      id: product.id ?? randomUUID(),
    };

    db.storefront.products.unshift(newProduct);
    return newProduct;
  });
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  return withWriteLock(async (db) => {
    const product = db.storefront.products.find((item) => item.id === id);

    if (!product) {
      return null;
    }

    Object.assign(product, patch, { id: product.id });
    return product;
  });
}

export async function deleteProduct(id: string) {
  return withWriteLock(async (db) => {
    const originalLength = db.storefront.products.length;
    db.storefront.products = db.storefront.products.filter((item) => item.id !== id);
    return db.storefront.products.length !== originalLength;
  });
}

export async function getDeliveryZones() {
  const db = await readDb();
  return db.storefront.deliveryZones;
}

export async function updateDeliveryZone(
  id: string,
  patch: Partial<Omit<DeliveryZone, "id" | "center">> & {
    center?: Partial<DeliveryZone["center"]>;
  },
) {
  return withWriteLock(async (db) => {
    const zone = db.storefront.deliveryZones.find((item) => item.id === id);

    if (!zone) {
      return null;
    }

    if (patch.name !== undefined) zone.name = patch.name;
    if (patch.district !== undefined) zone.district = patch.district;
    if (patch.radiusKm !== undefined) zone.radiusKm = patch.radiusKm;
    if (patch.etaMinutes !== undefined) zone.etaMinutes = patch.etaMinutes;
    if (patch.minOrder !== undefined) zone.minOrder = patch.minOrder;
    if (patch.active !== undefined) zone.active = patch.active;
    if (patch.center?.lat !== undefined) zone.center.lat = patch.center.lat;
    if (patch.center?.lng !== undefined) zone.center.lng = patch.center.lng;

    return zone;
  });
}

export async function issueOtp(name: string, phone: string) {
  return withWriteLock(async (db) => {
    cleanupOtpRecords(db);

    const code = randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + OTP_TTL_MS;

    db.otpRecords = db.otpRecords.filter((record) => record.phone !== phone);
    db.otpRecords.push({ phone, name, code, expiresAt });

    return { code, expiresAt };
  });
}

export async function verifyOtp(phone: string, code: string) {
  return withWriteLock(async (db) => {
    cleanupOtpRecords(db);

    const record = db.otpRecords.find((item) => item.phone === phone);

    if (!record) {
      return {
        ok: false as const,
        message: "OTP expired or not found. Please request a fresh code.",
      };
    }

    if (record.code !== code) {
      return {
        ok: false as const,
        message: "The OTP you entered is incorrect.",
      };
    }

    db.otpRecords = db.otpRecords.filter((item) => item.phone !== phone);

    let user = db.users.find((item) => item.phone === phone);

    if (!user) {
      user = {
        id: randomUUID(),
        name: record.name,
        phone,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    }

    const sessionToken = randomUUID();
    db.sessions.push({
      token: sessionToken,
      phone,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true as const,
      user,
      sessionToken,
    };
  });
}

export async function createOrder(input: {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  zoneId?: string | null;
  items: OrderItemInput[];
}) {
  return withWriteLock(async (db) => {
    const normalizedItems = input.items
      .filter((item) => item.quantity > 0)
      .map((item) => {
        const product = db.storefront.products.find(
          (candidate) => candidate.id === item.productId,
        );

        if (!product) {
          throw new Error(`Product ${item.productId} was not found.`);
        }

        return {
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          lineTotal: product.price * item.quantity,
        };
      });

    if (!normalizedItems.length) {
      throw new Error("At least one order item is required.");
    }

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );

    const zone =
      db.storefront.deliveryZones.find((candidate) => candidate.id === input.zoneId) ??
      null;

    if (zone && subtotal < zone.minOrder) {
      throw new Error(
        `The minimum order for ${zone.name} is LKR ${zone.minOrder.toLocaleString("en-LK")}.`,
      );
    }

    const deliveryFee = subtotal >= 5000 ? 0 : 350;

    const order: OrderRecord = {
      id: randomUUID(),
      customerName: input.customerName,
      phone: input.phone,
      address: input.address,
      note: input.note?.trim() ?? "",
      items: normalizedItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: "pending",
      zoneId: zone?.id ?? null,
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(order);
    return order;
  });
}

export async function getOrders() {
  const db = await readDb();
  return db.orders;
}

export async function updateOrderStatus(id: string, status: OrderRecord["status"]) {
  return withWriteLock(async (db) => {
    const order = db.orders.find((item) => item.id === id);

    if (!order) {
      return null;
    }

    order.status = status;
    return order;
  });
}
