import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/components/Token";

export type CustomerListItem = {
    ID: number;
    last_name: string;
    first_name: string;
    last_name_kana: string;
    first_name_kana: string;
    zip_code: string;
    pref_name: string;
    address1: string;
    address2: string;
    sex: string;
    birth_date: string;
    phone: string;
    store_id: number;
};

export const useCustomers = () => {
    return useQuery<CustomerListItem[]>({
        queryKey: ["customers"],
        queryFn: async (): Promise<CustomerListItem[]> => {
            const response = await authFetch("/customer");
            if (!response.ok) throw new Error("取得失敗");

            const data = await response.json();
            return data || [];
        },
    });
};
