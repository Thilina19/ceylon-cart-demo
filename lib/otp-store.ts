import { randomInt, randomUUID } from "crypto";

type OtpRecord = {
  phone: string;
  name: string;
  code: string;
  expiresAt: number;
};

export type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
};

const otpRecords = new Map<string, OtpRecord>();
const users = new Map<string, RegisteredUser>();
const sessions = new Map<string, string>();

const OTP_TTL_MS = 1000 * 60 * 3;

function cleanup() {
  const now = Date.now();

  for (const [phone, record] of otpRecords.entries()) {
    if (record.expiresAt <= now) {
      otpRecords.delete(phone);
    }
  }
}

export function issueOtp(name: string, phone: string) {
  cleanup();

  const code = randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpRecords.set(phone, {
    phone,
    name,
    code,
    expiresAt,
  });

  return {
    code,
    expiresAt,
  };
}

export function verifyOtp(phone: string, code: string) {
  cleanup();

  const record = otpRecords.get(phone);

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

  otpRecords.delete(phone);

  const user =
    users.get(phone) ??
    ({
      id: randomUUID(),
      name: record.name,
      phone,
      createdAt: new Date().toISOString(),
    } satisfies RegisteredUser);

  users.set(phone, user);

  const sessionToken = randomUUID();
  sessions.set(sessionToken, phone);

  return {
    ok: true as const,
    user,
    sessionToken,
  };
}
