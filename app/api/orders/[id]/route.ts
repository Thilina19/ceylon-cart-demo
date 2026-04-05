import { NextResponse } from "next/server";
import { isAdminSessionActive } from "@/lib/admin-auth";
import { updateOrderStatus } from "@/lib/store-db";
import type { OrderStatus } from "@/lib/store-data";

const VALID_STATUSES = new Set<OrderStatus>([
  "pending",
  "confirmed",
  "delivering",
  "completed",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminSessionActive())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: OrderStatus;
  };

  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json(
      { message: "A valid order status is required." },
      { status: 400 },
    );
  }

  const order = await updateOrderStatus(id, body.status);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Order updated.",
    order,
  });
}
