// src/lib/api.ts

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
  asal_desa?: string;
}

export interface ChatSession {
  id: string; // Changed to string for UUID support
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  session_id: string; // Added/Updated to string
  retrieved_docs?: string[];
  created_at: string;
}

export interface ChatResponse {
  session_id: string; // Changed to string
  response: string;
  intent: string;
  category: string;
  retrieved_docs?: string[];
}

const baseUrl = "/api";

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || "Login failed");
    return res.json();
  },

  register: async (data: { email: string; password: string; asal_desa?: string }) => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).detail || "Registration failed");
    return res.json();
  },

  // Chat
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const res = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || "Failed to send message");
    return res.json();
  },

  getSessions: async (): Promise<ChatSession[]> => {
    const res = await fetch(`${baseUrl}/chat/sessions`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  },

  getSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const res = await fetch(`${baseUrl}/chat/session/${sessionId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    return data.messages;
  },

  // Admin
  getAdminUsers: async (): Promise<User[]> => {
    const res = await fetch(`${baseUrl}/admin/users`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  getAdminChats: async (): Promise<ChatSession[]> => {
    const res = await fetch(`${baseUrl}/admin/chats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch all chats");
    return res.json();
  },
};

// Backward compatibility for existing code
export const sendMessage = api.sendMessage;
