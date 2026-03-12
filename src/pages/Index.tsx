import { ChatInterface } from "@/components/ChatInterface";
import LightRays from "@/components/LightRays";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/20 overflow-hidden flex flex-col">
      {/* Background decorative elements */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays absolute h-full inset-0"
      />
      <div className="absolute inset-0 z-0">
        <img src="/background.webp" alt="" className="w-full h-full object-cover opacity-60" />
      </div>

      {/* Header */}
      <header className="shrink-0 z-50 p-4">
        <div className="max-w-7xl border border-white/20 shadow-sm px-3 py-2 rounded-full backdrop-blur-sm bg-gray-50/50 mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            RAG Chatbot
          </h1>
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Lock className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 relative z-10 min-h-0">

        <div className="h-full max-w-7xl mx-auto md:p-4 p-0">
          <div className="h-full md:rounded-2xl rounded-none overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
