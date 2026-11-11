"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
      setChallengeId(data.challengeId);
      setPassword("");
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ challengeId, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mã OTP không đúng");
      await new Promise((r) => setTimeout(r, 200));
      window.location.replace(next);
    } catch (err: any) {
      setError(err.message);
      setOtp("");
      setLoading(false);
    }
  }

  function backToCredentials() {
    setStep("credentials");
    setOtp("");
    setError("");
    setChallengeId("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 sm:p-10">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              {step === "credentials" ? "Đăng nhập Admin" : "Xác thực 2 lớp"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {step === "credentials"
                ? "Nhập tài khoản để nhận mã OTP"
                : "Nhập mã 6 số đã gửi tới Discord"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div
              className={`h-1.5 w-12 rounded-full transition ${step === "credentials" ? "bg-brand" : "bg-brand/30"
                }`}
            />
            <div
              className={`h-1.5 w-12 rounded-full transition ${step === "otp" ? "bg-brand" : "bg-gray-200"
                }`}
            />
          </div>

          {/* Form */}
          {step === "credentials" ? (
            <form onSubmit={submitCredentials} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tài khoản
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang kiểm tra..." : "Tiếp tục"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="mt-8 space-y-5">
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Mã OTP đã được gửi tới Discord cho{" "}
                    <strong>{username}</strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mã OTP (6 chữ số)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="••••••"
                  className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
                <p className="mt-2 text-center text-xs text-gray-500">
                  Mã có hiệu lực trong 5 phút
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang xác thực..." : "Xác thực"}
              </button>

              <button
                type="button"
                onClick={backToCredentials}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ← Quay lại
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Mass Hiring. Bảo mật bởi 2FA.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}