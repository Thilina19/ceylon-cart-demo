import { maskPhone } from "@/lib/auth";
import type { RegisteredUser } from "@/lib/otp-store";

type FooterCtaProps = {
  registeredUser: RegisteredUser | null;
};

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="text-base font-semibold text-white">{title}</p>
      <div className="mt-3 space-y-2 text-sm text-white/72">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export function FooterCta({ registeredUser }: FooterCtaProps) {
  return (
    <footer className="rounded-[34px] bg-[linear-gradient(145deg,#16322c,#1e4b42)] px-6 py-8 text-white shadow-[0_22px_48px_rgba(22,50,44,0.18)]">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="font-[var(--font-display)] text-4xl font-semibold tracking-tight">
            Ceylon Cart
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
            A calmer, more curated online grocery store for Sri Lankan households, built around fresh food, pantry staples, and practical weekly shopping.
          </p>

          <div className="mt-5 rounded-[24px] bg-white/10 p-4 text-sm text-white/80">
            {registeredUser ? (
              <>
                <p className="font-semibold text-white">Signed in as {registeredUser.name}</p>
                <p className="mt-1">{maskPhone(registeredUser.phone)}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-white">Welcome back</p>
                <p className="mt-1">Sign in to save your address, manage your basket, and reorder faster.</p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <FooterColumn
            title="Departments"
            items={["Fresh produce", "Bakery", "Dairy & eggs", "Home care"]}
          />
          <FooterColumn
            title="Customer care"
            items={["Delivery help", "Returns", "Contact us", "Order support"]}
          />
          <FooterColumn
            title="About"
            items={["About us", "Terms", "Privacy", "Careers"]}
          />
        </div>
      </div>
    </footer>
  );
}
