"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// 1. Goのトークンの中身に合わせたユーザー情報の型
type SessionUser = {
    id: number;     // user_id
    name: string;   // user_name
    shop: string;   // store_name
    role: string;   // role
    storeId: number; // store_id
} | null;

// 2. コンテキストが提供する機能の型
interface AuthContextType {
    user: SessionUser;
    setUser: (user: SessionUser) => void;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser>(null);

    // ログイン処理：トークンを解析して情報を保存
    const login = (token: string) => {
        try {
            localStorage.setItem("token", token);
            const decoded: any = jwtDecode(token);

            const roleMap: Record<string, string> = {
                "admin": "管理者",
                "manager": "店長",
                "staff": "スタッフ",
            };

            const mappedRole = roleMap[decoded.role] || "スタッフ";

            // Go側の GenerateToken のキー名と合わせる
            setUser({
                id: decoded.user_id,
                name: decoded.user_name || "名前なし", // ここが Unknown になっている可能性大
                shop: decoded.store_name || "店舗なし",
                role: mappedRole,
                storeId: decoded.store_id,
            });
        } catch (error) {
            console.error("Token decode error:", error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    // ブラウザのリロード時：LocalStorageにトークンがあれば復元
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            login(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};