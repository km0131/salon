"use client";

import React, { useState } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";
import { useStores, StoreListItem } from "@/hooks/useStores";

export default function UserRegistrationPage() {
    const { data: stores, isLoading } = useStores();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "スタッフ",
        shopId: "", // ★ shopName から shopId に変更
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 日本語と英語の対応表（マッピング）
        const roleMap: Record<string, string> = {
            "管理者": "admin",
            "店長": "manager",
            "スタッフ": "staff",
        };

        // 対応する英語がない場合は、元の文字か "staff" をデフォルトにする
        const mappedRole = roleMap[formData.role] || "staff";

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: mappedRole,
            store_id: Number(formData.shopId), // キー名を store_id に変換し、型も uint(Number) にする
        };

        // バリデーションチェック
        const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("パスワードは英数字4文字以上で入力してください。");
            return;
        }

        if (!formData.shopId) {
            alert("店舗を選択してください。");
            return;
        }

        // 送信データ確認（shopIdが数値として送られているかチェック）
        console.log("送信データ:", {
            ...formData,
            shopId: Number(formData.shopId) // 必要に応じて数値に変換
        });

        try {
            // TODO: Goバックエンドへ送信
            const response = await fetch("https://api.kiiswebai.com/api/v1/signup", {
                method: "POST",
                mode: "cors", // これを追加
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // これも追加しておくと安全
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("登録に失敗しました");

            alert("スタッフを登録しました！");
            setFormData({ name: "", email: "", password: "", role: "スタッフ", shopId: "" }); // フォームをリセット
        } catch (error) {
            alert("エラーが発生しました。");
        }
    };

    return (
        <AdminPageTemplate title="Staff Registration">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- 名前入力 --- */}
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

                {/* --- メール --- */}
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

                {/* --- パスワード --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <input
                        type="password"
                        required
                        minLength={4}
                        pattern="^[a-zA-Z0-9]+$"
                        title="英数字4文字以上で入力してください"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all invalid:ring-red-200"
                        placeholder="••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {/* --- 権限 --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <select
                        value={formData.role}
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-600"
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="管理者">管理者</option>
                        <option value="店長">店長</option>
                        <option value="スタッフ">スタッフ</option>
                    </select>
                </div>

                {/* --- 店舗名 (修正版) --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shop</label>
                    <div className="relative">
                        <select
                            required
                            disabled={isLoading}
                            value={formData.shopId}
                            className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none text-slate-600 disabled:opacity-50"
                            onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                        >
                            <option value="">{isLoading ? "読み込み中..." : "店舗を選択してください"}</option>
                            {/* Goバックエンドが返す {id, name} の配列を回す */}
                            {Array.isArray(stores) && stores.map((store: StoreListItem) => (
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