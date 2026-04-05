"use client";

import type { AnnouncementBanner, PromoPopup } from "@/lib/store-data";
import { Field, Panel } from "@/components/admin/admin-ui";

export function AdminMarketing({
  announcementBanner,
  isPending,
  onAnnouncementBannerChange,
  onPromoPopupChange,
  onSave,
  promoPopup,
}: {
  announcementBanner: AnnouncementBanner;
  isPending: boolean;
  onAnnouncementBannerChange: (
    field: keyof AnnouncementBanner,
    value: boolean | string,
  ) => void;
  onPromoPopupChange: (field: keyof PromoPopup, value: boolean | string) => void;
  onSave: () => void;
  promoPopup: PromoPopup;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel
        title="Announcement banner"
        subtitle="This is the slim message bar at the top of the storefront."
        actions={
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save marketing
          </button>
        }
      >
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Banner status
            </span>
            <select
              value={announcementBanner.active ? "active" : "hidden"}
              onChange={(event) =>
                onAnnouncementBannerChange("active", event.target.value === "active")
              }
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)]"
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <Field
            label="Banner text"
            value={announcementBanner.text}
            onChange={(value) => onAnnouncementBannerChange("text", value)}
            textarea
          />
          <Field
            label="CTA label"
            value={announcementBanner.ctaLabel}
            onChange={(value) => onAnnouncementBannerChange("ctaLabel", value)}
          />
          <Field
            label="CTA href"
            value={announcementBanner.ctaHref}
            onChange={(value) => onAnnouncementBannerChange("ctaHref", value)}
          />
        </div>

        <div className="mt-6 rounded-[24px] bg-[var(--ink)] px-5 py-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62">
            Preview
          </p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-white/84">{announcementBanner.text}</p>
            <span className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]">
              {announcementBanner.ctaLabel || "CTA"}
            </span>
          </div>
        </div>
      </Panel>

      <Panel
        title="Homepage popup"
        subtitle="Use this for weekly campaigns, basket nudges, or category launches."
      >
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Popup status
            </span>
            <select
              value={promoPopup.active ? "active" : "hidden"}
              onChange={(event) =>
                onPromoPopupChange("active", event.target.value === "active")
              }
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)]"
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <Field
            label="Popup id"
            value={promoPopup.id}
            onChange={(value) => onPromoPopupChange("id", value)}
          />
          <Field
            label="Eyebrow"
            value={promoPopup.eyebrow}
            onChange={(value) => onPromoPopupChange("eyebrow", value)}
          />
          <Field
            label="Title"
            value={promoPopup.title}
            onChange={(value) => onPromoPopupChange("title", value)}
          />
          <Field
            label="Description"
            value={promoPopup.description}
            onChange={(value) => onPromoPopupChange("description", value)}
            textarea
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Primary button"
              value={promoPopup.primaryLabel}
              onChange={(value) => onPromoPopupChange("primaryLabel", value)}
            />
            <Field
              label="Secondary button"
              value={promoPopup.secondaryLabel}
              onChange={(value) => onPromoPopupChange("secondaryLabel", value)}
            />
          </div>
          <Field
            label="Image URL"
            value={promoPopup.image}
            onChange={(value) => onPromoPopupChange("image", value)}
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface-strong)]">
          <div
            className="h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${promoPopup.image})` }}
          />
          <div className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {promoPopup.eyebrow}
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              {promoPopup.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {promoPopup.description}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
