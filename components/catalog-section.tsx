import Image from "next/image";
import type { Product } from "@/lib/store-data";
import { Icon } from "@/components/icons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type CatalogSectionProps = {
  activeCategory: string;
  visibleProducts: Product[];
  onAddToCart: (productId: string) => void;
  onCategoryChange: (value: string) => void;
};

function categoryIcon(category: string) {
  switch (category) {
    case "produce":
      return "leaf";
    case "seafood":
      return "fish";
    case "home":
      return "home";
    case "beverages":
      return "cup";
    case "bakery":
      return "bread";
    case "dairy":
      return "drop";
    default:
      return "jar";
  }
}

function buildRows(visibleProducts: Product[]) {
  const fresh = visibleProducts.filter(
    (product) => product.category === "produce" || product.category === "seafood",
  );
  const pantry = visibleProducts.filter(
    (product) =>
      product.category === "pantry" ||
      product.category === "dairy" ||
      product.category === "beverages",
  );
  const home = visibleProducts.filter(
    (product) => product.category === "home" || product.category === "bakery",
  );

  return [
    {
      id: "fresh",
      title: "Fresh for tonight",
      subtitle: "Quick picks when dinner is the next thing on your mind.",
      image:
        "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
      products: fresh.length ? fresh.slice(0, 4) : visibleProducts.slice(0, 4),
      tone: "bg-[#eef8f2]",
    },
    {
      id: "pantry",
      title: "Pantry, tea, and breakfast",
      subtitle: "Comfort items you keep coming back for through the week.",
      image:
        "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80",
      products: pantry.length ? pantry.slice(0, 4) : visibleProducts.slice(4, 8),
      tone: "bg-[#fff8ea]",
    },
    {
      id: "home",
      title: "Home care and daily restocks",
      subtitle: "The practical shelf for repeat orders and easy household top-ups.",
      image:
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=80",
      products: home.length ? home.slice(0, 4) : visibleProducts.slice(8, 12),
      tone: "bg-[#f4f2ff]",
    },
  ];
}

export function CatalogSection({
  activeCategory,
  visibleProducts,
  onAddToCart,
  onCategoryChange,
}: CatalogSectionProps) {
  const rows = visibleProducts.length ? buildRows(visibleProducts) : [];

  return (
    <section className="space-y-10">
      {activeCategory !== "all" ? (
        <div className="rounded-full bg-white px-5 py-3 text-sm text-[var(--muted)] shadow-[0_10px_24px_rgba(22,50,44,0.05)]">
          Browsing <span className="font-semibold text-[var(--ink)]">{activeCategory}</span>.
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className="ml-2 font-semibold text-[var(--accent)]"
          >
            Clear filter
          </button>
        </div>
      ) : null}

      {!visibleProducts.length ? (
        <div className="rounded-[32px] bg-white px-6 py-10 text-center shadow-[0_18px_42px_rgba(22,50,44,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            No products found
          </p>
          <p className="mt-3 text-lg text-[var(--ink)]">
            Try another search term or switch back to all aisles.
          </p>
        </div>
      ) : null}

      {rows.map((row, index) => (
        <section
          key={row.id}
          className={`grid gap-6 xl:grid-cols-[0.92fr_1.08fr] ${
            index % 2 === 1 ? "xl:[&>*:first-child]:order-2 xl:[&>*:last-child]:order-1" : ""
          }`}
        >
          <div className="relative min-h-[420px] overflow-hidden rounded-[36px]">
            <Image
              src={row.image}
              alt={row.title}
              fill
              sizes="(max-width: 1279px) 100vw, 45vw"
              className="object-cover transition duration-700 hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,20,0.04)_0%,rgba(15,24,20,0.58)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Curated collection
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold leading-tight">
                {row.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/76">
                {row.subtitle}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {row.products.map((product) => {
              const discount =
                product.wasPrice && product.wasPrice > product.price
                  ? Math.round(((product.wasPrice - product.price) / product.wasPrice) * 100)
                  : null;

              return (
                <article
                  key={`${row.id}-${product.id}`}
                  className={`rounded-[30px] ${row.tone} p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(22,50,44,0.08)]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        {product.origin}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink)]">
                        {product.name}
                      </h3>
                    </div>
                    <div className="rounded-full bg-white/90 p-3 text-[var(--accent)] shadow-sm">
                      <Icon name={categoryIcon(product.category)} className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)] shadow-sm">
                      {product.unit}
                    </div>
                    <div className="text-right text-xs text-[var(--muted)]">
                      <p>{product.eta}</p>
                      <p>{product.rating.toFixed(1)} rating</p>
                    </div>
                  </div>

                  <div className="mt-7 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold text-[var(--ink)]">
                        {formatCurrency(product.price)}
                      </p>
                      {product.wasPrice ? (
                        <p className="text-sm text-[var(--muted)] line-through">
                          {formatCurrency(product.wasPrice)}
                        </p>
                      ) : null}
                    </div>
                    {discount ? (
                      <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-semibold text-white">
                        {discount}% off
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(product.id)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Icon name="cart" className="h-4 w-4" />
                    Add to basket
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}
