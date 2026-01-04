import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Copy, Check, CreditCard, Users, FileText, MapPin } from "lucide-react";
import AnimatedContent from "./AnimatedContent";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import GradientText from "./GradientText";
import { sendMessage } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseTime?: number;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const quickChatOptions = [
    { icon: CreditCard, label: "Syarat buat KTP", message: "Apa syarat pembuatan KTP?" },
    { icon: Users, label: "Kartu Keluarga", message: "Bagaimana cara mengurus Kartu Keluarga?" },
    { icon: FileText, label: "Akta Kelahiran", message: "Berapa lama proses pembuatan Akta Kelahiran?" },
    { icon: MapPin, label: "Lokasi Kantor", message: "Dimana lokasi kantor Disdukcapil?" }
  ];

  const handleSend = async (text?: string) => {
    const content = typeof text === "string" ? text : input;
    if (!content.trim() || isLoading) return;

    const startTime = Date.now();
    const userMessage: Message = {
      role: "user",
      content: content,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format history for API
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const data = await sendMessage(userMessage.content, history);
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
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts (HTTP)
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          return;
        }
        document.body.removeChild(textArea);
      }
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
    <motion.div
      layout
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`flex flex-col h-full overflow-hidden ${messages.length === 0 ? "justify-between lg:justify-center" : "justify-between"}`}
    >
      {messages.length === 0 ? (
        <div className="w-full px-4 flex-1 flex flex-col justify-center lg:flex-none">
          <AnimatedContent
            distance={20}
            direction="vertical"
            reverse={true}
            duration={1.5}
            initialOpacity={0}
            animateOpacity={true}
            scale={1}
            threshold={0.1}
            className="flex flex-col items-center gap-8 p-4"
          >
            <div className="">
              <GradientText className="lg:text-4xl bg-white/60 backdrop-blur-sm text-xl text-center font-black">Disdukcapil Kepulauan Anambas</GradientText>
            </div>

            <div className="flex flex-wrap gap-2 justify-center w-full max-w-2xl px-4">
              {quickChatOptions.map((option, index) => (
                <button
                  key={index}
                  className="flex bg-gray-50/50 backdrop-blur-sm items-center gap-2 px-4 py-2.5 border border-gray-50 hover:border-primary rounded-full text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-sm hover:scale-105 active:scale-95"
                  onClick={() => handleSend(option.message)}
                >
                  <option.icon size={16} />
                  <span className="whitespace-nowrap">{option.label}</span>
                </button>
              ))}
            </div>
          </AnimatedContent>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-4 p-4 lg:p-0 mx-auto max-w-5xl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={cn(
                    "max-w-[80%] backdrop-blur-sm relative group",
                    "prose prose-sm bg-gray-50/50  max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                    message.role === "user"
                      ? "bg-primary/70 rounded-b-3xl rounded-tl-3xl rounded-tr-[3px] text-primary-foreground prose-invert dark:prose"
                      : "rounded-b-3xl rounded-tr-3xl rounded-tl-[3px]"
                  )}
                >
                  <div className="px-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>


                  <div className="flex items-center px-3 py-1 border-t-black/20 border-t gap-2 mt-1">
                    <span className={cn("text-[12px] text-black text-muted-foreground", message.role === "user" ? "text-primary-foreground" : "")}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.responseTime && (
                      <span className={cn("text-[12px] text-black text-muted-foreground", message.role === "user" ? "text-primary-foreground" : "")}>
                        • {message.responseTime.toFixed(2)}s
                      </span>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard(message.content, index);
                            }}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Salin teks</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                  </div>
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
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}
      <motion.div layout className="p-4 z-20 shrink-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <div className="relative group bg-gray-50/50 backdrop-blur-md rounded-3xl shadow-lg transition-all duration-300 ring-0 focus-within:ring-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ketik pesan Anda..."
              className="w-full text-base md:text-sm resize-none bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 p-4 pr-14 min-h-[60px] max-h-[200px] placeholder:text-muted-foreground/50 shadow-none"
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2">
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                size="icon"
                className={cn(
                  "rounded-full w-9 h-9 shadow-sm transition-all duration-300",
                  input.trim() ? "bg-primary text-primary-foreground scale-100 opacity-100" : "bg-muted text-muted-foreground scale-90 opacity-0"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {messages.length > 0 && (
            <p className="text-[10px] text-center text-gray-50/80">
              AI dapat membuat kesalahan. Mohon periksa kembali jawaban.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
