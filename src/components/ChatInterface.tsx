import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Copy, Check, CreditCard, Users, FileText, MapPin } from "lucide-react";
import AnimatedContent from "./AnimatedContent";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import GradientText from "./GradientText";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Bot, User as UserIcon } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseTime?: number;
}

export const ChatInterface = ({
  sessionId,
  onSessionCreated
}: {
  sessionId?: string;
  onSessionCreated?: (id: string) => void
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickChatOptions = [
    { icon: CreditCard, label: "Syarat buat KTP", message: "Apa syarat pembuatan KTP?" },
    { icon: Users, label: "Kartu Keluarga", message: "Apa syarat Kartu Keluarga yang baru?" },
    { icon: FileText, label: "Akta Kelahiran", message: "Bagaimana prosedur membuat akta kelahiran" },
    { icon: MapPin, label: "Lokasi Kantor", message: "Dimana lokasi kantor Disdukcapil Anambas?" }
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);


  // Load messages if sessionId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (sessionId) {
        setIsLoading(true);
        try {
          const history = await api.getSessionMessages(sessionId);
          setMessages(history.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at),
            responseTime: m.response_time
          })));
        } catch (error) {
          console.error("Failed to load messages:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear messages for new chat
        setMessages([]);
      }
    };
    loadMessages();
  }, [sessionId]);

  const handleSend = async (text?: string) => {
    const content = typeof text === "string" ? text : input;
    if (!content.trim() || isLoading) return;

    const startTime = Date.now();
    const userMessage: Message = {
      role: "user",
      content: content,
      timestamp: new Date()
    };

    // Optimistic update
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await api.sendMessage(userMessage.content, sessionId);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // Notify parent if new session was created
      if (!sessionId && onSessionCreated) {
        onSessionCreated(String(data.session_id));
      }

      const aiResponse: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        responseTime: data.response_time
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = {
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat menghubungi server. Pastikan Anda sudah login.",
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
      className={`flex flex-col h-full overflow-hidden ${messages.every(m => m.role !== 'user') ? "justify-between lg:justify-center" : "justify-between"}`}
    >
      {messages.every(m => m.role !== 'user') ? (
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
            <div className="flex flex-col items-center">
              <GradientText
                showBorder={false}
                className="lg:text-4xl text-3xl font-black bg-white/20 backdrop-blur-xl px-8 py-2 rounded-[40px] border border-white/50 shadow-2xl transition-all duration-700"
              >
                Disdukcapil Kepulauan Anambas
              </GradientText>

            </div>

            <div className="flex flex-wrap gap-2 justify-center w-full max-w-2xl px-4">
              {quickChatOptions.map((option, index) => (
                <button
                  key={index}
                  className="flex bg-white/10 backdrop-blur-xl items-center gap-2 px-5 py-3 border border-white/20 hover:border-white/40 rounded-full text-sm text-white/90 hover:bg-white/20 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 group"
                  onClick={() => handleSend(option.message)}
                >
                  <option.icon size={16} className="text-white/60 group-hover:text-white" />
                  <span className="whitespace-nowrap text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </AnimatedContent>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-4 p-4 lg:p-0 mx-auto max-w-5xl">
            {messages.map((message, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Only show User Avatar, hide Bot Avatar */}
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-primary text-primary-foreground">
                    <UserIcon size={16} />
                  </div>
                )}

                <div className={cn(
                  "flex flex-col max-w-[85%] lg:max-w-[75%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div
                    className={cn(
                      "px-5 py-4 relative group transition-all duration-300",
                      "prose prose-sm max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-md"
                        : "bg-white/20 backdrop-blur-xl text-white font-medium rounded-2xl rounded-tl-none border border-white/30 shadow-lg"
                    )}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>

                    <div className={cn(
                      "flex items-center gap-2 mt-3 pt-2 text-[10px] border-t border-white/10",
                      message.role === "user" ? "text-primary-foreground/80 opacity-70" : "text-white/80"
                    )}>
                      <div className="flex items-center gap-1.5">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.responseTime != null && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white font-bold border border-white/20">
                            <Bot size={10} />
                            <span>Waktu respon: {Number(message.responseTime).toFixed(2)}s</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1" />
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className="hover:scale-110 active:scale-95 transition-transform"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 items-center"
              >
                <div className="w-8 h-8 rounded-full bg-white/80 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="rounded-2xl px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm flex gap-1">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-primary rounded-full"></motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-primary rounded-full"></motion.span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-primary rounded-full"></motion.span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      )}
      <motion.div layout className="p-4 z-20 shrink-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <div className="relative group bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 shadow-2xl transition-all duration-300">
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
              className="w-full text-base md:text-sm resize-none bg-transparent border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 p-5 pr-14 min-h-[64px] max-h-[200px] text-white placeholder:text-white/40 shadow-none selection:bg-primary/30"
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
