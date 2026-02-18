"use client";

import React from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate"; // パスは適宜調整してください
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Dashboard() {
    const { user } = useAuth();

    // 読み込み中のガード
    if (!user) return null;

    return (
        <AdminPageTemplate title="Dashboard">
            {/* メインのウェルカムメッセージ */}
            <div className="mb-10 text-center">
                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-3 tracking-widest uppercase">
                    ステータス: オンライン
                </span>
                <h2 className="text-3xl font-light text-slate-800">
                    <span className="font-semibold">ようこそ {user.name}</span>
                </h2>
                <p className="text-slate-400 mt-2">今日はどの業務から始めますか？</p>
            </div>

            {/* グリッドレイアウト：統計や情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 利用者登録 */}
                <Link href="/newregistration" className="block group">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                👤
                            </div>
                            <h3 className="font-bold text-slate-700">利用者登録</h3>
                        </div>
                    </div>
                </Link>

                {/* 来店登録 */}
                <Link href="" className="block group">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                📝
                            </div>
                            <h3 className="font-bold text-slate-700">来店登録</h3>
                        </div>
                    </div>
                </Link>
            </div>
        </AdminPageTemplate>
    );
}