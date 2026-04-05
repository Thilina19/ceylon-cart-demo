import { NextResponse } from "next/server";
import { isAdminSessionActive } from "@/lib/admin-auth";
import { getDeliveryZones, updateDeliveryZone } from "@/lib/store-db";

export async function GET() {
  return NextResponse.json({
    zones: await getDeliveryZones(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminSessionActive())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    name?: string;
    district?: string;
    radiusKm?: number;
    etaMinutes?: number;
    minOrder?: number;
    active?: boolean;
    center?: {
      lat?: number;
      lng?: number;
    };
  };

  if (!body.id) {
    return NextResponse.json(
      { message: "Zone id is required." },
      { status: 400 },
    );
  }

  const updated = await updateDeliveryZone(body.id, {
    name: body.name,
    district: body.district,
    radiusKm: body.radiusKm,
    etaMinutes: body.etaMinutes,
    minOrder: body.minOrder,
    active: body.active,
    center: body.center,
  });

  if (!updated) {
    return NextResponse.json({ message: "Zone not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Zone updated.",
    zone: updated,
    zones: await getDeliveryZones(),
  });
}
