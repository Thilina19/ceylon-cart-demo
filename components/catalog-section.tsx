import Image from "next/image";
import type { Category, Product } from "@/lib/store-data";
import { Icon } from "@/components/icons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

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

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (productId: string) => void;
}) {
  const discount =
    product.wasPrice && product.wasPrice > product.price
      ? Math.round(((product.wasPrice - product.price) / product.wasPrice) * 100)
      : null;

  return (
    <article className="group rounded-[28px] border border-white/45 bg-white/62 p-4 shadow-[0_16px_40px_rgba(31,70,61,0.08)] backdrop-blur-xl transition hover:-translate-y-1">
      <div className={`rounded-[24px] ${product.tint} p-5`}>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/76 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            {product.badge}
          </span>
          <div className="rounded-full bg-white/76 p-2 text-[var(--accent)]">
            <Icon name={categoryIcon(product.category)} className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-8 h-20 rounded-[20px] bg-white/40" />
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold leading-6 text-[var(--ink)]">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <span>{product.unit}</span>
          <span>{product.rating.toFixed(1)} rating</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-[var(--ink)]">
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
        className="mt-4 w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-[var(--ink)]"
      >
        Add to basket
      </button>
    </article>
  );
}

type CatalogSectionProps = {
  activeCategory: string;
  categories: Category[];
  locationReady: boolean;
  selectedZoneName: string | null;
  visibleProducts: Product[];
  onAddToCart: (productId: string) => void;
  onCategoryChange: (value: string) => void;
};

export function CatalogSection({
  activeCategory,
  categories,
  locationReady,
  selectedZoneName,
  visibleProducts,
  onAddToCart,
  onCategoryChange,
}: CatalogSectionProps) {
  const browseCategories = categories.filter((category) => category.id !== "all").slice(0, 6);
  const featuredProducts = visibleProducts.slice(0, 6);
  const bestSellers = [...visibleProducts]
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 8);
  const produceProducts = visibleProducts.filter((product) => product.category === "produce").slice(0, 4);
  const pantryProducts = visibleProducts.filter((product) => product.category === "pantry").slice(0, 4);
  const chilledProducts = visibleProducts
    .filter((product) => product.category === "dairy" || product.category === "beverages")
    .slice(0, 4);

  return (
    <section className="space-y-8">
      <div className="rounded-[34px] border border-white/50 bg-white/58 p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Explore categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              Shop by aisle
            </h2>
          </div>
          {locationReady ? (
            <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
              Showing products for {selectedZoneName}
            </div>
          ) : (
            <div className="rounded-full bg-[#fff6da] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
              Use GPS to load products for your area
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {browseCategories.map((category) => {
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`rounded-[24px] border px-4 py-5 text-left transition ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-white/50 bg-white/70"
                }`}
              >
                <div className="inline-flex rounded-full bg-white p-3 text-[var(--accent)] shadow-sm">
                  <Icon name={categoryIcon(category.id)} className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-[var(--ink)]">
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {!locationReady ? (
        <div className="overflow-hidden rounded-[36px] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(212,245,236,0.55))] p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Location first
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold leading-tight text-[var(--ink)]">
                We only show products available for your delivery area.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
                Turn on GPS from the top of the page, and the store will instantly filter to the products that can actually be delivered to you.
              </p>
            </div>
            <div className="relative min-h-[240px] overflow-hidden rounded-[28px]">
              <Image
                src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh produce assortment"
                fill
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,28,24,0.04)_0%,rgba(11,28,24,0.45)_100%)]" />
            </div>
          </div>
        </div>
      ) : null}

      {locationReady ? (
        <>
          <div className="rounded-[34px] border border-white/50 bg-white/58 p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Featured products
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                  Fresh picks for your basket
                </h2>
              </div>
              {activeCategory !== "all" ? (
                <button
                  type="button"
                  onClick={() => onCategoryChange("all")}
                  className="rounded-full bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
                >
                  Clear filter
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-[34px] border border-white/50 bg-[linear-gradient(120deg,rgba(224,250,241,0.84),rgba(255,255,255,0.68))] p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Weekly deal
              </p>
              <h3 className="mt-3 font-[var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
                Free delivery over LKR 5,000
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
                Build one complete basket and unlock better value across pantry, produce, and home care.
              </p>
              <button
                type="button"
                onClick={() => onCategoryChange("pantry")}
                className="mt-5 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                Shop now
              </button>
            </div>

            <div className="overflow-hidden rounded-[34px] border border-white/50 bg-[linear-gradient(120deg,rgba(255,250,229,0.86),rgba(255,255,255,0.68))] p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-deep)]">
                Organic selection
              </p>
              <h3 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
                Clean, simple grocery shopping
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
                Fewer distractions, faster browsing, and only the products your delivery hub can actually fulfill.
              </p>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/50 bg-white/58 p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Daily best sells
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                  Fast-moving items in your area
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {[
              { title: "Top sale", products: produceProducts, category: "produce" },
              { title: "Pantry picks", products: pantryProducts, category: "pantry" },
              { title: "Daily chilled", products: chilledProducts, category: "dairy" },
            ].map((group) => (
              <section
                key={group.title}
                className="rounded-[34px] border border-white/50 bg-white/58 p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      {group.title}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                      {categories.find((category) => category.id === group.category)?.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCategoryChange(group.category)}
                    className="rounded-full bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {group.products.map((product) => (
                    <div
                      key={`${group.title}-${product.id}`}
                      className="flex items-center justify-between gap-3 rounded-[22px] border border-white/40 bg-white/72 px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{product.name}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{product.unit}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          {formatCurrency(product.price)}
                        </p>
                        <button
                          type="button"
                          onClick={() => onAddToCart(product.id)}
                          className="rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="overflow-hidden rounded-[36px] border border-white/50 bg-[linear-gradient(135deg,rgba(221,248,241,0.88),rgba(255,255,255,0.66))] p-6 shadow-[0_20px_45px_rgba(31,70,61,0.08)] backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Shop faster
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-5xl font-semibold leading-tight text-[var(--ink)]">
                  Built for quick grocery decisions
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
                  Find what is available for your location, add it in a few taps, and keep your weekly order feeling light and easy.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    App Store
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--line)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--ink)]"
                  >
                    Google Play
                  </button>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden rounded-[30px]">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Groceries and fresh produce"
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,28,24,0.1)_0%,rgba(11,28,24,0.42)_100%)]" />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
