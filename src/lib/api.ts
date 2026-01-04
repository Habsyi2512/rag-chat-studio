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
  // Use the CMS API (Laravel) which acts as a proxy and logger
  // Assuming /cms-api is the prefix for Laravel API as seen in cms.ts
  const baseUrl = "/cms-api";

  const response = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // No API key needed for the public Laravel endpoint, 
      // or if needed, it should be a public key. 
      // For now, assuming no auth required for public chat as per api.php
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
