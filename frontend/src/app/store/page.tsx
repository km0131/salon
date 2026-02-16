"use client";

import React, { useState } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";

export default function StoreRegistrationPage() {
    const [formData, setFormData] = useState({
        name: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // バリデーションチェック
        if (!formData.name.trim()) {
            alert("店舗名を入力してください。");
            return;
        }

        // 送信データ確認
        console.log("送信データ:", formData);

        try {
            // TODO: Goバックエンドへ送信
            const response = await fetch("https://api.kiiswebai.com/api/v1/store-registration", {
                method: "POST",
                mode: "cors", // これを追加
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // これも追加しておくと安全
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("登録に失敗しました");

            alert("店舗を登録しました！");
            setFormData({ name: "" }); // フォームをリセット
        } catch (error) {
            alert("エラーが発生しました。");
        }
    };

    return (
        <AdminPageTemplate title="Store Registration">
            <div className="max-w-2xl mx-auto"> {/* 項目が少ないので幅を少し絞る */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* --- 店舗名入力 --- */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                            Store Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full mt-2 px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg"
                            placeholder="例：日田本店"
                            value={formData.name}
                            onChange={(e) => setFormData({ name: e.target.value })}
                        />
                    </div>

                    {/* --- 登録ボタン --- */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
                        >
                            店舗を登録する
                        </button>
                    </div>
                </form>
            </div>
        </AdminPageTemplate>
    );
}