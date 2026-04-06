import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatbotLayout } from "@/layouts/ChatbotLayout";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("s") || undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSelectSession = (id: string) => {
    setSearchParams({ s: id });
  };

  const handleNewChat = () => {
    setSearchParams({});
  };

  if (!token) return null;

  return (
    <ChatbotLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      sessionId={sessionId}
      handleSelectSession={handleSelectSession}
      handleNewChat={handleNewChat}
    >
      <div className="h-full w-full max-w-6xl mx-auto lg:p-6 p-0">
        <div className="h-full overflow-hidden flex flex-col">
          <ChatInterface
            sessionId={sessionId}
            onSessionCreated={(id) => handleSelectSession(id)}
          />
        </div>
      </div>
    </ChatbotLayout>
  );
};

export default Index;
