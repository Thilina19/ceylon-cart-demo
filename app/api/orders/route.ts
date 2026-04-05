import { NextResponse } from "next/server";
import { isAdminSessionActive } from "@/lib/admin-auth";
import { normalizeSriLankanPhone } from "@/lib/auth";
import { createOrder, getOrders } from "@/lib/store-db";
import type { OrderItemInput } from "@/lib/store-data";

export async function GET() {
  if (!(await isAdminSessionActive())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const orders = await getOrders();

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customerName?: string;
    phone?: string;
    address?: string;
    note?: string;
    zoneId?: string | null;
    items?: OrderItemInput[];
  };

  const customerName = body.customerName?.trim() ?? "";
  const phone = normalizeSriLankanPhone(body.phone ?? "");
  const address = body.address?.trim() ?? "";
  const items = body.items ?? [];

  if (customerName.length < 2) {
    return NextResponse.json(
      { message: "Customer name is required." },
      { status: 400 },
    );
  }

  if (!phone) {
    return NextResponse.json(
      { message: "Please enter a valid Sri Lankan mobile number." },
      { status: 400 },
    );
  }

  if (address.length < 8) {
    return NextResponse.json(
      { message: "Delivery address is required." },
      { status: 400 },
    );
  }

  if (!items.length) {
    return NextResponse.json(
      { message: "Add products before placing an order." },
      { status: 400 },
    );
  }

  if (!body.zoneId) {
    return NextResponse.json(
      { message: "Check delivery coverage before placing an order." },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder({
      customerName,
      phone,
      address,
      note: body.note,
      zoneId: body.zoneId ?? null,
      items,
    });

    return NextResponse.json({
      message: "Order created.",
      order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to create order.",
      },
      { status: 400 },
    );
  }
}
