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
    <footer className="rounded-[36px] bg-[linear-gradient(135deg,#0f2420,#17342e)] px-6 py-8 text-white shadow-[0_24px_48px_rgba(22,50,44,0.18)]">
      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
            Ceylon Cart
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight">
            Groceries designed to feel effortless.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
            A more visual and shopper-friendly grocery storefront for fresh finds, pantry staples, and easy weekly reorders.
          </p>

          <div className="mt-5 rounded-[24px] bg-white/8 p-4 text-sm text-white/80">
            {registeredUser ? (
              <>
                <p className="font-semibold text-white">Signed in as {registeredUser.name}</p>
                <p className="mt-1">{maskPhone(registeredUser.phone)}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-white">Sign in for a smoother checkout</p>
                <p className="mt-1">Save your address, manage orders, and keep your basket ready.</p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <FooterColumn
            title="Shop"
            items={["Fresh produce", "Bakery", "Dairy", "Home care"]}
          />
          <FooterColumn
            title="Support"
            items={["Delivery help", "Returns", "Contact us", "Order tracking"]}
          />
          <FooterColumn
            title="Company"
            items={["About", "Careers", "Privacy", "Terms"]}
          />
        </div>
      </div>
    </footer>
  );
}
