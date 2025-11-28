export interface ChatResponse {
  response: string;
  intent: string;
  tracking_data: unknown;
}

export const sendMessage = async (
  message: string,
  userId?: string
): Promise<ChatResponse> => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  const response = await fetch(`${baseUrl}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      message,
      user_id: userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Network response was not ok");
  }

  return response.json();
};
