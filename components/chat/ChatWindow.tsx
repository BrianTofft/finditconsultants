"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  created_at: string;
  sender_type: string;
  sender_id: string;
  sender_name: string;
  content: string;
}

interface Props {
  requestId?: string;
  userId: string;
  userType: "customer" | "supplier";
  userName: string;
  title?: string;
  subtitle?: string;
}

export default function ChatWindow({ requestId, userId, userType, userName, title, subtitle }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      let query = supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (requestId) {
        query = query.eq("request_id", requestId);
      } else {
        query = query.eq("sender_id", userId).is("request_id", null);
      }

      const { data } = await query;
      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${requestId || userId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
      }, (payload) => {
        const msg = payload.new as Message;
        // Vis kun beskeder der er relevante for denne chat
        if (requestId && msg.request_id !== requestId) return;
        if (!requestId && msg.sender_id !== userId && msg.sender_type !== "admin") return;
        setMessages(prev => [...prev, msg]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    await supabase.from("chat_messages").insert({
      request_id: requestId || null,
      sender_type: userType,
      sender_id: userId,
      sender_name: userName,
      content,
      read_by_admin: false,
      read_by_user: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ede9e3] flex flex-col overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#2d2c2c] flex items-center justify-center text-sm font-black text-white">FI</div>
        <div>
          <div className="font-bold text-charcoal text-sm">{title || "FindIT-teamet"}</div>
          {subtitle && <div className="text-xs text-charcoal/40">{subtitle}</div>}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-xs text-charcoal/40">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading && (
          <div className="text-center text-charcoal/30 text-sm py-8">Indlæser beskeder…</div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <div className="text-charcoal/40 text-sm font-semibold">Ingen beskeder endnu</div>
            <div className="text-charcoal/30 text-xs mt-1">Skriv til FindIT-teamet herunder</div>
          </div>
        )}
        {messages.map(msg => {
          const isOwn = msg.sender_id === userId;
          const initials = msg.sender_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
          const time = new Date(msg.created_at).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                isOwn
                  ? "bg-gradient-to-br from-orange to-orange-dark text-white"
                  : "bg-[#2d2c2c] text-white"
              }`}>
                {isOwn ? initials : "FI"}
              </div>
              <div className={`max-w-[70%] flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isOwn
                    ? "bg-orange text-white rounded-tr-sm"
                    : "bg-[#f8f6f3] text-charcoal rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-charcoal/35 px-1">
                  {isOwn ? "Du" : msg.sender_name} · {time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#f0ede8] flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
          placeholder="Skriv en besked…"
          className="flex-1 border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange transition-all bg-[#f8f6f3]"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="bg-orange hover:bg-orange-dark text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
