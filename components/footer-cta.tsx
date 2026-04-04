import { maskPhone } from "@/lib/auth";
import type { RegisteredUser } from "@/lib/otp-store";

type FooterCtaProps = {
  registeredUser: RegisteredUser | null;
};

export function FooterCta({ registeredUser }: FooterCtaProps) {
  return (
    <footer className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(135deg,#19342c,#0f6354)] p-6 text-white shadow-[0_24px_48px_rgba(25,52,44,0.18)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            Product direction
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold">
            Ready for real integrations next
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/76">
            The demo currently uses local API logic for OTP and zone updates, which makes it ideal
            for UI prototyping. The next production step would be connecting it to an SMS gateway,
            persistent database storage, payments, and a real catalog backend.
          </p>
        </div>

        <div className="rounded-[28px] bg-white/10 px-5 py-4 text-sm text-white/80">
          {registeredUser ? (
            <div>
              <p className="font-semibold text-white">Signed in as {registeredUser.name}</p>
              <p className="mt-1">{maskPhone(registeredUser.phone)}</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-white">Guest mode active</p>
              <p className="mt-1">Open the OTP modal to test the mobile registration flow.</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
