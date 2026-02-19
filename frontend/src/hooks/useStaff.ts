import { useQuery } from "@tanstack/react-query";

export type StaffListItem = {
    ID: number;
    name: string;
    email: string;
    role: string;
    store_id: number;
};

export const useStaff = () => {
    return useQuery<StaffListItem[]>({
        queryKey: ["staff"],
        queryFn: async (): Promise<StaffListItem[]> => {
            const response = await fetch("https://api.kiiswebai.com/api/v1/users");
            if (!response.ok) throw new Error("取得失敗");

            const data = await response.json();
            // Data is directly an array
            return data.map((item: any) => ({
                ID: item.ID,
                name: item.name,
                email: item.email,
                role: item.role,
                store_id: item.store_id,
            }));
        },
    });
};
