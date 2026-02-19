"use client";

import React, { useState } from "react";
import AdminPageTemplate from "@/components/AdminPageTemplate";
import StaffForm from "./StaffForm";
import { useStaff, StaffListItem } from "@/hooks/useStaff";

export default function StaffPage() {
    const [view, setView] = useState<"list" | "form">("list");
    const [selectedStaff, setSelectedStaff] = useState<StaffListItem | null>(null);

    // Use the custom hook
    const { data: staffList = [], isLoading, refetch } = useStaff();

    const roleLabel = (role: string) => {
        switch (role) {
            case "admin": return "管理者";
            case "manager": return "店長";
            case "staff": return "スタッフ";
            default: return role;
        }
    };

    return (
        <AdminPageTemplate title={view === "list" ? "Staff List" : (selectedStaff ? "Edit Staff" : "New Staff")}>
            {view === "list" ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            登録スタッフ数: {staffList.length}
                        </p>
                        <button
                            onClick={() => { setSelectedStaff(null); setView("form"); }}
                            className="px-5 py-2 bg-indigo-500 text-white text-xs font-bold rounded-full hover:bg-indigo-600 transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
                        >
                            スタッフを追加
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {isLoading ? (
                            <div className="py-20 text-center animate-pulse">LOADING...</div>
                        ) : staffList.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 text-sm italic">スタッフが登録されていません</div>
                        ) : (
                            staffList.map((staff) => (
                                <div key={staff.ID} className="group flex items-center justify-between py-5 px-4 hover:bg-indigo-50/50 rounded-3xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-slate-700 font-bold">{staff.name}</h3>
                                            <p className="text-xs text-slate-400">
                                                {roleLabel(staff.role)} • {staff.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedStaff(staff); setView("form"); }}
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
                    <button onClick={() => setView("list")} className="mb-8 text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">
                        一覧に戻る
                    </button>
                    <StaffForm
                        initialData={selectedStaff}
                        onSuccess={() => {
                            setView("list");
                            refetch();
                        }}
                    />
                </div>
            )}
        </AdminPageTemplate>
    );
}