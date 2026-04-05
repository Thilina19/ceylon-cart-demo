"use client";

import type { Category, Product } from "@/lib/store-data";
import { Field, Panel, parseNumberInput } from "@/components/admin/admin-ui";

type NewProductState = {
  name: string;
  category: string;
  unit: string;
  price: string;
  wasPrice: string;
  badge: string;
  origin: string;
  rating: string;
  eta: string;
  tint: string;
};

export function AdminProducts({
  categories,
  isPending,
  newProduct,
  onCreateProduct,
  onDeleteProduct,
  onNewProductChange,
  onProductSearchChange,
  onSaveSelectedProduct,
  onProductSelect,
  onProductUpdate,
  productSearch,
  products,
  selectedProduct,
}: {
  categories: Category[];
  isPending: boolean;
  newProduct: NewProductState;
  onCreateProduct: () => void;
  onDeleteProduct: (productId: string) => void;
  onNewProductChange: (field: keyof NewProductState, value: string) => void;
  onProductSearchChange: (value: string) => void;
  onSaveSelectedProduct: (product: Product) => void;
  onProductSelect: (productId: string) => void;
  onProductUpdate: (
    productId: string,
    field: keyof Product,
    value: string | number | undefined,
  ) => void;
  productSearch: string;
  products: Product[];
  selectedProduct: Product | null;
}) {
  const sellableCategories = categories.filter((category) => category.id !== "all");

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <Panel
        title="All products"
        subtitle="Search the catalog and open one focused editor instead of scrolling through dozens of repeated forms."
      >
        <Field
          label="Search products"
          value={productSearch}
          onChange={onProductSearchChange}
        />

        <div className="mt-5 space-y-3">
          {products.map((product) => {
            const active = product.id === selectedProduct?.id;

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onProductSelect(product.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[22px] border px-4 py-4 text-left transition ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                    : "border-[var(--line)] bg-[var(--surface-strong)] text-[var(--ink)] hover:border-[var(--brand)]"
                }`}
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-[var(--muted)]"}`}>
                    {product.category} - {product.origin}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">LKR {product.price}</p>
                  <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-[var(--muted)]"}`}>
                    {product.unit}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel
          title={selectedProduct ? "Edit selected product" : "Select a product"}
          subtitle="The chosen item opens here with all of its editable fields."
          actions={
            selectedProduct ? (
              <>
                <button
                  type="button"
                  onClick={() => onSaveSelectedProduct(selectedProduct)}
                  disabled={isPending}
                  className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(selectedProduct.id)}
                  disabled={isPending}
                  className="rounded-full border border-[#f2c0c3] bg-[#fff2f2] px-4 py-2 text-sm font-semibold text-[var(--danger)] disabled:opacity-60"
                >
                  Delete
                </button>
              </>
            ) : null
          }
        >
          {selectedProduct ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field
                label="Name"
                value={selectedProduct.name}
                onChange={(value) =>
                  onProductUpdate(selectedProduct.id, "name", value)
                }
              />
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Category
                </span>
                <select
                  value={selectedProduct.category}
                  onChange={(event) =>
                    onProductUpdate(
                      selectedProduct.id,
                      "category",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)]"
                >
                  {sellableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Unit"
                value={selectedProduct.unit}
                onChange={(value) =>
                  onProductUpdate(selectedProduct.id, "unit", value)
                }
              />
              <Field
                label="Price"
                type="number"
                value={String(selectedProduct.price)}
                onChange={(value) =>
                  onProductUpdate(
                    selectedProduct.id,
                    "price",
                    Number(value || selectedProduct.price),
                  )
                }
              />
              <Field
                label="Was price"
                type="number"
                value={selectedProduct.wasPrice ? String(selectedProduct.wasPrice) : ""}
                onChange={(value) =>
                  onProductUpdate(
                    selectedProduct.id,
                    "wasPrice",
                    parseNumberInput(value) ?? undefined,
                  )
                }
              />
              <Field
                label="Badge"
                value={selectedProduct.badge}
                onChange={(value) =>
                  onProductUpdate(selectedProduct.id, "badge", value)
                }
              />
              <Field
                label="Origin"
                value={selectedProduct.origin}
                onChange={(value) =>
                  onProductUpdate(selectedProduct.id, "origin", value)
                }
              />
              <Field
                label="Rating"
                type="number"
                value={String(selectedProduct.rating)}
                onChange={(value) =>
                  onProductUpdate(
                    selectedProduct.id,
                    "rating",
                    Number(value || selectedProduct.rating),
                  )
                }
              />
              <Field
                label="ETA"
                value={selectedProduct.eta}
                onChange={(value) =>
                  onProductUpdate(selectedProduct.id, "eta", value)
                }
              />
              <Field
                label="Tint class"
                value={selectedProduct.tint}
                onChange={(value) =>
                  onProductUpdate(selectedProduct.id, "tint", value)
                }
              />
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Pick a product from the list to edit it.
            </p>
          )}
        </Panel>

        <Panel
          title="Add new product"
          subtitle="Create a new item and it will appear in the catalog immediately."
          actions={
            <button
              type="button"
              onClick={onCreateProduct}
              disabled={isPending}
              className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Create product
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field
              label="Name"
              value={newProduct.name}
              onChange={(value) => onNewProductChange("name", value)}
            />
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Category
              </span>
              <select
                value={newProduct.category}
                onChange={(event) => onNewProductChange("category", event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)]"
              >
                {sellableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Unit"
              value={newProduct.unit}
              onChange={(value) => onNewProductChange("unit", value)}
            />
            <Field
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(value) => onNewProductChange("price", value)}
            />
            <Field
              label="Was price"
              type="number"
              value={newProduct.wasPrice}
              onChange={(value) => onNewProductChange("wasPrice", value)}
            />
            <Field
              label="Badge"
              value={newProduct.badge}
              onChange={(value) => onNewProductChange("badge", value)}
            />
            <Field
              label="Origin"
              value={newProduct.origin}
              onChange={(value) => onNewProductChange("origin", value)}
            />
            <Field
              label="Rating"
              type="number"
              value={newProduct.rating}
              onChange={(value) => onNewProductChange("rating", value)}
            />
            <Field
              label="ETA"
              value={newProduct.eta}
              onChange={(value) => onNewProductChange("eta", value)}
            />
            <Field
              label="Tint class"
              value={newProduct.tint}
              onChange={(value) => onNewProductChange("tint", value)}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
