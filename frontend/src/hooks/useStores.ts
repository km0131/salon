import { useQuery } from "@tanstack/react-query";
import type { paths } from "@/api/api.d.ts"; // 自動生成された型

// 型の抽出
type StoreResponse = paths["/store"]["get"]["responses"]["200"]["content"]["application/json"];

// コンポーネントで使いたいデータの型
export type StoreListItem = {
    id: string;
    name: string;
};

//店舗情報の取得API
export const useStores = () => {
    return useQuery({
        queryKey: ["stores"],
        queryFn: async () => {
            const response = await fetch("https://api.kiiswebai.com/api/v1/store");

            if (!response.ok) {
                throw new Error("店舗データの取得に失敗しました");
            }

            // 一旦 any で受け取って構造を強制的に合わせる（または自動生成された型が古ければ修正）
            const data = await response.json();

            // Go側が { "stores": [ {id: 1, name: "店名"}, ... ] } を返している場合
            return (data.stores || []).map((store: { id: number | string; name: string }) => ({
                id: String(store.id), // 数値で来ても文字列に変換
                name: store.name,
            }));
        },
    });
};