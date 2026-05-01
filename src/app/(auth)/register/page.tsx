"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PasswordStep } from "./PasswordStep";
import { InfoStep } from "./Infostep";
import { VerifyStep } from "./Verify";

type Step = "info" | "verify" | "password";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.message || "Failed to send code"); return; }
    setStep("verify");
    startCooldown();
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.message || "Invalid code"); return; }
    setStep("password");
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || "Something went wrong"); setLoading(false); return; }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
    router.refresh();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    await fetch("/api/register/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setLoading(false);
    startCooldown();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-lg">
        {step === "info" && (
          <InfoStep
            name={name} email={email}
            loading={loading} googleLoading={googleLoading} error={error}
            onNameChange={setName} onEmailChange={setEmail}
            onSubmit={handleSendCode} onGoogle={handleGoogle}
          />
        )}
        {step === "verify" && (
          <VerifyStep
            email={email} code={code}
            loading={loading} error={error} resendCooldown={resendCooldown}
            onCodeChange={setCode} onSubmit={handleVerifyCode}
            onResend={handleResend} onBack={() => setStep("info")}
          />
        )}
        {step === "password" && (
          <PasswordStep
            password={password} confirmPassword={confirmPassword}
            loading={loading} error={error}
            onPasswordChange={setPassword} onConfirmChange={setConfirmPassword}
            onSubmit={handleSetPassword}
          />
        )}
      </div>
    </div>
  );
}