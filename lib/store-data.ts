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

export type AnnouncementBanner = {
  active: boolean;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type PromoPopup = {
  id: string;
  active: boolean;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  availableZoneIds: string[];
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

export type StorefrontData = {
  announcementBanner: AnnouncementBanner;
  categories: Category[];
  promoCards: PromoCard[];
  promoPopup: PromoPopup;
  highlightPills: string[];
  products: Product[];
  deliveryZones: DeliveryZone[];
};

export type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
};

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "delivering" | "completed";

export type OrderRecord = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  zoneId: string | null;
  createdAt: string;
};

export const categoriesSeed: Category[] = [
  { id: "all", name: "All aisles", description: "Everything from fresh fruit to home care.", icon: "grid" },
  { id: "produce", name: "Fresh produce", description: "Daily vegetables, herbs, and tropical fruit.", icon: "leaf" },
  { id: "bakery", name: "Bakery", description: "Bread, buns, cakes, and breakfast picks.", icon: "bread" },
  { id: "dairy", name: "Dairy & eggs", description: "Milk, curd, butter, yogurt, and eggs.", icon: "drop" },
  { id: "seafood", name: "Meat & seafood", description: "Fresh fish, chicken, and marinated cuts.", icon: "fish" },
  { id: "pantry", name: "Pantry staples", description: "Rice, flour, lentils, spices, and sauces.", icon: "jar" },
  { id: "beverages", name: "Beverages", description: "Tea, coffee, juices, and chilled drinks.", icon: "cup" },
  { id: "home", name: "Home care", description: "Cleaning essentials and household basics.", icon: "home" },
];

export const promoCardsSeed: PromoCard[] = [
  {
    id: "flash",
    eyebrow: "Fresh today",
    title: "Up to 25% off produce",
    description: "Daily-picked fruit, greens, roots, and salad basics from trusted local suppliers.",
    accent: "from-[#ffe39f] via-[#fff2cb] to-[#fff9e7]",
    metric: "Shop now",
  },
  {
    id: "delivery",
    eyebrow: "Express",
    title: "Get it in 60 minutes",
    description: "Fast grocery delivery across selected Colombo neighborhoods for everyday essentials.",
    accent: "from-[#d7e8ff] via-[#edf4ff] to-[#f6faff]",
    metric: "View areas",
  },
  {
    id: "new-user",
    eyebrow: "Weekend picks",
    title: "Stock up and save more",
    description: "Multi-buy offers on pantry staples, home care, chilled drinks, and family-size packs.",
    accent: "from-[#ffe5db] via-[#fff1eb] to-[#fff7f2]",
    metric: "See offers",
  },
];

export const announcementBannerSeed: AnnouncementBanner = {
  active: true,
  text: "Free delivery above LKR 5,000 on this week's supermarket orders.",
  ctaLabel: "Shop now",
  ctaHref: "#top",
};

export const promoPopupSeed: PromoPopup = {
  id: "new-weekly-basket",
  active: true,
  eyebrow: "This week only",
  title: "Build your weekly basket faster",
  description:
    "Fresh produce, pantry staples, and household essentials in one order with express delivery across selected areas.",
  primaryLabel: "Start shopping",
  secondaryLabel: "Maybe later",
  image:
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
};

export const highlightPillsSeed = [
  "Supermarket deals",
  "Daily deals",
  "Fresh arrivals",
  "Best sellers",
  "Weekly savings",
];

export const productsSeed: Product[] = [
  { id: "banana-embul", name: "Embul Banana Bunch", category: "produce", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla"], unit: "700 g", price: 490, wasPrice: 620, badge: "Fresh today", origin: "Gampaha", rating: 4.8, eta: "35-45 min", tint: "bg-[#fff0d6]" },
  { id: "beans-french", name: "French Beans Premium", category: "produce", availableZoneIds: ["colombo-03", "nugegoda", "battaramulla", "wattala"], unit: "500 g", price: 540, badge: "Best seller", origin: "Nuwara Eliya", rating: 4.7, eta: "40 min", tint: "bg-[#dff6e9]" },
  { id: "kithul-jaggery", name: "Kithul Jaggery Block", category: "pantry", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala", "moratuwa"], unit: "350 g", price: 860, wasPrice: 980, badge: "Sri Lankan pick", origin: "Kurunegala", rating: 4.9, eta: "45 min", tint: "bg-[#f7e3d0]" },
  { id: "coconut-milk", name: "Coconut Milk Classic", category: "pantry", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala", "moratuwa"], unit: "400 ml", price: 320, badge: "Pantry hero", origin: "Colombo", rating: 4.6, eta: "35 min", tint: "bg-[#fbf0db]" },
  { id: "fresh-milk", name: "Fresh Cow Milk", category: "dairy", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla"], unit: "1 L", price: 690, badge: "Chilled", origin: "Hatton", rating: 4.5, eta: "30 min", tint: "bg-[#e8f1ff]" },
  { id: "country-eggs", name: "Country Eggs Pack", category: "dairy", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "moratuwa"], unit: "10 pcs", price: 770, wasPrice: 860, badge: "Farm select", origin: "Kurunegala", rating: 4.8, eta: "35 min", tint: "bg-[#fff7d9]" },
  { id: "whole-bread", name: "Whole Wheat Sandwich Loaf", category: "bakery", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala"], unit: "450 g", price: 380, badge: "Baked today", origin: "Colombo 05", rating: 4.4, eta: "25 min", tint: "bg-[#f8e6d5]" },
  { id: "curd-kitul", name: "Buffalo Curd with Kithul", category: "dairy", availableZoneIds: ["colombo-03", "dehiwala", "moratuwa"], unit: "500 ml", price: 960, badge: "Dessert favorite", origin: "Hambantota", rating: 4.9, eta: "45 min", tint: "bg-[#f7ecff]" },
  { id: "seer-fish", name: "Seer Fish Steaks", category: "seafood", availableZoneIds: ["colombo-03", "dehiwala", "wattala"], unit: "500 g", price: 1890, wasPrice: 2120, badge: "Fresh catch", origin: "Negombo", rating: 4.7, eta: "50 min", tint: "bg-[#ddf4ff]" },
  { id: "chicken-breast", name: "Chicken Breast Fillet", category: "seafood", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala"], unit: "600 g", price: 1450, badge: "Lean protein", origin: "Wattala", rating: 4.6, eta: "45 min", tint: "bg-[#ffe6de]" },
  { id: "ceylon-tea", name: "Single Estate Ceylon Tea", category: "beverages", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala", "moratuwa"], unit: "100 bags", price: 1290, badge: "Premium brew", origin: "Dimbula", rating: 4.9, eta: "35 min", tint: "bg-[#e7f5dc]" },
  { id: "king-coconut", name: "King Coconut Juice", category: "beverages", availableZoneIds: ["colombo-03", "dehiwala", "moratuwa"], unit: "1 bottle", price: 240, badge: "Hydration", origin: "Kalutara", rating: 4.5, eta: "30 min", tint: "bg-[#fff0b8]" },
  { id: "dishwash-refill", name: "Dishwash Refill Pouch", category: "home", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala", "moratuwa"], unit: "500 ml", price: 430, badge: "Weekly refill", origin: "Colombo", rating: 4.3, eta: "40 min", tint: "bg-[#d7f4ff]" },
  { id: "laundry-liquid", name: "Laundry Liquid Clean Burst", category: "home", availableZoneIds: ["colombo-03", "dehiwala", "nugegoda", "battaramulla", "wattala"], unit: "1.8 L", price: 1780, wasPrice: 1960, badge: "Value buy", origin: "Ja-Ela", rating: 4.4, eta: "50 min", tint: "bg-[#ebe7ff]" },
];

export const deliveryZonesSeed: DeliveryZone[] = [
  { id: "colombo-03", name: "Colombo Central", district: "Colombo 03-07", center: { lat: 6.9046, lng: 79.8518 }, radiusKm: 7.5, etaMinutes: 38, minOrder: 2500, active: true },
  { id: "dehiwala", name: "Dehiwala Hub", district: "Dehiwala / Mount Lavinia", center: { lat: 6.848, lng: 79.8644 }, radiusKm: 6.2, etaMinutes: 42, minOrder: 2500, active: true },
  { id: "nugegoda", name: "Nugegoda Hub", district: "Nugegoda / Kohuwala", center: { lat: 6.8651, lng: 79.8992 }, radiusKm: 5.8, etaMinutes: 46, minOrder: 2300, active: true },
  { id: "battaramulla", name: "Battaramulla Hub", district: "Battaramulla / Rajagiriya", center: { lat: 6.9037, lng: 79.9184 }, radiusKm: 6.4, etaMinutes: 44, minOrder: 2600, active: true },
  { id: "wattala", name: "Wattala Hub", district: "Wattala / Peliyagoda", center: { lat: 6.992, lng: 79.8914 }, radiusKm: 5.6, etaMinutes: 52, minOrder: 2600, active: true },
  { id: "moratuwa", name: "Moratuwa Ready", district: "Moratuwa", center: { lat: 6.773, lng: 79.8828 }, radiusKm: 4.8, etaMinutes: 58, minOrder: 2800, active: true },
  { id: "kandy-preview", name: "Kandy Preview", district: "Kandy town", center: { lat: 7.2906, lng: 80.6337 }, radiusKm: 4.2, etaMinutes: 68, minOrder: 3200, active: false },
];

export function createSeedStorefrontData(): StorefrontData {
  return {
    announcementBanner: structuredClone(announcementBannerSeed),
    categories: structuredClone(categoriesSeed),
    promoCards: structuredClone(promoCardsSeed),
    promoPopup: structuredClone(promoPopupSeed),
    highlightPills: structuredClone(highlightPillsSeed),
    products: structuredClone(productsSeed),
    deliveryZones: structuredClone(deliveryZonesSeed),
  };
}
