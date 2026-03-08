"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data && data.id) {
        setMessages((prev) => [...prev, data]);
      }
    } catch {
      // handle error silently
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-5 border-b border-[#e5e5e7] bg-white">
        <div className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center">
          <span className="text-white text-[13px] font-semibold">CEO</span>
        </div>
        <div>
          <h1 className="text-[17px] font-semibold text-[#1d1d1f]">
            Chat with your CEO
          </h1>
          <p className="text-[12px] text-[#86868b]">
            Your AI Chief Executive Officer
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-6 space-y-5"
      >
        {messages.length === 0 && !sending && (
          <div className="empty-state mt-20">
            <h3>Start a conversation</h3>
            <p>Ask your CEO anything about your business strategy, team progress, or next steps.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[640px] animate-fade-in-up",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-semibold",
                msg.role === "user"
                  ? "bg-[#0071e3] text-white"
                  : "bg-[#7c3aed] text-white"
              )}
            >
              {msg.role === "user" ? "You" : "CEO"}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "rounded-2xl px-4 py-3 max-w-[480px]",
                msg.role === "user"
                  ? "bg-[#0071e3] text-white"
                  : "bg-[#f5f5f7] text-[#1d1d1f]"
              )}
            >
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              <p
                className={cn(
                  "text-[11px] mt-1.5",
                  msg.role === "user"
                    ? "text-white/60"
                    : "text-[#86868b]"
                )}
              >
                {relativeTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex gap-3 max-w-[640px] animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[12px] font-semibold">CEO</span>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl px-4 py-3">
              <div className="flex gap-1.5 items-center h-[20px]">
                <span className="w-2 h-2 bg-[#86868b] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#86868b] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#86868b] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-8 py-4 border-t border-[#e5e5e7] bg-white">
        <div className="flex items-end gap-3 max-w-[720px] mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your CEO anything..."
            rows={1}
            className="input flex-1 resize-none min-h-[44px] max-h-[120px]"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="btn btn-primary w-10 h-10 p-0 rounded-full flex-shrink-0"
            aria-label="Send message"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
