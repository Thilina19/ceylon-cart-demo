import type { DeliveryZone } from "@/lib/store-data";

export type ServiceabilityResult = {
  eligible: boolean;
  etaMinutes: number | null;
  distanceKm: number;
  message: string;
  zone: DeliveryZone | null;
  nearestZone: DeliveryZone | null;
};

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistanceKm(
  pointA: { lat: number; lng: number },
  pointB: { lat: number; lng: number },
) {
  const deltaLat = toRadians(pointB.lat - pointA.lat);
  const deltaLng = toRadians(pointB.lng - pointA.lng);
  const latA = toRadians(pointA.lat);
  const latB = toRadians(pointB.lat);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(deltaLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function evaluateServiceability(
  position: { lat: number; lng: number },
  zones: DeliveryZone[],
): ServiceabilityResult {
  const ranked = zones
    .filter((zone) => zone.active)
    .map((zone) => ({
      zone,
      distanceKm: haversineDistanceKm(position, zone.center),
    }))
    .sort((left, right) => left.distanceKm - right.distanceKm);

  const nearest = ranked[0] ?? null;
  const matchingZone =
    ranked.find((item) => item.distanceKm <= item.zone.radiusKm) ?? null;

  if (!nearest) {
    return {
      eligible: false,
      etaMinutes: null,
      distanceKm: 0,
      message: "No delivery hubs are configured yet.",
      zone: null,
      nearestZone: null,
    };
  }

  if (!matchingZone) {
    return {
      eligible: false,
      etaMinutes: null,
      distanceKm: Number(nearest.distanceKm.toFixed(1)),
      message: `You are outside the live one-hour radius. The nearest active hub is ${nearest.zone.name}.`,
      zone: null,
      nearestZone: nearest.zone,
    };
  }

  const etaMinutes = Math.min(
    60,
    Math.max(
      matchingZone.zone.etaMinutes,
      matchingZone.zone.etaMinutes +
        Math.round((matchingZone.distanceKm / matchingZone.zone.radiusKm) * 8),
    ),
  );

  return {
    eligible: etaMinutes <= 60,
    etaMinutes,
    distanceKm: Number(matchingZone.distanceKm.toFixed(1)),
    message: `Great news. ${matchingZone.zone.name} can deliver in about ${etaMinutes} minutes.`,
    zone: matchingZone.zone,
    nearestZone: nearest.zone,
  };
}
