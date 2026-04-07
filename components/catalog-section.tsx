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
  compact = false,
  product,
  onAddToCart,
}: {
  compact?: boolean;
  product: Product;
  onAddToCart: (productId: string) => void;
}) {
  const discount =
    product.wasPrice && product.wasPrice > product.price
      ? Math.round(((product.wasPrice - product.price) / product.wasPrice) * 100)
      : null;

  return (
    <article className="group rounded-[18px] border border-[var(--line)] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
      <div className={`relative overflow-hidden rounded-[16px] ${compact ? "p-4" : "p-5"} ${product.tint}`}>
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0e7a5f]">
            {product.badge}
          </span>
          {discount ? (
            <span className="rounded-full bg-[#fff2b8] px-2.5 py-1 text-[10px] font-bold text-[#5d4b00]">
              {discount}% OFF
            </span>
          ) : null}
        </div>
        <div className={`flex items-center justify-center ${compact ? "h-20" : "h-28"}`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/72 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">
            <Icon
              name={categoryIcon(product.category)}
              className="h-8 w-8 text-[#1f1f1f]"
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#2a2a2a]">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">{product.unit}</p>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-base font-bold text-[#202020]">
            {formatCurrency(product.price)}
          </p>
          {product.wasPrice ? (
            <p className="text-xs text-[var(--muted)] line-through">
              {formatCurrency(product.wasPrice)}
            </p>
          ) : (
            <p className="text-xs text-[var(--muted)]">Inclusive of VAT</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product.id)}
          className="rounded-lg bg-[#0f9d68] px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-[#0d885a]"
        >
          Add
        </button>
      </div>
    </article>
  );
}

function SectionHeading({
  actionLabel,
  title,
  onAction,
}: {
  actionLabel?: string;
  title: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-[#2a2a2a] sm:text-xl">{title}</h2>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-semibold text-[#0f9d68]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

type CatalogSectionProps = {
  activeCategory: string;
  categories: Category[];
  visibleProducts: Product[];
  onAddToCart: (productId: string) => void;
  onCategoryChange: (value: string) => void;
};

export function CatalogSection({
  activeCategory,
  categories,
  visibleProducts,
  onAddToCart,
  onCategoryChange,
}: CatalogSectionProps) {
  const browseCategories = categories.filter((category) => category.id !== "all").slice(0, 6);
  const featuredProducts = visibleProducts.slice(0, 6);
  const bestSellers = [...visibleProducts]
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 5);
  const topSale = visibleProducts.slice(0, 4);
  const topRated = [...visibleProducts]
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 4);
  const pantryPicks = visibleProducts
    .filter((product) => product.category === "pantry" || product.category === "home")
    .slice(0, 4);
  const beveragePicks = visibleProducts
    .filter((product) => product.category === "beverages" || product.category === "dairy")
    .slice(0, 4);
  const appShowcase = visibleProducts.slice(0, 3);

  return (
    <section className="space-y-6">
      <section className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
        <SectionHeading title="Explore Categories" />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {browseCategories.map((category) => {
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`rounded-[18px] border p-4 text-left transition ${
                  active
                    ? "border-[#0f9d68] bg-[#eff9f4]"
                    : "border-[var(--line)] bg-[#fafafa]"
                }`}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
                  <Icon
                    name={categoryIcon(category.id)}
                    className="h-5 w-5 text-[#0f9d68]"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#2a2a2a]">
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
        <SectionHeading
          title="Featured Products"
          actionLabel={activeCategory !== "all" ? "Clear filter" : undefined}
          onAction={activeCategory !== "all" ? () => onCategoryChange("all") : undefined}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[22px] bg-[#fff4d1] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            Free delivery over 5000
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#2a2a2a]">
            Build a weekly basket and save more.
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-black/58">
            Stock pantry essentials, bakery items, and home care products in one order.
          </p>
          <button
            type="button"
            onClick={() => onCategoryChange("pantry")}
            className="mt-5 rounded-lg bg-[#0f9d68] px-5 py-3 text-sm font-semibold text-white"
          >
            Shop now
          </button>
        </article>

        <article className="overflow-hidden rounded-[22px] bg-[#dff5ec] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
            Organic picks
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#2a2a2a]">
            Fresh finds for everyday cooking.
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-black/58">
            Produce, chilled basics, and easy add-ons selected for fast home shopping.
          </p>
          <button
            type="button"
            onClick={() => onCategoryChange("produce")}
            className="mt-5 rounded-lg bg-white/75 px-5 py-3 text-sm font-semibold text-[#1f1f1f] backdrop-blur-sm"
          >
            View fresh picks
          </button>
        </article>
      </section>

      <section className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
        <SectionHeading title="Daily Best Sells" actionLabel="View all" onAction={() => onCategoryChange("all")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              compact
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { title: "Top Sale", items: topSale, target: "all" },
          { title: "Top Rated", items: topRated, target: "all" },
          { title: "Pantry Picks", items: pantryPicks, target: "pantry" },
          { title: "Beverage Picks", items: beveragePicks, target: "beverages" },
        ].map((group) => (
          <article
            key={group.title}
            className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
          >
            <SectionHeading
              title={group.title}
              actionLabel="View all"
              onAction={() => onCategoryChange(group.target)}
            />
            <div className="space-y-3">
              {group.items.map((product) => (
                <div
                  key={`${group.title}-${product.id}`}
                  className="flex items-center gap-3 rounded-[16px] border border-[var(--line)] p-3"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] ${product.tint}`}
                  >
                    <Icon
                      name={categoryIcon(product.category)}
                      className="h-6 w-6 text-[#1f1f1f]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#2a2a2a]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{product.unit}</p>
                    <p className="mt-1 text-sm font-bold text-[#202020]">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product.id)}
                    className="rounded-lg bg-[#0f9d68] px-3 py-2 text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,#dff5ec,#ebfff8)] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Shop faster with the app
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2a2a2a]">
              Groceries in a faster, simpler flow.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-black/58">
              Save your basket, reorder household staples, and get through weekly shopping in minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-xl bg-[#1f1f1f] px-4 py-3 text-sm font-semibold text-white">
                App Store
              </span>
              <span className="rounded-xl bg-[#1f1f1f] px-4 py-3 text-sm font-semibold text-white">
                Google Play
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {appShowcase.map((product, index) => (
              <div
                key={`app-${product.id}`}
                className={`rounded-[26px] border border-white/70 bg-white/76 p-4 shadow-[0_18px_34px_rgba(0,0,0,0.06)] backdrop-blur-md ${
                  index === 1 ? "sm:-translate-y-3" : ""
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-black/42">
                    Basket
                  </span>
                  <Icon name="cart" className="h-4 w-4 text-[#0f9d68]" />
                </div>
                <div
                  className={`flex h-24 items-center justify-center rounded-[20px] ${product.tint}`}
                >
                  <Icon
                    name={categoryIcon(product.category)}
                    className="h-10 w-10 text-[#1f1f1f]"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#2a2a2a]">
                  {product.name}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">{product.unit}</p>
                <p className="mt-3 text-base font-bold text-[#202020]">
                  {formatCurrency(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
