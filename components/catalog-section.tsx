import { products } from "@/lib/store-data";
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

function buildShelves(visibleProducts: typeof products) {
  const discounted = visibleProducts.filter((product) => product.wasPrice);
  const fresh = visibleProducts.filter(
    (product) => product.category === "produce" || product.category === "seafood",
  );
  const pantry = visibleProducts.filter(
    (product) =>
      product.category === "pantry" ||
      product.category === "dairy" ||
      product.category === "beverages",
  );

  return [
    {
      id: "offer",
      title: "This week in your kitchen",
      subtitle: "Best-value staples for breakfast, lunch, dinner, and quick top-ups.",
      products: discounted.length ? discounted : visibleProducts.slice(0, 6),
      tone: "from-[#fff4d9] to-[#fffaf0]",
    },
    {
      id: "fresh",
      title: "Fresh from the market",
      subtitle: "Vegetables, fruit, fish, chicken, and chilled picks chosen for the week ahead.",
      products: fresh.length ? fresh : visibleProducts.slice(0, 6),
      tone: "from-[#edf8f3] to-[#fbfefc]",
    },
    {
      id: "pantry",
      title: "Home and pantry reorders",
      subtitle: "Rice, tea, milk, refills, and household basics worth keeping close at hand.",
      products: pantry.length ? pantry : visibleProducts.slice(0, 6),
      tone: "from-[#f7f3ff] to-[#fcfbff]",
    },
  ];
}

export function CatalogSection({
  activeCategory,
  visibleProducts,
  onAddToCart,
  onCategoryChange,
}: CatalogSectionProps) {
  const shelves = buildShelves(visibleProducts);

  return (
    <section className="space-y-6">
      {activeCategory !== "all" ? (
        <div className="rounded-[24px] border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--muted)] shadow-[0_10px_24px_rgba(22,50,44,0.04)]">
          Browsing <span className="font-semibold text-[var(--ink)]">{activeCategory}</span>.
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className="ml-2 font-semibold text-[var(--accent)]"
          >
            Show all
          </button>
        </div>
      ) : null}

      {shelves.map((shelf) => (
        <article
          key={shelf.id}
          className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-white shadow-[0_18px_42px_rgba(22,50,44,0.05)]"
        >
          <div className={`bg-gradient-to-r ${shelf.tone} px-5 py-5`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Curated shelf
                </p>
                <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
                  {shelf.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {shelf.subtitle}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent)] shadow-sm">
                <Icon name="spark" className="h-4 w-4" />
                Handpicked for fast shopping
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {shelf.products.map((product) => {
              const discount =
                product.wasPrice && product.wasPrice > product.price
                  ? Math.round(((product.wasPrice - product.price) / product.wasPrice) * 100)
                  : null;

              return (
                <article
                  key={`${shelf.id}-${product.id}`}
                  className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_36px_rgba(22,50,44,0.08)]"
                >
                  <div className={`rounded-[24px] ${product.tint} p-4`}>
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          discount
                            ? "bg-[var(--danger)] text-white"
                            : "bg-white/85 text-[var(--muted)]"
                        }`}
                      >
                        {discount ? `${discount}% off` : product.badge}
                      </span>
                      <div className="rounded-full bg-white/88 p-2 text-[var(--accent)]">
                        <Icon name={categoryIcon(product.category)} className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="rounded-[20px] bg-white/85 px-3 py-2 text-xs font-semibold text-[var(--ink)] shadow-sm">
                        {product.origin}
                      </div>
                      <div className="text-right text-xs text-[var(--muted)]">
                        <p>{product.eta}</p>
                        <p>{product.rating.toFixed(1)} rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold leading-6 text-[var(--ink)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{product.unit}</p>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
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
                    <button
                      type="button"
                      onClick={() => onAddToCart(product.id)}
                      className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
}
