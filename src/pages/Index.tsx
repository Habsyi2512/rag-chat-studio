import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="relative z-10 h-[calc(100vh-73px)]">
        <div className="h-full max-w-7xl mx-auto p-4">
          <div className="h-full rounded-2xl border border-border/40 backdrop-blur-xl bg-background/60 shadow-2xl overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
