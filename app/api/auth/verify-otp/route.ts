import { NextResponse } from "next/server";
import { normalizeSriLankanPhone } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string;
    code?: string;
  };

  const normalizedPhone = normalizeSriLankanPhone(body.phone ?? "");
  const code = body.code?.trim() ?? "";

  if (!normalizedPhone) {
    return NextResponse.json(
      { message: "Please enter a valid mobile number first." },
      { status: 400 },
    );
  }

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { message: "OTP should be a 6-digit code." },
      { status: 400 },
    );
  }

  const result = verifyOtp(normalizedPhone, code);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  const response = NextResponse.json({
    message: "Registration complete.",
    user: result.user,
  });

  response.cookies.set("ceylon-cart-session", result.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
