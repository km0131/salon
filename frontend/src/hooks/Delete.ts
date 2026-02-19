// deleteApi.ts (共通の関数)
export const deleteResource = async (resourceName: string, id: string) => {
    const response = await fetch(`https://api.kiiswebai.com/api/v1/${resourceName}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`${resourceName} の削除に失敗しました`);
    }
    return response.json();
};