// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Non-JSON response:", res.status, text.slice(0, 300));
    throw new Error(
      `Server trả về không phải JSON (HTTP ${res.status}). ` +
      `Kiểm tra route API có tồn tại và server có lỗi không.`
    );
  }
}

export default function AdminLoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await safeJson(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      const otpRes = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const otpData = await safeJson(otpRes);
      if (!otpRes.ok || !otpData.success) {
        throw new Error(otpData.message || "Không gửi được OTP");
      }

      localStorage.setItem("admin_otp_" + email, otpData.otp);
      localStorage.setItem("admin_otp_time_" + email, Date.now().toString());
      localStorage.setItem("admin_pending_user", JSON.stringify(data.user));
      localStorage.setItem("admin_pending_token", data.token);

      setUserData(data.user);
      setPassword("");
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    const savedOtp = localStorage.getItem("admin_otp_" + email);
    const savedTime = localStorage.getItem("admin_otp_time_" + email);

    if (!savedOtp || !savedTime) {
      setError("Mã OTP không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    if (Date.now() - Number(savedTime) > 5 * 60 * 1000) {
      setError("Mã OTP đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("admin_otp_" + email);
      localStorage.removeItem("admin_otp_time_" + email);
      return;
    }

    if (otp !== savedOtp) {
      setError("Mã OTP không đúng");
      setOtp("");
      return;
    }

    const user = JSON.parse(localStorage.getItem("admin_pending_user") || "{}");
    const token = localStorage.getItem("admin_pending_token") || "";

    localStorage.setItem("admin_user", JSON.stringify(user));
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_login_time", Date.now().toString());

    localStorage.removeItem("admin_otp_" + email);
    localStorage.removeItem("admin_otp_time_" + email);
    localStorage.removeItem("admin_pending_user");
    localStorage.removeItem("admin_pending_token");

    window.location.href = "/admin";
  }

  function backToCredentials() {
    setStep("credentials");
    setOtp("");
    setError("");
    setUserData(null);
    localStorage.removeItem("admin_otp_" + email);
    localStorage.removeItem("admin_otp_time_" + email);
    localStorage.removeItem("admin_pending_user");
    localStorage.removeItem("admin_pending_token");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-brand">Mass Hiring</div>
          <h1 className="mt-2 text-lg font-semibold text-gray-900">
            {step === "credentials" ? "Đăng nhập Admin" : "Xác thực 2 lớp"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === "credentials"
              ? "Nhập tài khoản để nhận mã OTP"
              : `Mã OTP đã gửi tới Discord cho ${email}`}
          </p>
        </div>

        {step === "credentials" ? (
          <form onSubmit={handleCredentials} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
              />
            </div>
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Đang kiểm tra..." : "Tiếp tục"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="mt-8 space-y-5">
            {userData && (
              <div className="rounded-xl bg-gray-50 p-3 text-center text-sm">
                <div className="text-xs text-gray-500">Đăng nhập với</div>
                <div className="font-semibold">{userData.name}</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mã OTP (6 số)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                maxLength={6}
                autoFocus
                required
                placeholder="••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em]"
              />
            </div>
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn-primary w-full"
            >
              {loading ? "Đang xác thực..." : "Xác thực"}
            </button>
            <button
              type="button"
              onClick={backToCredentials}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              ← Quay lại
            </button>
          </form>
        )}
      </div>
    </div>
  );
}