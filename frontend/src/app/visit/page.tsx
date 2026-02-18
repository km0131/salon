"use client";

import React, { useState, useEffect } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";
import { useStores } from "@/hooks/useStores";

interface Customer {
    id: number;
    last_name: string;
    first_name: string;
    last_name_kana: string;
}

export default function VisitRegistrationPage() {
    const { data: stores, isLoading: storesLoading } = useStores();

    // --- 検索・選択ステート ---
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // --- フォームステート ---
    const [formData, setFormData] = useState({
        storeId: "",
        courseId: "",
        memo: "",
    });

    // 検索ロジック (デバウンス)
    useEffect(() => {
        if (!searchQuery.trim() || selectedCustomer) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                // TODO: 実際のAPIエンドポイントに合わせて調整
                // const res = await fetch(`/api/v1/customers/search?q=${searchQuery}`);
                // const data = await res.json();

                // モックデータでのシミュレーション
                const mockResults = [
                    { id: 1, last_name: "山田", first_name: "太郎", last_name_kana: "ヤマダ" },
                    { id: 2, last_name: "山田", first_name: "花子", last_name_kana: "ヤマダ" },
                    { id: 3, last_name: "佐藤", first_name: "健一", last_name_kana: "サトウ" },
                ].filter(c => c.last_name.includes(searchQuery));

                setResults(mockResults);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCustomer]);

    return (
        <AdminPageTemplate title="Visit Registration">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* --- 1. 顧客検索エリア (最上部) --- */}
                <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest ml-1 mb-2 block">
                        Customer Search
                    </label>

                    {!selectedCustomer ? (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="苗字を入力して検索（例: 山田）"
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {isSearching && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                                </div>
                            )}

                            {/* 検索候補ドロップダウン */}
                            {results.length > 0 && (
                                <div className="absolute z-20 w-full mt-3 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {results.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            className="w-full text-left px-6 py-4 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-none flex justify-between items-center"
                                            onClick={() => setSelectedCustomer(c)}
                                        >
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">{c.last_name_kana}</span>
                                                <span className="font-bold text-slate-700">{c.last_name} {c.first_name}</span>
                                            </div>
                                            <span className="text-indigo-500 text-sm">選択する →</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* 顧客選択後の表示 */
                        <div className="flex items-center justify-between p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">👤</div>
                                <div>
                                    <p className="text-[10px] opacity-80 uppercase font-bold tracking-tighter">Selected Customer</p>
                                    <p className="text-xl font-bold">{selectedCustomer.last_name} {selectedCustomer.first_name} 様</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setSelectedCustomer(null); setSearchQuery(""); }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs transition-colors"
                            >
                                変更
                            </button>
                        </div>
                    )}
                </section>

                {/* --- 2. 来店詳細フォーム --- */}
                {selectedCustomer && (
                    <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Shop</label>
                                <select
                                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={formData.storeId}
                                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                                >
                                    <option value="">店舗を選択</option>
                                    {stores?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course</label>
                                <select
                                    className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                >
                                    <option value="">メニューを選択</option>
                                    <option value="1">全身脱毛 5回パック</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Memo</label>
                            <textarea
                                className="w-full mt-2 px-5 py-4 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-200 outline-none min-h-[120px]"
                                placeholder="本日の施術内容メモ..."
                                value={formData.memo}
                                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            来店を登録する
                        </button>
                    </form>
                )}
            </div>
        </AdminPageTemplate>
    );
}