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
      <p className="text-sm font-bold text-white">{title}</p>
      <div className="mt-3 space-y-2 text-sm text-white/70">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export function FooterCta({ registeredUser }: FooterCtaProps) {
  return (
    <footer className="rounded-2xl bg-[#1f252f] px-5 py-8 text-white">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Ceylon Cart supermarket
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
            Shop groceries, fresh food, drinks, and household essentials with a fast, marketplace-style shopping experience built for convenience.
          </p>

          <div className="mt-5 rounded-2xl bg-white/8 p-4 text-sm text-white/80">
            {registeredUser ? (
              <>
                <p className="font-semibold text-white">Signed in as {registeredUser.name}</p>
                <p className="mt-1">{maskPhone(registeredUser.phone)}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-white">Welcome back</p>
                <p className="mt-1">Sign in to save addresses, reorder faster, and manage your basket.</p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <FooterColumn
            title="Shop"
            items={["Fresh produce", "Dairy & eggs", "Bakery", "Home care"]}
          />
          <FooterColumn
            title="Customer care"
            items={["Help center", "Delivery information", "Returns", "Contact us"]}
          />
          <FooterColumn
            title="About"
            items={["About Ceylon Cart", "Careers", "Terms of use", "Privacy policy"]}
          />
        </div>
      </div>
    </footer>
  );
}
