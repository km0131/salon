"use client";

import React, { useState } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";

interface StoreFormProps {
    initialData?: {
        id: number;
        name: string;
    } | null;
    onSuccess: () => void;
}

export default function StoreForm({ initialData, onSuccess }: StoreFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // バリデーションチェック
        if (!formData.name.trim()) {
            alert("店舗名を入力してください。");
            return;
        }

        setIsSubmitting(true);
        try {
            const url = isEdit ? `https://api.kiiswebai.com/api/v1/store/${initialData?.id}` : "https://api.kiiswebai.com/api/v1/store-registration";
            const method = isEdit ? "PUT" : "POST";

            console.log("Request URL:", url); // ← これを 44行目の前に入れて確認
            console.log("Request Method:", method);

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`${isEdit ? "更新" : "登録"}に失敗しました`);

            alert(`店舗を${isEdit ? "更新" : "登録"}しました！`);
            onSuccess();
        } catch (error) {
            alert("エラーが発生しました。");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
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
                        disabled={isSubmitting}
                    />
                </div>

                {/* --- 登録・更新ボタン --- */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                    >
                        {isSubmitting ? "送信中..." : (isEdit ? "店舗を更新する" : "店舗を登録する")}
                    </button>
                </div>
            </form>
        </div>
    );
}