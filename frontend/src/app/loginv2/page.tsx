"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const title = "Salon Grado";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 今後 TanStack Query でバックエンドと連携
        console.log("Login with:", { email, password });
        setErrorMsg(null); // 送信時にエラーをクリア
        setIsLoading(true);

        const payload = {
            email: email,
            password: password,
        };
        try {
            // TODO: Goバックエンドへ送信
            const response = await fetch("https://api.kiiswebai.com/api/v1/login", {
                method: "POST",
                mode: "cors", // これを追加
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // これも追加しておくと安全
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            // --- 成功時の処理 ---
            login(data.token);
            // ダッシュボードへ移動
            router.push("/dashboard");
            if (!response.ok) throw new Error("ログインに失敗しました");

            alert("ログインしました！");
        } catch (error) {
            setErrorMsg("パスワードまたはメールアドレスが正しくありません");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-linear-to-br from-slate-50 to-indigo-50/30 px-4">
            {/* --- メインコンテンツ --- */}
            <div className="max-w-2xl mx-auto pt-24 w-full">
                {/* ロゴとタイトルのエリア */}
                <div className="flex items-center gap-4 mb-8">
                    <Image
                        src="/b1.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        priority
                        className="object-contain"
                    />
                    <h1 className="text-xl font-light tracking-widest text-slate-700 uppercase">
                        {title}
                    </h1>
                </div>

                {/* カード容器 */}
                <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-[2.5rem] p-10">
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-slate-800">ログイン</h2>
                        <p className="text-sm text-slate-400 mt-1">顧客管理システムへアクセスします</p>
                    </div>
                    {/* --- 追加：エラーメッセージの表示エリア --- */}
                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <span className="text-lg">⚠️</span>
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-slate-600"
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
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-800 hover:bg-indigo-900 text-white font-medium py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95 mt-4"
                        >
                            ログイン
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}