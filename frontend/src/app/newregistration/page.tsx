"use client";

import React, { useState, useCallback } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";
import { useStores, StoreListItem } from "@/hooks/useStores";

export default function CustomerRegistrationPage() {
    const { data: stores, isLoading: storesLoading } = useStores();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        lastNameKana: "",
        firstNameKana: "",
        zipCode: "",
        prefName: "",
        address1: "",
        address2: "",
        sex: "女性",
        birthDate: "",
        phone: "",
        storeId: "",
    });

    // --- 1. fetchAddress を useCallback で定義する ---
    const fetchAddress = useCallback(async (zip: string) => {
        if (zip.length !== 7) return;

        try {
            const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
            const data = await res.json();

            if (data.results && data.results[0]) {
                const result = data.results[0];
                setFormData((prev) => ({
                    ...prev,
                    prefName: result.address1,
                    address1: result.address2 + result.address3,
                }));
            }
        } catch (error) {
            console.error("郵便番号検索失敗:", error);
        }
    }, []); // 依存配列は空でOK

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            last_name: formData.lastName,
            first_name: formData.firstName,
            last_name_kana: formData.lastNameKana,
            first_name_kana: formData.firstNameKana,
            zip_code: formData.zipCode,
            pref_name: formData.prefName,
            address1: formData.address1,
            address2: formData.address2,
            sex: formData.sex,
            birth_date: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
            phone: formData.phone,
            store_id: Number(formData.storeId),
        };

        try {
            const response = await fetch("https://api.kiiswebai.com/api/v1/customer-registration", {
                method: "POST",
                mode: "cors", // これを追加
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // これも追加しておくと安全
                },
                body: JSON.stringify(payload),
            }); if (!response.ok) throw new Error("登録に失敗しました");
            console.log("送信データ:", payload);
            // const res = await fetch("/api/customers", { ... });
            alert("顧客を登録しました");
            // フォームリセット等の処理
        } catch (error) {
            alert("登録に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminPageTemplate title="Customer Registration">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                {/* --- 氏名 --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input
                        type="text" required placeholder="姓"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input
                        type="text" required placeholder="名"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>

                {/* --- カナ --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name (Kana)</label>
                    <input
                        type="text" placeholder="セイ"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.lastNameKana}
                        onChange={(e) => setFormData({ ...formData, lastNameKana: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name (Kana)</label>
                    <input
                        type="text" placeholder="メイ"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.firstNameKana}
                        onChange={(e) => setFormData({ ...formData, firstNameKana: e.target.value })}
                    />
                </div>

                <hr className="md:col-span-2 border-slate-100 my-2" />

                {/* --- 住所 (ポストくん構成) --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Zip Code</label>
                    <input
                        inputMode="numeric"     // スマホで最初から数字キーボードを出す
                        pattern="\d*"
                        type="text" placeholder="1234567" maxLength={7}
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.zipCode}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, ""); // 数字以外を除去
                            setFormData(prev => ({ ...prev, zipCode: val }));
                            if (val.length === 7) fetchAddress(val); // 7桁入力されたら検索開始
                        }}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prefecture</label>
                    <input
                        type="text" placeholder="都道府県"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.prefName}
                        onChange={(e) => setFormData({ ...formData, prefName: e.target.value })}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Address 1</label>
                    <input
                        type="text" placeholder="市区町村・町域"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.address1}
                        onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Address 2</label>
                    <input
                        type="text" placeholder="ビル・マンション名"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.address2}
                        onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                    />
                </div>

                <hr className="md:col-span-2 border-slate-100 my-2" />

                {/* --- 属性情報 --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sex</label>
                    <select
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none text-slate-600"
                        value={formData.sex}
                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    >
                        <option value="女性">女性</option>
                        <option value="男性">男性</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
                    <input
                        type="date"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none text-slate-600"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                    <input
                        type="tel" placeholder="09012345678"
                        className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                {/* --- 店舗選択 --- */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Registration Shop</label>
                    <div className="relative">
                        <select
                            required disabled={storesLoading}
                            className="w-full mt-2 px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none appearance-none text-slate-600 disabled:opacity-50"
                            value={formData.storeId}
                            onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                        >
                            <option value="">店舗を選択してください</option>
                            {Array.isArray(stores) && stores.map((store: StoreListItem) => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pt-2 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* --- ボタン --- */}
                <div className="md:col-span-2 mt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? "登録中..." : "顧客情報を登録する"}
                    </button>
                </div>
            </form>
        </AdminPageTemplate>
    );
}