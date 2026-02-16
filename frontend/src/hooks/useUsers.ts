import { useQuery } from "@tanstack/react-query";
import type { paths } from "@/api/api.d.ts"; // 自動生成された型

type User = paths["/ping"]["get"]["responses"]["200"]["content"]["application/json"];

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async (): Promise<User> => {
            const res = await fetch("https://api.kiiswebai.com/api/v1/ping");
            return res.json();
        },
    });
};
