import { NextResponse } from "next/server";
import { getDeliveryZones, updateDeliveryZone } from "@/lib/store-data";

export async function GET() {
  return NextResponse.json({
    zones: getDeliveryZones(),
  });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    radiusKm?: number;
    etaMinutes?: number;
    minOrder?: number;
    active?: boolean;
  };

  if (!body.id) {
    return NextResponse.json(
      { message: "Zone id is required." },
      { status: 400 },
    );
  }

  const updated = updateDeliveryZone(body.id, {
    radiusKm: body.radiusKm,
    etaMinutes: body.etaMinutes,
    minOrder: body.minOrder,
    active: body.active,
  });

  if (!updated) {
    return NextResponse.json({ message: "Zone not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Zone updated.",
    zone: updated,
    zones: getDeliveryZones(),
  });
}
