"use client";

import React, { useState } from "react";
import { useStores, StoreListItem } from "@/hooks/useStores";
import { deleteResource } from "@/components/Delete";
import { authFetch } from '@/components/Token';

interface CourseFormProps {
    initialData?: {
        ID: number;
        name: string;
        price: number;
        total_count?: number;
        store_id: number;
    } | null;
    onSuccess: () => void;
}

export default function CourseForm({ initialData, onSuccess }: CourseFormProps) {
    const { data: stores, isLoading } = useStores();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        price: initialData?.price || 0,
        totalCount: initialData?.total_count || 1,
        shopId: initialData?.store_id ? String(initialData.store_id) : "",
    });

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!formData.shopId) {
            alert("店舗を選択してください。");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: formData.name,
            price: formData.price,
            total_count: formData.totalCount,
            store_id: Number(formData.shopId),
        };

        try {

            const url = isEdit
                ? `/course/${initialData.ID}`
                : "/course-registration";

            const method = isEdit ? "PUT" : "POST";

            await authFetch(url, {
                method: method,
                body: JSON.stringify(payload),
            });

            alert(`コースを${isEdit ? "更新" : "登録"}しました！`);
            onSuccess();
        } catch (error) {
            alert(error instanceof Error ? error.message : "エラーが発生しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    // handleSubmit の後に追加
    const handleDelete = async () => {
        // 1. IDがあるかチェック
        const courseId = initialData?.ID;
        if (!courseId) return;

        // 2. 確認ダイアログ
        if (!confirm("このコースを削除してもよろしいですか？")) return;

        setIsSubmitting(true);
        try {
            // 3. 共通関数を呼び出す
            // 第一引数にリソース名 "course"、第二引数にIDを渡す
            await deleteResource("course", String(courseId));

            alert("コースを削除しました");
            onSuccess(); // 一覧に戻る処理を実行
        } catch (error) {
            alert(error instanceof Error ? error.message : "削除に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {/* --- 店舗名選択 --- */}
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

            {/* --- コース名 --- */}
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-50"
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
                            disabled={isSubmitting}
                            className="w-full mt-2 pl-10 pr-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-50"
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
                        disabled={isSubmitting}
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-50"
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
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                >
                    {isSubmitting ? "送信中..." : (isEdit ? "コースを更新する" : "コースを登録する")}
                </button>
            </div>
            {/* 💡 編集モードの時だけ、共通関数を使った削除ボタンを表示 */}
            {isEdit && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="w-full bg-white border-2 border-red-100 hover:bg-red-50 text-red-500 font-medium py-4 rounded-2xl transition-all disabled:opacity-50"
                >
                    コースを削除する
                </button>
            )}
        </form>
    );
}
