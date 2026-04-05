import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/store-db";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    category?: string;
    unit?: string;
    price?: number;
    wasPrice?: number;
    badge?: string;
    origin?: string;
    rating?: number;
    eta?: string;
    tint?: string;
  };

  if (!body.name || !body.category || !body.unit || typeof body.price !== "number") {
    return NextResponse.json(
      { message: "Name, category, unit, and price are required." },
      { status: 400 },
    );
  }

  const product = await createProduct({
    name: body.name,
    category: body.category,
    unit: body.unit,
    price: body.price,
    wasPrice: body.wasPrice,
    badge: body.badge ?? "New",
    origin: body.origin ?? "Sri Lanka",
    rating: body.rating ?? 4.5,
    eta: body.eta ?? "45 min",
    tint: body.tint ?? "bg-[#f1f5f9]",
  });

  return NextResponse.json({
    message: "Product created.",
    product,
  });
}
