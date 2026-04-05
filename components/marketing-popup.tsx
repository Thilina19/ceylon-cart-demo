"use client";

import Image from "next/image";
import type { PromoPopup } from "@/lib/store-data";

type MarketingPopupProps = {
  popup: PromoPopup;
  open: boolean;
  onClose: () => void;
};

export function MarketingPopup({
  popup,
  open,
  onClose,
}: MarketingPopupProps) {
  if (!open || !popup.active) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,18,16,0.62)] px-4 py-8 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close popup"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />

      <section className="relative grid w-full max-w-[960px] overflow-hidden rounded-[36px] bg-white shadow-[0_32px_90px_rgba(11,23,20,0.28)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[280px]">
          <Image
            src={popup.image}
            alt={popup.title}
            fill
            sizes="(max-width: 1023px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,23,20,0.06)_0%,rgba(11,23,20,0.42)_100%)]" />
        </div>

        <div className="flex flex-col justify-center px-6 py-7 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {popup.eyebrow}
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold leading-tight text-[var(--ink)]">
            {popup.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {popup.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
            >
              {popup.primaryLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--muted)]"
            >
              {popup.secondaryLabel}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/88 px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-sm"
        >
          Close
        </button>
      </section>
    </div>
  );
}
