"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type ChatUser = { sender_id: string; sender_name: string; sender_type: string; latest: string; unread: number };
type Message = { id: string; sender_type: string; sender_id: string; sender_name: string; content: string; created_at: string; read_by_admin: boolean };

export default function BeskederPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setAdminId(user.id);

      const { data: allChats } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false });

      const byUser: Record<string, ChatUser> = {};
      for (const msg of allChats ?? []) {
        if (msg.sender_type === "admin") continue;
        const uid = msg.sender_id;
        if (!byUser[uid]) {
          byUser[uid] = { sender_id: uid, sender_name: msg.sender_name, sender_type: msg.sender_type, latest: msg.created_at, unread: 0 };
        }
        if (!msg.read_by_admin) byUser[uid].unread++;
      }
      setChatUsers(Object.values(byUser).sort((a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime()));
      setLoading(false);
    };
    init();
  }, []);

  const loadChat = async (senderId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`sender_id.eq.${senderId},and(sender_type.eq.admin,request_id.is.null)`)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
    await supabase.from("chat_messages").update({ read_by_admin: true }).eq("sender_id", senderId);
    setChatUsers(prev => prev.map(u => u.sender_id === senderId ? { ...u, unread: 0 } : u));
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const content = input.trim();
    setInput("");
    await supabase.from("chat_messages").insert({
      sender_type: "admin",
      sender_id: adminId,
      sender_name: "FindITconsultants.com Teamet",
      content,
      read_by_admin: true,
      read_by_user: false,
    });
    loadChat(selectedUser.sender_id);
  };

  const totalUnread = chatUsers.reduce((sum, u) => sum + u.unread, 0);

  if (loading) return (
    <div className="p-8 animate-pulse">
      <div className="h-6 bg-charcoal/10 rounded w-40 mb-6" />
      <div className="grid grid-cols-[240px_1fr] gap-4 h-96">
        <div className="bg-charcoal/10 rounded-2xl" />
        <div className="bg-charcoal/10 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="p-8 flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
      <div className="mb-5 flex-shrink-0">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Beskeder</h1>
        <p className="text-charcoal/45 text-sm">
          {chatUsers.length} samtale{chatUsers.length !== 1 ? "r" : ""}
          {totalUnread > 0 && <span className="ml-2 text-orange font-bold">· {totalUnread} ulæste</span>}
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* User list */}
        <div className="w-60 flex-shrink-0 bg-white rounded-2xl border border-[#ede9e3] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#f0ede8]">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">Samtaler</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatUsers.length === 0 && (
              <p className="text-charcoal/30 text-sm text-center py-10">Ingen beskeder endnu</p>
            )}
            {chatUsers.map(u => (
              <div
                key={u.sender_id}
                onClick={() => { setSelectedUser(u); loadChat(u.sender_id); }}
                className={`px-4 py-3.5 cursor-pointer border-b border-[#f8f6f3] transition-colors flex items-center gap-3 ${
                  selectedUser?.sender_id === u.sender_id
                    ? "bg-orange/10 border-l-2 border-l-orange"
                    : "hover:bg-[#fafaf8]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#2d2c2c] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                  {u.sender_name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-charcoal truncate">{u.sender_name}</div>
                  <div className="text-xs text-charcoal/40">{u.sender_type === "customer" ? "Kunde" : "Leverandør"}</div>
                </div>
                {u.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-orange text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {u.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {selectedUser ? (
          <div className="flex-1 bg-white rounded-2xl border border-[#ede9e3] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#2d2c2c] flex items-center justify-center text-sm font-black text-white">
                {selectedUser.sender_name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-charcoal">{selectedUser.sender_name}</div>
                <div className="text-xs text-charcoal/40">{selectedUser.sender_type === "customer" ? "Kunde" : "Leverandør"}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => {
                const isAdmin = msg.sender_type === "admin";
                return (
                  <div key={msg.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 overflow-hidden ${
                      isAdmin ? "bg-orange" : "bg-[#2d2c2c] text-white"
                    }`}>
                      {isAdmin
                        ? <img src="/logo-white.png" alt="FindITconsultants.com" className="w-full h-full object-contain p-1" />
                        : msg.sender_name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className={`max-w-[70%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isAdmin ? "bg-orange text-white rounded-tr-sm" : "bg-[#f8f6f3] text-charcoal rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-charcoal/35 px-1">
                        {new Date(msg.created_at).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-[#f0ede8] flex gap-3 flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Skriv svar til bruger…"
                className="flex-1 border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange transition-all bg-[#f8f6f3]"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-orange hover:bg-orange-dark text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border border-[#ede9e3] flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-charcoal/40 font-semibold">Vælg en samtale</p>
              <p className="text-charcoal/25 text-sm mt-1">Klik på en bruger til venstre</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
