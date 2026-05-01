"use client";

interface Props {
  email: string;
  code: string;
  loading: boolean;
  error: string;
  resendCooldown: number;
  onCodeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}

export function VerifyStep({ email, code, loading, error, resendCooldown, onCodeChange, onSubmit, onResend, onBack }: Props) {
  return (
    <>
      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-gray-600 mb-6 bg-transparent border-none cursor-pointer flex items-center gap-1"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-1">Check your email</h1>
      <p className="text-sm text-gray-500 mb-6">
        We sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>
      </p>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest text-lg font-bold"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-500">
        Didn't receive it?{" "}
        <button
          onClick={onResend}
          disabled={resendCooldown > 0}
          className="text-black font-medium hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </p>
    </>
  );
}