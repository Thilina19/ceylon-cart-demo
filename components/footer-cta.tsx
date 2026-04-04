import { maskPhone } from "@/lib/auth";
import type { RegisteredUser } from "@/lib/otp-store";

type FooterCtaProps = {
  registeredUser: RegisteredUser | null;
};

export function FooterCta({ registeredUser }: FooterCtaProps) {
  return (
    <footer className="rounded-2xl bg-[#1f252f] px-5 py-6 text-white">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/58">
            Next production steps
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            This is now much closer to a Noon-style grocery shell
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
            The remaining gap is mostly content scale: real product images, more promotion modules,
            richer category pages, checkout, and proper SMS plus database integrations.
          </p>
        </div>

        <div className="rounded-2xl bg-white/8 p-4 text-sm text-white/80">
          {registeredUser ? (
            <>
              <p className="font-semibold text-white">Signed in customer</p>
              <p className="mt-2">{registeredUser.name}</p>
              <p className="mt-1">{maskPhone(registeredUser.phone)}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-white">Guest mode</p>
              <p className="mt-2">
                Open the mobile OTP panel to test the registration flow and saved-session behavior.
              </p>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
