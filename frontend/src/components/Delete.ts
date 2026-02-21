// deleteApi.ts
export const deleteResource = async (resourceName: string, id: string | number) => {
    // 1. localStorageからトークンを取得
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${resourceName}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            // 2. Authorizationヘッダーにトークンをセット
            "Authorization": token ? `Bearer ${token}` : "",
        },
    });

    if (!response.ok) {
        // バックエンドからエラーメッセージが返ってきている場合はそれを活用する
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `${resourceName} の削除に失敗しました`);
    }

    return response.json();
};