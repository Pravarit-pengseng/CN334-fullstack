"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setToken("");

    try {
      const res = await fetch("http://localhost:3340/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Login failed");
        return;
      }

      setMessage(data.message);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <nav
          aria-label="เมนูหลัก"
          className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center"
        >
          <div>
            <h1 className="text-2xl font-bold text-blue-600">TU-PINE Care</h1>
            <p className="text-slate-500 text-lg">
              เข้าสู่ระบบเพื่อใช้งานบริการด้านสุขภาพของคุณ
            </p>
          </div>

          <Link
            href="/"
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            กลับหน้าหลัก
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
        <section aria-labelledby="login-heading" className="text-center mb-12">
          <h2
            id="login-heading"
            className="text-4xl font-extrabold mb-4 text-slate-800"
          >
            เข้าสู่ระบบ
          </h2>
          <p className="text-xl text-slate-600">
            กรุณากรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ
          </p>
        </section>

        <section className="flex justify-center">
          <div className="w-full max-w-2xl bg-white p-10 md:p-12 rounded-3xl shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-4xl">🔐</span>
              </div>
              <h3 className="text-3xl font-bold mb-3 text-slate-800">
                Login Account
              </h3>
              <p className="text-xl text-slate-500">
                เข้าถึงระบบนัดหมายและบริการให้คำปรึกษาออนไลน์
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-lg font-medium text-slate-700 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-slate-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 rounded-2xl shadow-md transition-all duration-300"
              >
                เข้าสู่ระบบ
              </button>
            </form>

            {message && (
              <div
                className={`mt-6 rounded-2xl px-5 py-4 text-center text-lg font-medium ${
                  token
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {token && (
              <div className="mt-8">
                <label className="block text-lg font-medium text-slate-700 mb-2">
                  JWT Token
                </label>
                <textarea
                  value={token}
                  readOnly
                  rows={6}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 bg-slate-50 focus:outline-none"
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-400 bg-white border-t border-slate-200 mt-auto">
        <p>
          จัดทำโดย พรรษชล บุญมาก คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์
          ศูนย์รังสิต 99 ม.18 ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี 12120
        </p>
      </footer>
    </div>
  );
}