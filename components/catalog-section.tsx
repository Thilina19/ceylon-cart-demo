import { categories, products } from "@/lib/store-data";
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
  visibleProducts: typeof products;
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

export function CatalogSection({
  activeCategory,
  visibleProducts,
  onAddToCart,
  onCategoryChange,
}: CatalogSectionProps) {
  return (
    <section className="rounded-[34px] border border-[var(--line)] bg-white p-5 shadow-[0_24px_48px_rgba(25,52,44,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Browse products
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold">
            Fast-moving grocery shelves
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            The layout borrows the dense merchandising rhythm of large marketplace grocery pages,
            but uses a warmer Sri Lankan identity with cream backgrounds, deep green anchors, and
            coral highlights.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[var(--brand)] text-white shadow-[0_14px_30px_rgba(15,140,118,0.22)]"
                    : "border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:bg-white"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <article
            key={product.id}
            className="group rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_36px_rgba(25,52,44,0.05)] transition hover:-translate-y-1 hover:bg-white"
          >
            <div
              className={`flex min-h-[152px] items-start justify-between rounded-[24px] ${product.tint} p-4`}
            >
              <div>
                <span className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-[var(--muted)]">
                  {product.badge}
                </span>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 text-[var(--brand-deep)]">
                <Icon name={categoryIcon(product.category)} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                {product.origin}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">{product.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{product.unit}</p>
            </div>

            <div className="mt-4 flex items-end justify-between">
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
              <div className="text-right text-sm text-[var(--muted)]">
                <p>{product.eta}</p>
                <p>{product.rating.toFixed(1)} rating</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart(product.id)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-[var(--brand-deep)]"
            >
              <Icon name="cart" className="h-4 w-4" />
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
