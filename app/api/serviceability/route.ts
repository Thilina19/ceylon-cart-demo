import { NextResponse } from "next/server";
import { evaluateServiceability } from "@/lib/geo";
import { getDeliveryZones } from "@/lib/store-db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    lat?: number;
    lng?: number;
  };

  if (typeof body.lat !== "number" || typeof body.lng !== "number") {
    return NextResponse.json(
      { message: "Latitude and longitude are required." },
      { status: 400 },
    );
  }

  const zones = await getDeliveryZones();
  const result = evaluateServiceability(
    { lat: body.lat, lng: body.lng },
    zones,
  );

  return NextResponse.json({
    ...result,
    zones,
  });
}
