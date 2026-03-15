import { useQuery } from "@tanstack/react-query";
import type { paths } from "@/api/api.d.ts"; // 自動生成された型
import { authFetch } from "@/components/Token";

type User = paths["/ping"]["get"]["responses"]["200"]["content"]["application/json"];

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async (): Promise<User> => {
            const res = await authFetch("/ping");
            return res.json();
        },
    });
};
