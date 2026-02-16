"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Props {
    title: string;           // 画面タイトル (例: "Staff Registration")
    children: React.ReactNode; // フォームなどの中身
}

export default function AdminPageTemplate({ title, children }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogoutClick = () => {
        logout();
        router.push("/login");
    };

    return (
        <main className="relative min-h-screen bg-linear-to-tr from-slate-50 to-indigo-50/30 p-8">
            {/* --- ヘッダー・ナビゲーション --- */}
            <header className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
                {/* 左側：三本線メニュー */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-slate-600 hover:bg-white transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute top-14 left-0 w-56 bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <nav className="flex flex-col gap-2">
                                <Link href="/dashboard" className="px-4 py-3 hover:bg-indigo-50 rounded-xl text-sm text-slate-600 transition-colors">Dashboard</Link>
                                <Link href="/admin/users" className="px-4 py-3 hover:bg-indigo-50 rounded-xl text-sm text-slate-600 transition-colors">Staff Management</Link>
                                <Link href="/admin/shops" className="px-4 py-3 hover:bg-indigo-50 rounded-xl text-sm text-slate-600 transition-colors">Shop Settings</Link>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={handleLogoutClick} className="px-4 py-3 text-left hover:bg-red-50 rounded-xl text-sm text-red-400 transition-colors">Logout</button>
                            </nav>
                        </div>
                    )}
                </div>

                {/* 右側：ユーザー情報 */}
                <div className="flex items-center gap-4 px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-sm">
                    {user ? (
                        <>
                            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {user.shop || "Unknown"} / {user.role}
                                </span>
                                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                            </div>
                            <div className="w-8 h-8 bg-linear-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner">
                                {user.name[0]}
                            </div>
                        </>
                    ) : (
                        <div className="px-4 text-xs text-slate-400 italic">Loading session...</div>
                    )}
                </div>
            </header>

            {/* --- メインコンテンツ --- */}
            <div className="max-w-2xl mx-auto pt-24">
                <div className="flex items-center gap-4 mb-8">
                    <Image src="/b1.png" alt="Logo" width={40} height={40} priority />
                    <h1 className="text-xl font-light tracking-widest text-slate-700 uppercase">{title}</h1>
                </div>

                <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-[2.5rem] p-10">
                    {children}
                </div>
            </div>
        </main>
    );
}