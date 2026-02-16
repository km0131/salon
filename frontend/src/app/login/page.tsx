"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 今後 TanStack Query でバックエンドと連携
        console.log("Login with:", { email, password });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50/30">
            <div className="w-full max-w-md px-4">
                {/* カード容器 */}
                <div className="bg-white/80 backdrop-blur-md border border-white shadow-2xl rounded-3xl p-10">

                    {/* ロゴエリア */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 mb-4 relative">
                            {/* ロゴ画像（public/logo.png等を用意してください） */}
                            <Image
                                src="/b1.png"
                                alt="Salon Logo"
                                width={200}   // お好みのサイズに調整してください
                                height={200}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-2xl font-light tracking-widest text-slate-800 uppercase">
                            Salon Grado
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">顧客管理用WEBシステム</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-slate-600"
                                placeholder="salon@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                パスワード
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-800 hover:bg-indigo-900 text-white font-medium py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            ログイン
                        </button>
                    </form>

                </div>
            </div>
        </main>
    );
}