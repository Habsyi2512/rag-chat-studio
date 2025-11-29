const BASE_URL = "/cms-api";

export const cmsFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Terjadi kesalahan pada server");
    }

    return response.json();
};
