"use client";

import React, { useState } from "react";
import { useStores } from "@/hooks/useStores";
import AdminPageTemplate from "@/components/AdminPageTemplate";

export default function UserRegistrationPage() {
    const { data: stores, isLoading } = useStores();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "スタッフ",
        shopName: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // JavaScriptでの英数字4文字以上チェック
        const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("パスワードは英数字4文字以上で入力してください。");
            return;
        }

        console.log("登録データ:", formData);
        // ここでAPIを叩く
    };

    return (
        <AdminPageTemplate title="Staff Registration">
            {/* テンプレート内の白いカードの中に表示されるフォーム部分 */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 名前 */}
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                    <input
                        type="text"
                        required
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="山田 太郎"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* メール */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="staff@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                {/* パスワード */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <input
                        type="password"
                        required
                        minLength={4} // 1. 最小文字数を指定
                        pattern="^[a-zA-Z0-9]+$" // 2. 英数字のみを許可（正規表現）
                        title="英数字4文字以上で入力してください" // 3. エラー時のヒント
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all invalid:ring-red-200"
                        placeholder="••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <p className="mt-1 ml-1 text-[10px] text-slate-400">※英数字4文字以上</p>
                </div>

                {/* 権限 */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <div className="relative">
                        <select
                            value={formData.role}
                            className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none text-slate-600"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="管理者">管理者</option>
                            <option value="店長">店長</option>
                            <option value="スタッフ">スタッフ</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pt-2 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 店舗名 (API連携) */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shop</label>
                    <div className="relative">
                        <select
                            required
                            disabled={isLoading}
                            className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none text-slate-600 disabled:opacity-50"
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        >
                            <option value="">{isLoading ? "読み込み中..." : "店舗を選択してください"}</option>
                            {stores?.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pt-2 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 mt-4 text-center text-slate-400 text-xs italic">
                    ※ 各項目を入力して登録を完了してください。
                </div>

                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1">
                        登録する
                    </button>
                </div>
            </form>
        </AdminPageTemplate>
    );
}