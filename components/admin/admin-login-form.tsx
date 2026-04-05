"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ defaultEmail }: { defaultEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      setMessage("");

      try {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const payload = (await response.json()) as {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Could not sign in.");
        }

        router.replace("/admin");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not sign in.");
      }
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="grid w-full max-w-[1120px] overflow-hidden rounded-[40px] bg-white shadow-[0_26px_70px_rgba(22,50,44,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-[linear-gradient(160deg,#12322c_0%,#18453c_55%,#1f7a67_100%)] px-8 py-10 text-white lg:px-10 lg:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
            Ceylon Cart Admin
          </p>
          <h1 className="mt-4 font-[var(--font-display)] text-5xl font-semibold leading-[1.02]">
            Manage the store from one place.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/76">
            Add products, tune delivery coverage, and track incoming orders from a protected back office.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Add and update products without touching code",
              "Adjust zone radius, ETA, and minimum order rules",
              "Track orders and move them through delivery stages",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 text-sm text-white/84 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center px-6 py-10 lg:px-10 lg:py-12">
          <div className="w-full max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Secure access
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)]">
              Admin sign in
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Use your admin email and password to open the control panel.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                  Email
                </span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-[var(--brand)]"
                />
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isPending ? "Signing in..." : "Open admin"}
              </button>
            </div>

            {message ? (
              <p className="mt-4 text-sm font-semibold text-[var(--danger)]">{message}</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
