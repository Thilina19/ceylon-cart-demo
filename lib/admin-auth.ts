import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "ceylon-cart-admin";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const DEFAULT_ADMIN_EMAIL = "admin@ceyloncart.lk";
const DEFAULT_ADMIN_PASSWORD = "CeylonCart123!";
const DEFAULT_ADMIN_SECRET = "ceylon-cart-admin-demo-secret";

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? DEFAULT_ADMIN_SECRET;
}

function signPayload(payload: string) {
  return createHmac("sha256", getAdminSecret()).update(payload).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminDefaults() {
  return {
    email: getAdminEmail(),
  };
}

export function isAdminCredentialValid(email: string, password: string) {
  return safeEqual(email.trim().toLowerCase(), getAdminEmail().toLowerCase()) &&
    safeEqual(password, getAdminPassword());
}

export function createAdminSessionToken(email: string) {
  const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
  const payload = `${email}:${expiresAt}`;
  const signature = signPayload(payload);

  return Buffer.from(
    JSON.stringify({
      email,
      expiresAt,
      signature,
    }),
  ).toString("base64url");
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8"),
    ) as {
      email?: string;
      expiresAt?: number;
      signature?: string;
    };

    if (
      !decoded.email ||
      typeof decoded.expiresAt !== "number" ||
      !decoded.signature
    ) {
      return false;
    }

    if (decoded.expiresAt < Date.now()) {
      return false;
    }

    const payload = `${decoded.email}:${decoded.expiresAt}`;
    const expected = signPayload(payload);

    return safeEqual(decoded.signature, expected);
  } catch {
    return false;
  }
}

export async function isAdminSessionActive() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function requireAdminSession() {
  const isActive = await isAdminSessionActive();

  if (!isActive) {
    redirect("/admin/login");
  }
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminSessionMaxAgeSeconds() {
  return Math.floor(ADMIN_SESSION_TTL_MS / 1000);
}
