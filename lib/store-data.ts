export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type PromoCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  metric: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  wasPrice?: number;
  badge: string;
  origin: string;
  rating: number;
  eta: string;
  tint: string;
};

export type DeliveryZone = {
  id: string;
  name: string;
  district: string;
  center: {
    lat: number;
    lng: number;
  };
  radiusKm: number;
  etaMinutes: number;
  minOrder: number;
  active: boolean;
};

export const categories: Category[] = [
  {
    id: "all",
    name: "All aisles",
    description: "Everything from fresh fruit to home care.",
    icon: "grid",
  },
  {
    id: "produce",
    name: "Fresh produce",
    description: "Daily vegetables, herbs, and tropical fruit.",
    icon: "leaf",
  },
  {
    id: "bakery",
    name: "Bakery",
    description: "Bread, buns, cakes, and breakfast picks.",
    icon: "bread",
  },
  {
    id: "dairy",
    name: "Dairy & eggs",
    description: "Milk, curd, butter, yogurt, and eggs.",
    icon: "drop",
  },
  {
    id: "seafood",
    name: "Meat & seafood",
    description: "Fresh fish, chicken, and marinated cuts.",
    icon: "fish",
  },
  {
    id: "pantry",
    name: "Pantry staples",
    description: "Rice, flour, lentils, spices, and sauces.",
    icon: "jar",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Tea, coffee, juices, and chilled drinks.",
    icon: "cup",
  },
  {
    id: "home",
    name: "Home care",
    description: "Cleaning essentials and household basics.",
    icon: "home",
  },
];

export const promoCards: PromoCard[] = [
  {
    id: "flash",
    eyebrow: "Today only",
    title: "Island harvest deals",
    description: "Up to 28% off vegetables, bananas, leafy greens, and pantry favorites.",
    accent: "from-[#ffe5c5] via-[#fff4df] to-[#fbe0d2]",
    metric: "60 min",
  },
  {
    id: "delivery",
    eyebrow: "Live operations",
    title: "One-hour delivery zones",
    description: "Backend-managed Colombo area coverage with instant GPS eligibility checks.",
    accent: "from-[#c7f1e5] via-[#effef9] to-[#d7f4ff]",
    metric: "7 zones",
  },
  {
    id: "new-user",
    eyebrow: "New here",
    title: "Register by mobile OTP",
    description: "Frictionless sign-up built for repeat grocery orders and local delivery trust.",
    accent: "from-[#ffe0e4] via-[#fff4f5] to-[#ffe9c8]",
    metric: "2 steps",
  },
];

export const highlightPills = [
  "Same-day slots",
  "GPS-based delivery check",
  "Sri Lanka mobile OTP",
  "Fresh picks by neighborhood",
  "Backend delivery zone control",
];

export const aisleHighlights = [
  {
    title: "Rice & curry essentials",
    text: "Keeri samba, red rice, dhal, coconut milk, and spice-box restocks.",
  },
  {
    title: "Breakfast in 10 minutes",
    text: "Milk, bread, eggs, jam, and tea bundles that land before the kettle boils.",
  },
  {
    title: "Home refill shelf",
    text: "Detergents, tissue, dishwash, and refills grouped for fast weekly top-ups.",
  },
];

export const products: Product[] = [
  {
    id: "banana-embul",
    name: "Embul Banana Bunch",
    category: "produce",
    unit: "700 g",
    price: 490,
    wasPrice: 620,
    badge: "Fresh today",
    origin: "Gampaha",
    rating: 4.8,
    eta: "35-45 min",
    tint: "bg-[#fff0d6]",
  },
  {
    id: "beans-french",
    name: "French Beans Premium",
    category: "produce",
    unit: "500 g",
    price: 540,
    badge: "Best seller",
    origin: "Nuwara Eliya",
    rating: 4.7,
    eta: "40 min",
    tint: "bg-[#dff6e9]",
  },
  {
    id: "kithul-jaggery",
    name: "Kithul Jaggery Block",
    category: "pantry",
    unit: "350 g",
    price: 860,
    wasPrice: 980,
    badge: "Sri Lankan pick",
    origin: "Kurunegala",
    rating: 4.9,
    eta: "45 min",
    tint: "bg-[#f7e3d0]",
  },
  {
    id: "coconut-milk",
    name: "Coconut Milk Classic",
    category: "pantry",
    unit: "400 ml",
    price: 320,
    badge: "Pantry hero",
    origin: "Colombo",
    rating: 4.6,
    eta: "35 min",
    tint: "bg-[#fbf0db]",
  },
  {
    id: "fresh-milk",
    name: "Fresh Cow Milk",
    category: "dairy",
    unit: "1 L",
    price: 690,
    badge: "Chilled",
    origin: "Hatton",
    rating: 4.5,
    eta: "30 min",
    tint: "bg-[#e8f1ff]",
  },
  {
    id: "country-eggs",
    name: "Country Eggs Pack",
    category: "dairy",
    unit: "10 pcs",
    price: 770,
    wasPrice: 860,
    badge: "Farm select",
    origin: "Kurunegala",
    rating: 4.8,
    eta: "35 min",
    tint: "bg-[#fff7d9]",
  },
  {
    id: "whole-bread",
    name: "Whole Wheat Sandwich Loaf",
    category: "bakery",
    unit: "450 g",
    price: 380,
    badge: "Baked today",
    origin: "Colombo 05",
    rating: 4.4,
    eta: "25 min",
    tint: "bg-[#f8e6d5]",
  },
  {
    id: "curd-kitul",
    name: "Buffalo Curd with Kithul",
    category: "dairy",
    unit: "500 ml",
    price: 960,
    badge: "Dessert favorite",
    origin: "Hambantota",
    rating: 4.9,
    eta: "45 min",
    tint: "bg-[#f7ecff]",
  },
  {
    id: "seer-fish",
    name: "Seer Fish Steaks",
    category: "seafood",
    unit: "500 g",
    price: 1890,
    wasPrice: 2120,
    badge: "Fresh catch",
    origin: "Negombo",
    rating: 4.7,
    eta: "50 min",
    tint: "bg-[#ddf4ff]",
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast Fillet",
    category: "seafood",
    unit: "600 g",
    price: 1450,
    badge: "Lean protein",
    origin: "Wattala",
    rating: 4.6,
    eta: "45 min",
    tint: "bg-[#ffe6de]",
  },
  {
    id: "ceylon-tea",
    name: "Single Estate Ceylon Tea",
    category: "beverages",
    unit: "100 bags",
    price: 1290,
    badge: "Premium brew",
    origin: "Dimbula",
    rating: 4.9,
    eta: "35 min",
    tint: "bg-[#e7f5dc]",
  },
  {
    id: "king-coconut",
    name: "King Coconut Juice",
    category: "beverages",
    unit: "1 bottle",
    price: 240,
    badge: "Hydration",
    origin: "Kalutara",
    rating: 4.5,
    eta: "30 min",
    tint: "bg-[#fff0b8]",
  },
  {
    id: "dishwash-refill",
    name: "Dishwash Refill Pouch",
    category: "home",
    unit: "500 ml",
    price: 430,
    badge: "Weekly refill",
    origin: "Colombo",
    rating: 4.3,
    eta: "40 min",
    tint: "bg-[#d7f4ff]",
  },
  {
    id: "laundry-liquid",
    name: "Laundry Liquid Clean Burst",
    category: "home",
    unit: "1.8 L",
    price: 1780,
    wasPrice: 1960,
    badge: "Value buy",
    origin: "Ja-Ela",
    rating: 4.4,
    eta: "50 min",
    tint: "bg-[#ebe7ff]",
  },
];

export const serviceMoments = [
  "Live order cut-off until 11:00 PM",
  "Substitution-ready inventory notes",
  "Cash, card, and wallet checkout paths",
  "Built for repeat orders and weekly baskets",
];

const deliveryZonesState: DeliveryZone[] = [
  {
    id: "colombo-03",
    name: "Colombo Central",
    district: "Colombo 03-07",
    center: { lat: 6.9046, lng: 79.8518 },
    radiusKm: 7.5,
    etaMinutes: 38,
    minOrder: 2500,
    active: true,
  },
  {
    id: "dehiwala",
    name: "Dehiwala Hub",
    district: "Dehiwala / Mount Lavinia",
    center: { lat: 6.848, lng: 79.8644 },
    radiusKm: 6.2,
    etaMinutes: 42,
    minOrder: 2500,
    active: true,
  },
  {
    id: "nugegoda",
    name: "Nugegoda Hub",
    district: "Nugegoda / Kohuwala",
    center: { lat: 6.8651, lng: 79.8992 },
    radiusKm: 5.8,
    etaMinutes: 46,
    minOrder: 2300,
    active: true,
  },
  {
    id: "battaramulla",
    name: "Battaramulla Hub",
    district: "Battaramulla / Rajagiriya",
    center: { lat: 6.9037, lng: 79.9184 },
    radiusKm: 6.4,
    etaMinutes: 44,
    minOrder: 2600,
    active: true,
  },
  {
    id: "wattala",
    name: "Wattala Hub",
    district: "Wattala / Peliyagoda",
    center: { lat: 6.992, lng: 79.8914 },
    radiusKm: 5.6,
    etaMinutes: 52,
    minOrder: 2600,
    active: true,
  },
  {
    id: "moratuwa",
    name: "Moratuwa Ready",
    district: "Moratuwa",
    center: { lat: 6.773, lng: 79.8828 },
    radiusKm: 4.8,
    etaMinutes: 58,
    minOrder: 2800,
    active: true,
  },
  {
    id: "kandy-preview",
    name: "Kandy Preview",
    district: "Kandy town",
    center: { lat: 7.2906, lng: 80.6337 },
    radiusKm: 4.2,
    etaMinutes: 68,
    minOrder: 3200,
    active: false,
  },
];

function cloneZone(zone: DeliveryZone): DeliveryZone {
  return {
    ...zone,
    center: { ...zone.center },
  };
}

export function getDeliveryZones() {
  return deliveryZonesState.map(cloneZone);
}

export function updateDeliveryZone(
  id: string,
  patch: Partial<Omit<DeliveryZone, "id" | "center">> & {
    center?: Partial<DeliveryZone["center"]>;
  },
) {
  const zone = deliveryZonesState.find((item) => item.id === id);

  if (!zone) {
    return null;
  }

  if (typeof patch.name === "string") {
    zone.name = patch.name;
  }

  if (typeof patch.district === "string") {
    zone.district = patch.district;
  }

  if (typeof patch.radiusKm === "number") {
    zone.radiusKm = patch.radiusKm;
  }

  if (typeof patch.etaMinutes === "number") {
    zone.etaMinutes = patch.etaMinutes;
  }

  if (typeof patch.minOrder === "number") {
    zone.minOrder = patch.minOrder;
  }

  if (typeof patch.active === "boolean") {
    zone.active = patch.active;
  }

  if (patch.center) {
    if (typeof patch.center.lat === "number") {
      zone.center.lat = patch.center.lat;
    }

    if (typeof patch.center.lng === "number") {
      zone.center.lng = patch.center.lng;
    }
  }

  return cloneZone(zone);
}
