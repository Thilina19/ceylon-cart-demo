import { NextResponse } from "next/server";
import { updateProduct } from "@/lib/store-db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;

  const product = await updateProduct(id, body);

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Product updated.",
    product,
  });
}
