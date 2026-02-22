import { useQuery } from "@tanstack/react-query";
import type { paths } from "@/api/api.d.ts";
import { authFetch } from "@/components/Token";

// OpenAPIから生成された型を抽出
type CourseResponse = paths["/course"]["get"]["responses"]["200"]["content"]["application/json"];

// コンポーネントで扱う用の型（必要に応じて）
export type CourseListItem = {
    id: string;
    name: string;
    price: number;
};

export const useCourses = () => {
    return useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const response = await authFetch("/courses");

            if (!response.ok) {
                throw new Error("コースデータの取得に失敗しました");
            }

            // data は CourseResponse 型（model.Course の配列、または単体）
            const data: CourseResponse = await response.json();

            // data が配列であることを確認して map
            // ※Swaggerの定義が単体オブジェクト {object} になっている場合があるため Array.isArray でガード
            const courseList = Array.isArray(data) ? data : [data];

            return courseList.map((course) => ({
                id: String(course.ID || (course as any).id),
                name: course.Name || (course as any).name || "",
                price: course.Price || (course as any).price || 0,
            }));
        },
    });
};