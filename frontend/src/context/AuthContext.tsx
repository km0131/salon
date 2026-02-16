"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 保持したいユーザー情報の型
type SessionUser = {
    name: string;
    shop: string;
    role: string;
} | null;

// コンテキストの型
interface AuthContextType {
    user: SessionUser;
    setUser: (user: SessionUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser>(null);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null); // ここで一気に初期化（クリア）する！
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// どの画面からでも呼べるようにするフック
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};