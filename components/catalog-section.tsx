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

function getShelves(visibleProducts: typeof products) {
  const discounted = visibleProducts.filter((product) => product.wasPrice);
  const produce = visibleProducts.filter((product) => product.category === "produce");
  const staples = visibleProducts.filter(
    (product) =>
      product.category === "pantry" ||
      product.category === "dairy" ||
      product.category === "home",
  );

  return [
    {
      id: "deals",
      title: "Top deals",
      subtitle: "The first shelf should feel dense, promotional, and value-first like a supermarket landing page.",
      products: discounted.length ? discounted : visibleProducts.slice(0, 6),
      banner: "Extra savings on pantry and household essentials",
      tone: "bg-[#fff8df]",
    },
    {
      id: "fresh",
      title: "Fresh picks",
      subtitle: "Fast-moving fruit, vegetables, chilled items, and local favorites.",
      products: produce.length ? produce : visibleProducts.slice(0, 6),
      banner: "Daily selection from Nuwara Eliya, Hatton, Negombo, and Colombo",
      tone: "bg-[#edf4ff]",
    },
    {
      id: "essentials",
      title: "Daily essentials",
      subtitle: "Rice, dairy, cleaning refills, and everything customers reorder each week.",
      products: staples.length ? staples : visibleProducts.slice(0, 6),
      banner: "Weekly basket staples ready for same-day fulfillment",
      tone: "bg-[#fff1ee]",
    },
  ];
}

export function CatalogSection({
  activeCategory,
  visibleProducts,
  onAddToCart,
  onCategoryChange,
}: CatalogSectionProps) {
  const shelves = getShelves(visibleProducts);

  return (
    <section className="space-y-5">
      {activeCategory !== "all" ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
          Showing products for <span className="font-semibold text-[var(--ink)]">{activeCategory}</span>.
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className="ml-2 font-semibold text-[var(--accent)]"
          >
            Reset filter
          </button>
        </div>
      ) : null}

      {shelves.map((shelf) => (
        <div key={shelf.id} className="rounded-2xl border border-[var(--line)] bg-white">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] px-4 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Supermarket shelf
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
                {shelf.title}
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">
                {shelf.subtitle}
              </p>
            </div>
            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[var(--ink)] ${shelf.tone}`}
            >
              <Icon name="tag" className="h-4 w-4" />
              {shelf.banner}
            </button>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-6">
            {shelf.products.map((product) => {
              const discount =
                product.wasPrice && product.wasPrice > product.price
                  ? Math.round(((product.wasPrice - product.price) / product.wasPrice) * 100)
                  : null;

              return (
                <article
                  key={`${shelf.id}-${product.id}`}
                  className="rounded-2xl border border-[var(--line)] bg-white p-3 transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                >
                  <div className={`relative rounded-2xl ${product.tint} p-4`}>
                    <div className="flex items-start justify-between gap-2">
                      {discount ? (
                        <span className="rounded-full bg-[var(--danger)] px-2.5 py-1 text-[11px] font-bold text-white">
                          {discount}% OFF
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                          {product.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        className="rounded-full bg-white/85 p-2 text-[var(--muted)]"
                      >
                        <Icon name="star" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-10 flex h-16 items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/85 text-[var(--ink)] shadow-sm">
                        <Icon name={categoryIcon(product.category)} className="h-7 w-7" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {product.origin}
                    </p>
                    <h3 className="mt-1 min-h-[42px] text-sm font-semibold leading-5 text-[var(--ink)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{product.unit}</p>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-extrabold text-[var(--ink)]">
                        {formatCurrency(product.price)}
                      </p>
                      {product.wasPrice ? (
                        <p className="text-xs text-[var(--muted)] line-through">
                          {formatCurrency(product.wasPrice)}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right text-xs text-[var(--muted)]">
                      <p>{product.eta}</p>
                      <p>{product.rating.toFixed(1)} / 5</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(product.id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-[var(--ink)]"
                  >
                    <Icon name="cart" className="h-4 w-4" />
                    Add to cart
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
