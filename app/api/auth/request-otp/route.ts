import { NextResponse } from "next/server";
import { normalizeSriLankanPhone } from "@/lib/auth";
import { issueOtp } from "@/lib/store-db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    phone?: string;
  };

  const trimmedName = body.name?.trim() ?? "";
  const normalizedPhone = normalizeSriLankanPhone(body.phone ?? "");

  if (trimmedName.length < 2) {
    return NextResponse.json(
      { message: "Please enter a valid name." },
      { status: 400 },
    );
  }

  if (!normalizedPhone) {
    return NextResponse.json(
      {
        message:
          "Please enter a Sri Lankan mobile number in 07XXXXXXXX or +947XXXXXXXX format.",
      },
      { status: 400 },
    );
  }

  const otp = await issueOtp(trimmedName, normalizedPhone);

  return NextResponse.json({
    message: "Verification code generated.",
    normalizedPhone,
    otpPreview: otp.code,
    expiresAt: otp.expiresAt,
    isDemo: true,
  });
}
