"use client";

import React, { useState } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";
import StoreForm from "./StoreForm";
import { useStores } from "@/hooks/useStores"; // フックをインポート

export default function StoreListPage() {
    const [view, setView] = useState<"list" | "form">("list");
    const [selectedStore, setSelectedStore] = useState<any>(null);

    // 💡 TanStack Query を使用 (loadingやdataを自動取得)
    const { data: stores = [], isLoading, refetch } = useStores();

    return (
        <AdminPageTemplate title={view === "list" ? "Store List" : (selectedStore ? "Edit Store" : "New Store")}>
            {view === "list" ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            登録店舗数: {stores.length}
                        </p>
                        <button
                            onClick={() => { setSelectedStore(null); setView("form"); }}
                            className="px-5 py-2 bg-indigo-500 text-white text-xs font-bold rounded-full"
                        >
                            店舗を追加
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {isLoading ? (
                            <div className="py-20 text-center animate-pulse">LOADING...</div>
                        ) : (
                            stores.map((store) => (
                                <div key={store.id} className="group flex items-center justify-between py-5 px-4 hover:bg-indigo-50/50 rounded-3xl transition-colors">
                                    <h3 className="text-slate-700 font-bold">{store.name}</h3>
                                    <button
                                        onClick={() => { setSelectedStore(store); setView("form"); }}
                                        className="p-3 text-slate-300 hover:text-indigo-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button onClick={() => setView("list")} className="mb-8 text-[10px] font-bold text-slate-400">
                        一覧に戻る
                    </button>
                    <StoreForm
                        initialData={selectedStore}
                        onSuccess={() => {
                            setView("list");
                            refetch(); // 💡 保存後にデータを再取得！
                        }}
                    />
                </div>
            )}
        </AdminPageTemplate>
    );
}