"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the Phantex Tech assistant. Ask me about our services, pricing, or team — or I can help you book a meeting. 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // The /chat page hosts the full Phantex AI workspace — hide the floating
  // widget there to avoid two chat surfaces on the same screen.
  if (pathname === "/chat") return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text, history: messages.slice(-10) }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0F0F0F] text-[#F59E0B] shadow-xl flex items-center justify-center hover:bg-[#1a1a1a] transition-colors ring-2 ring-[#F59E0B]/30"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#FAFAF8] border border-[#E7E5E4] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F0F0F] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0F0F0F] text-sm font-bold">
              PT
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Phantex Tech AI</p>
              <p className="text-[#F59E0B]/70 text-xs">Usually replies instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/40 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#0F0F0F] text-white rounded-br-sm"
                      : "bg-[#F5F5F0] text-[#0F0F0F] border border-[#E7E5E4] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F5F5F0] border border-[#E7E5E4] px-3 py-2 rounded-xl rounded-bl-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-bounce [animation-delay:0ms]"/>
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-bounce [animation-delay:150ms]"/>
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-bounce [animation-delay:300ms]"/>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="border-t border-[#E7E5E4] p-3 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about our services..."
              className="flex-1 text-sm bg-[#F5F5F0] text-[#0F0F0F] placeholder-[#78716C] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#F59E0B] border border-[#E7E5E4]"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-9 h-9 bg-[#F59E0B] text-[#0F0F0F] rounded-lg flex items-center justify-center hover:bg-[#D97706] disabled:opacity-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
