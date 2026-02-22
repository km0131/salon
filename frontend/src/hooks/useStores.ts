import { useQuery } from "@tanstack/react-query";
import type { paths } from "@/api/api.d.ts"; // 自動生成された型
import { authFetch } from "@/components/Token";

// 型の抽出
type StoreResponse = paths["/store"]["get"]["responses"]["200"]["content"]["application/json"];

// コンポーネントで使いたいデータの型
export type StoreListItem = {
    id: string;
    name: string;
};

//店舗情報の取得API
export const useStores = () => {
    // 💡 <StoreListItem[]> を追加して「何を返すか」を明確にするだけ
    return useQuery<StoreListItem[]>({
        queryKey: ["stores"],
        queryFn: async (): Promise<StoreListItem[]> => {
            const response = await authFetch("/store");
            if (!response.ok) throw new Error("取得失敗");

            const data = await response.json();
            return (data.stores || []).map((store: any) => ({
                id: String(store.id),
                name: store.name,
            }));
        },
    });
};