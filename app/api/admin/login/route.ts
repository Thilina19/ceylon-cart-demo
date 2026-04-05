import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminDefaults,
  getAdminSessionMaxAgeSeconds,
  isAdminCredentialValid,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  if (!isAdminCredentialValid(email, password)) {
    return NextResponse.json(
      { message: "The admin credentials are incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    message: "Admin access granted.",
    admin: {
      email: getAdminDefaults().email,
    },
  });

  response.cookies.set(getAdminCookieName(), createAdminSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionMaxAgeSeconds(),
  });

  return response;
}
