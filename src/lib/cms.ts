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

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Sesi telah berakhir, silakan login kembali.");
    }

    if (!response.ok) {
        let errorMessage = "Terjadi kesalahan pada server";
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
            // If response is not JSON
        }
        throw new Error(errorMessage);
    }

    return response.json();
};
