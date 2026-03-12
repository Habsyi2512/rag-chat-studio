export interface ChatResponse {
  response: string;
  intent: string;
  tracking_data: unknown;
}

export const sendMessage = async (
  message: string,
  history: Array<{ role: string; content: string }> = [],
  userId?: string
): Promise<ChatResponse> => {
  // Proxy /api to FastAPI
  const baseUrl = "/api";

  const response = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`
    },
    body: JSON.stringify({
      message,
      user_id: userId,
      history,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Network response was not ok");
  }

  return response.json();
};
