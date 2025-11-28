import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import GradientText from "./GradientText";
import { sendMessage } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseTime?: number; // in seconds
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const startTime = Date.now();
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendMessage(userMessage.content);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      const aiResponse: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        responseTime: duration
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = {
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat menghubungi server.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col ${messages.length == 0 ? "my-[200px]" : "h-full"}`}>
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="space-y-4 mx-auto max-w-3xl pb-4">
          <div>
            <GradientText className="lg:text-3xl text-xl text-center font-bold">Disdukcapil Kepulauan Anambas</GradientText>
            <GradientText className="lg:text-3xl text-xl text-center font-bold">Ada yang bisa saya bantu?</GradientText>
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={cn(
                  "px-4 py-3 max-w-[80%] backdrop-blur-sm relative group",
                  "prose prose-sm max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                  message.role === "user"
                    ? "bg-primary rounded-b-3xl rounded-tl-3xl rounded-tr-[3px] text-primary-foreground prose-invert dark:prose"
                    : "bg-card/60 prose-neutral dark:prose-invert rounded-b-3xl rounded-tr-3xl rounded-tl-[3px]"
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>

              <div className="flex items-center gap-2 mt-1 px-1">
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(message.timestamp)}
                </span>
                {message.responseTime && (
                  <span className="text-[10px] text-muted-foreground">
                    • {message.responseTime.toFixed(2)}s
                  </span>
                )}


                <Button
                  variant="ghost"
                  size="icon"
                  className=""
                  onClick={() => copyToClipboard(message.content, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>

              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-card/60 backdrop-blur-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 bg-background/80">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ketik pesan Anda..."
            className="flex-1 rounded-full bg-card/60 backdrop-blur-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
