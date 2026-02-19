"use client";

import React, { useState } from "react";
import { useStores, StoreListItem } from "@/hooks/useStores";

interface StaffFormProps {
    initialData?: {
        ID: number;
        name: string;
        email: string;
        role: string;
        store_id: number;
    } | null;
    onSuccess: () => void;
}

export default function StaffForm({ initialData, onSuccess }: StaffFormProps) {
    const { data: stores, isLoading } = useStores();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        password: "", // Password is blank by default (only filled if changing)
        role: initialData?.role || "staff", // Default role
        shopId: initialData?.store_id ? String(initialData.store_id) : "",
    });

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 英語のロールを送信（ただしinitialData.roleが既に英語の可能性が高い、あるいは日本語で持っているか）
        // backend returns "admin", "manager", "staff".
        // The form select options should probably be consistent.
        // If initialData comes from backend, it's "admin"/"manager"/"staff".
        // But the previous implementation had Japanese options in select and mapped them.
        // Let's stick to English internally if possible, or mapping if UI needs Japanese.
        // The previous UI had: <option value="管理者">管理者</option>...
        // I will change UI to use English values but Japanese labels for simplicity and robustness,
        // or keep mapping if I want to match previous behavior exactly.
        // Let's use English values for the select options to avoid mapping issues.

        const payload: any = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            store_id: Number(formData.shopId),
        };

        if (formData.password) {
            const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
            if (!passwordRegex.test(formData.password)) {
                alert("パスワードは英数字4文字以上で入力してください。");
                return;
            }
            payload.password = formData.password;
        } else if (!isEdit) {
            alert("新規作成時はパスワードが必要です。");
            return;
        }

        if (!formData.shopId) {
            alert("店舗を選択してください。");
            return;
        }

        setIsSubmitting(true);

        try {
            // URL & Method
            const url = isEdit
                ? `https://api.kiiswebai.com/api/v1/users/${initialData.ID}`
                : "https://api.kiiswebai.com/api/v1/signup";
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`${isEdit ? "更新" : "登録"}に失敗しました`);

            alert(`スタッフを${isEdit ? "更新" : "登録"}しました！`);
            onSuccess();
        } catch (error) {
            alert("エラーが発生しました。");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* --- 名前入力 --- */}
            <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-50"
                    placeholder="staff@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            {/* --- パスワード --- */}
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Password {isEdit && <span className="text-xs font-normal normal-case">(変更する場合のみ入力)</span>}
                </label>
                <input
                    type="password"
                    // Required only if creating a new user
                    required={!isEdit}
                    minLength={4}
                    pattern="^[a-zA-Z0-9]+$"
                    disabled={isSubmitting}
                    title="英数字4文字以上で入力してください"
                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all invalid:ring-red-200 disabled:opacity-50"
                    placeholder={isEdit ? "•••• (変更なし)" : "••••"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            {/* --- 権限 --- */}
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                <select
                    value={formData.role}
                    disabled={isSubmitting}
                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-600 disabled:opacity-50"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="admin">管理者 (Admin)</option>
                    <option value="manager">店長 (Manager)</option>
                    <option value="staff">スタッフ (Staff)</option>
                </select>
            </div>

            {/* --- 店舗名 --- */}
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shop</label>
                <div className="relative">
                    <select
                        required
                        disabled={isLoading || isSubmitting}
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

            <div className="md:col-span-2 mt-4 text-center text-slate-400 text-xs italic">
                ※ 各項目を入力して{isEdit ? "更新" : "登録"}を完了してください。
            </div>

            <div className="md:col-span-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                >
                    {isSubmitting ? "送信中..." : (isEdit ? "更新する" : "登録する")}
                </button>
            </div>
        </form>
    );
}
