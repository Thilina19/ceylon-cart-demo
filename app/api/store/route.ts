import { NextResponse } from "next/server";
import { getStorefrontData } from "@/lib/store-db";

export async function GET() {
  const storefront = await getStorefrontData();

  return NextResponse.json(storefront);
}
