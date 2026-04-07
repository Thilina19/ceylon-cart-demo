import { maskPhone } from "@/lib/auth";
import type { RegisteredUser } from "@/lib/store-data";

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
      <p className="text-sm font-bold text-[#2a2a2a]">{title}</p>
      <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export function FooterCta({ registeredUser }: FooterCtaProps) {
  return (
    <footer className="rounded-[22px] border border-[var(--line)] bg-white px-5 py-7 shadow-[0_10px_28px_rgba(0,0,0,0.05)] lg:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/42">
            CeylonCart supermarket
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#2a2a2a]">
            Easy weekly grocery shopping.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Fresh produce, pantry staples, bakery items, chilled groceries, and
            household picks in a cleaner shopping flow.
          </p>

          <div className="mt-5 rounded-[18px] bg-[#f7f7fa] px-4 py-4 text-sm text-[var(--muted)]">
            {registeredUser ? (
              <>
                <p className="font-semibold text-[#2a2a2a]">
                  Signed in as {registeredUser.name}
                </p>
                <p className="mt-1">{maskPhone(registeredUser.phone)}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-[#2a2a2a]">Fast checkout</p>
                <p className="mt-1">
                  Sign in to save your profile and make repeat grocery orders faster.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <FooterColumn
            title="Shop"
            items={["Fresh produce", "Bakery", "Dairy & eggs", "Home care"]}
          />
          <FooterColumn
            title="Support"
            items={["Order tracking", "Help center", "Returns", "Contact us"]}
          />
          <FooterColumn
            title="About"
            items={["About us", "Careers", "Terms", "Privacy"]}
          />
        </div>
      </div>
    </footer>
  );
}
