import { useQuery } from "@tanstack/react-query";

export type CourseListItem = {
    ID: number;
    name: string;
    price: number;
    total_count?: number; // Go struct name is TotalCount, json is total_count
    store_id: number;
};

export const useCourses = () => {
    return useQuery<CourseListItem[]>({
        queryKey: ["courses"],
        queryFn: async (): Promise<CourseListItem[]> => {
            const response = await fetch("https://api.kiiswebai.com/api/v1/course");
            if (!response.ok) throw new Error("取得失敗");

            const data = await response.json();
            // Data is directly an array
            return data.map((item: any) => ({
                ID: item.ID,
                name: item.name,
                price: item.price,
                total_count: item.total_count,
                store_id: item.store_id,
            }));
        },
    });
};
