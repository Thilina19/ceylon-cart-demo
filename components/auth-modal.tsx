type AuthPhase = "details" | "verify";

type AuthModalProps = {
  open: boolean;
  phase: AuthPhase;
  name: string;
  phone: string;
  otp: string;
  message: string;
  otpPreview: string;
  pending: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onRequestOtp: () => void;
  onVerifyOtp: () => void;
  onEditNumber: () => void;
};

export function AuthModal({
  open,
  phase,
  name,
  phone,
  otp,
  message,
  otpPreview,
  pending,
  onClose,
  onNameChange,
  onPhoneChange,
  onOtpChange,
  onRequestOtp,
  onVerifyOtp,
  onEditNumber,
}: AuthModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,26,22,0.42)] px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[34px] border border-[var(--line)] bg-white p-6 shadow-[0_30px_80px_rgba(25,52,44,0.18)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Mobile registration
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold">
              {phase === "details" ? "Create your account" : "Enter OTP"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--muted)]"
          >
            Close
          </button>
        </div>

        {phase === "details" ? (
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Full name
              </span>
              <input
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Kavindi Perera"
                className="w-full rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--brand)]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                Sri Lanka mobile number
              </span>
              <input
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="07XXXXXXXX or +947XXXXXXXX"
                className="w-full rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--brand)]"
              />
            </label>
            <button
              type="button"
              onClick={onRequestOtp}
              disabled={pending}
              className="w-full rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Generating OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#fff5e8,#fffdf7)] p-4 text-sm text-[var(--muted)]">
              <p className="font-semibold text-[var(--ink)]">Phone</p>
              <p className="mt-1">{phone}</p>
              {otpPreview ? (
                <p className="mt-3 rounded-2xl bg-white px-3 py-2 font-semibold text-[var(--brand-deep)]">
                  Demo OTP: {otpPreview}
                </p>
              ) : null}
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--muted)]">
                6-digit OTP
              </span>
              <input
                value={otp}
                onChange={(event) => onOtpChange(event.target.value)}
                placeholder="Enter the OTP"
                className="w-full rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--brand)]"
              />
            </label>
            <button
              type="button"
              onClick={onVerifyOtp}
              disabled={pending}
              className="w-full rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Verifying..." : "Verify and continue"}
            </button>
            <button
              type="button"
              onClick={onEditNumber}
              className="w-full rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--muted)]"
            >
              Edit number
            </button>
          </div>
        )}

        {message ? (
          <p className="mt-4 text-sm font-medium text-[var(--brand-deep)]">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
