export const authFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem("token");
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1${url.startsWith('/') ? '' : '/'}${url}`;
    return fetch(apiUrl, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`, // これを自動で追加！
            "Content-Type": "application/json",
        },
    });
};