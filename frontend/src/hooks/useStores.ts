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

            // 自動生成された型を使用してキャスト
            const data: StoreResponse = await response.json();

            // オブジェクト形式 { "1": "表参道", "2": "青山" } を
            // 配列形式 [{ id: "1", name: "表参道" }, ...] に変換
            return Object.entries(data).map(([id, name]) => ({
                id,
                name,
            }));
        },
    });
};