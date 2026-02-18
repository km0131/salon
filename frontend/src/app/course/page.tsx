"use client";

import React, { useState } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";
import { useStores, StoreListItem } from "@/hooks/useStores"; // スタッフ登録と同じHookを使用

export default function CourseRegistrationPage() {
    // スタッフ登録画面と同じ取得ロジック
    const { data: stores, isLoading } = useStores();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        totalCount: 1, // デフォルト 1
        shopId: "", // スタッフ登録画面と統一
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.shopId) {
            alert("店舗を選択してください。");
            return;
        }

        setIsSubmitting(true);

        // Goのバックエンド（uint / int）に合わせたペイロード作成
        const payload = {
            name: formData.name,
            price: formData.price,
            total_count: formData.totalCount,
            store_id: Number(formData.shopId),
        };

        try {
            // TODO: Goバックエンド（コース登録用API）へ送信
            console.log("送信データ:", payload);

            const response = await fetch("https://api.kiiswebai.com/api/v1/course-registration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("登録に失敗しました");
            console.log("送信データ:", payload);
            alert("コースを登録しました！");
            setFormData({ name: "", price: 0, totalCount: 1, shopId: "" }); // リセット
        } catch (error) {
            alert("エラーが発生しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminPageTemplate title="Course Registration">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- 店舗名選択 (スタッフ登録画面のロジックを移植) --- */}
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

                {/* --- コース名 --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                    <input
                        type="text"
                        required
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="例: 一部位"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* --- 価格 --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full mt-2 pl-10 pr-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                placeholder="4400"
                                value={formData.price || ""}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Total Count (回数)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="1"
                            value={formData.totalCount}
                            onChange={(e) => setFormData({ ...formData, totalCount: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                </div>

                {/* --- 送信ボタン --- */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50"
                    >
                        {isSubmitting ? "登録中..." : "コースを登録する"}
                    </button>
                </div>
            </form>
        </AdminPageTemplate>
    );
}