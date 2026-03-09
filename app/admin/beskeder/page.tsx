"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type ChatUser = {
  sender_id: string;
  sender_name: string;
  sender_type: string;
  latest: string;
  unread: number;
};

type RequestDetails = {
  description: string;
  reference_number: string | null;
};

type Message = {
  id: string;
  sender_type: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  request_id: string | null;
  recipient_id: string | null;
  read_by_admin: boolean;
};

export default function BeskederPage() {
  const [requestGroups, setRequestGroups] = useState<{ request_id: string; details: RequestDetails; users: ChatUser[] }[]>([]);
  const [ungroupedUsers, setUngroupedUsers] = useState<ChatUser[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [userRequestMap, setUserRequestMap] = useState<Record<string, string[]>>({});
  const [requestDetailsMap, setRequestDetailsMap] = useState<Record<string, RequestDetails>>({});
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null); // null = Generel
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const selectedUserRef = useRef<ChatUser | null>(null);
  const selectedThreadRef = useRef<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setAdminId(user.id);

      // 1. Hent alle chat-beskeder og byg brugerliste
      const { data: allChats } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false });

      const byUser: Record<string, ChatUser> = {};
      for (const msg of allChats ?? []) {
        if (msg.sender_type === "admin") continue;
        const uid = msg.sender_id;
        if (!byUser[uid]) {
          byUser[uid] = {
            sender_id: uid,
            sender_name: msg.sender_name,
            sender_type: msg.sender_type,
            latest: msg.created_at,
            unread: 0,
          };
        }
        if (!msg.read_by_admin) byUser[uid].unread++;
      }
      const chatUserList = Object.values(byUser).sort(
        (a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime()
      );

      // 2. Find kunde- og leverandør-IDs
      const customerIds = chatUserList.filter(u => u.sender_type === "customer").map(u => u.sender_id);
      const supplierIds = chatUserList.filter(u => u.sender_type === "supplier").map(u => u.sender_id);

      // 3. Hent kunde-emails for at matche mod requests
      const { data: customerData } = customerIds.length > 0
        ? await supabase.from("customers").select("id, email").in("id", customerIds)
        : { data: [] };

      const customerEmailMap: Record<string, string> = {};
      for (const c of customerData ?? []) customerEmailMap[c.id] = c.email;

      // 4. Hent godkendte requests for kunderne
      const customerEmails = Object.values(customerEmailMap).filter(Boolean);
      const { data: customerRequests } = customerEmails.length > 0
        ? await supabase
            .from("requests")
            .select("id, description, reference_number, email")
            .in("email", customerEmails)
            .eq("admin_status", "accepted")
        : { data: [] };

      // 5. Hent request_suppliers for leverandørerne
      const { data: rsData } = supplierIds.length > 0
        ? await supabase.from("request_suppliers").select("request_id, supplier_id").in("supplier_id", supplierIds)
        : { data: [] };

      // 6. Hent request-detaljer for leverandørernes opgaver
      const supplierRequestIds = [...new Set((rsData ?? []).map(rs => rs.request_id))];
      const { data: supplierRequests } = supplierRequestIds.length > 0
        ? await supabase.from("requests").select("id, description, reference_number").in("id", supplierRequestIds)
        : { data: [] };

      // 7. Byg request-detaljer-map
      const detailsMap: Record<string, RequestDetails> = {};
      for (const r of [...(customerRequests ?? []), ...(supplierRequests ?? [])]) {
        detailsMap[r.id] = { description: r.description, reference_number: r.reference_number ?? null };
      }

      // 8. Map bruger → hvilke requests de er tilknyttet
      const reqMap: Record<string, string[]> = {};
      for (const r of customerRequests ?? []) {
        const cId = Object.entries(customerEmailMap).find(([, email]) => email === r.email)?.[0];
        if (cId) {
          if (!reqMap[cId]) reqMap[cId] = [];
          reqMap[cId].push(r.id);
        }
      }
      for (const rs of rsData ?? []) {
        if (!reqMap[rs.supplier_id]) reqMap[rs.supplier_id] = [];
        reqMap[rs.supplier_id].push(rs.request_id);
      }

      // 9. Byg gruppestruktur
      const groupMap: Record<string, { request_id: string; details: RequestDetails; users: ChatUser[] }> = {};
      const groupedIds = new Set<string>();

      for (const u of chatUserList) {
        const rids = reqMap[u.sender_id] ?? [];
        for (const rid of rids) {
          if (!groupMap[rid]) {
            groupMap[rid] = { request_id: rid, details: detailsMap[rid] ?? { description: "Ukendt opgave", reference_number: null }, users: [] };
          }
          if (!groupMap[rid].users.find(x => x.sender_id === u.sender_id)) {
            groupMap[rid].users.push(u);
          }
          groupedIds.add(u.sender_id);
        }
      }

      setRequestGroups(Object.values(groupMap));
      setUngroupedUsers(chatUserList.filter(u => !groupedIds.has(u.sender_id)));
      setChatUsers(chatUserList);
      setUserRequestMap(reqMap);
      setRequestDetailsMap(detailsMap);
      setLoading(false);
    };
    init();
  }, []);

  // Hold refs synkroniserede med state (undgår stale closures i Realtime-handler)
  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);
  useEffect(() => { selectedThreadRef.current = selectedThread; }, [selectedThread]);

  // Real-time subscription — lytter på ALLE nye chat-beskeder
  useEffect(() => {
    const channel = supabase
      .channel("admin-beskeder-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as Message;
          const currentUser = selectedUserRef.current;
          const currentThread = selectedThreadRef.current;

          // Hvem er beskeden fra/til (bruger-siden)
          const msgUserId = msg.sender_type === "admin"
            ? msg.recipient_id
            : msg.sender_id;

          // Opdater sidebar for ikke-admin beskeder (nye indkommende fra brugere)
          if (msg.sender_type !== "admin" && msgUserId) {
            const isCurrentConv = currentUser?.sender_id === msgUserId;
            const updateUser = (u: ChatUser): ChatUser => {
              if (u.sender_id !== msgUserId) return u;
              return {
                ...u,
                latest: msg.created_at,
                unread: isCurrentConv ? u.unread : u.unread + 1,
              };
            };
            setRequestGroups(prev => prev.map(g => ({ ...g, users: g.users.map(updateUser) })));
            setUngroupedUsers(prev => prev.map(updateUser));
            setChatUsers(prev => {
              const updated = prev.map(updateUser);
              return updated.sort((a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime());
            });
          }

          // Append besked i chatvinduet hvis den hører til den aktuelle samtale
          if (currentUser) {
            const belongsToConv =
              msg.sender_id === currentUser.sender_id ||
              msg.recipient_id === currentUser.sender_id;
            const threadMatches =
              (currentThread === null && msg.request_id === null) ||
              (currentThread !== null && msg.request_id === currentThread);

            if (belongsToConv && threadMatches) {
              setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev; // undgå dubletter
                return [...prev, msg];
              });
              setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []); // Kun én gang — handler bruger refs i stedet for state

  const loadChat = async (senderId: string, threadId: string | null) => {
    let query = supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (threadId) {
      // Forespørgselstråd: beskeder fra bruger + admin-svar med samme request_id
      query = query.or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`).eq("request_id", threadId);
    } else {
      // Generel tråd: beskeder med request_id = null
      query = query.or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`).is("request_id", null);
    }

    const { data } = await query;
    setMessages(data ?? []);
    await supabase.from("chat_messages").update({ read_by_admin: true }).eq("sender_id", senderId);
    // Opdater ulæste i alle lister
    const markRead = (u: ChatUser) => u.sender_id === senderId ? { ...u, unread: 0 } : u;
    setRequestGroups(prev => prev.map(g => ({ ...g, users: g.users.map(markRead) })));
    setUngroupedUsers(prev => prev.map(markRead));
    setChatUsers(prev => prev.map(markRead));
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const selectUser = (u: ChatUser) => {
    setSelectedUser(u);
    setSelectedThread(null);
    loadChat(u.sender_id, null);
  };

  const selectThread = (threadId: string | null) => {
    if (!selectedUser) return;
    setSelectedThread(threadId);
    loadChat(selectedUser.sender_id, threadId);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const content = input.trim();
    setInput("");
    await supabase.from("chat_messages").insert({
      sender_type: "admin",
      sender_id: adminId,
      sender_name: "FindITconsultants.com Teamet",
      recipient_id: selectedUser.sender_id,
      request_id: selectedThread,
      content,
      read_by_admin: true,
      read_by_user: false,
    });
    // Realtime-subscriptionen håndterer automatisk at vise den nye besked
  };

  const handleDeleteConversation = async (senderId: string, senderName: string) => {
    if (!confirm(`Er du sikker på at du vil slette hele samtalen med ${senderName}?\n\nDenne handling kan ikke fortrydes.`)) return;
    const res = await fetch("/api/delete-conversation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: senderId }) });
    if (!res.ok) { alert("Sletning fejlede — prøv igen"); return; }
    const remove = (list: ChatUser[]) => list.filter(u => u.sender_id !== senderId);
    setRequestGroups(prev => prev.map(g => ({ ...g, users: remove(g.users) })).filter(g => g.users.length > 0));
    setUngroupedUsers(prev => remove(prev));
    setChatUsers(prev => remove(prev));
    setSelectedUser(null);
    setMessages([]);
  };

  const totalUnread = chatUsers.reduce((sum, u) => sum + u.unread, 0);
  const totalConversations = chatUsers.length;

  const UserRow = ({ u }: { u: ChatUser }) => (
    <div
      onClick={() => selectUser(u)}
      className={`px-4 py-3 cursor-pointer border-b border-[#f8f6f3] transition-colors flex items-center gap-3 ${
        selectedUser?.sender_id === u.sender_id
          ? "bg-orange/10 border-l-2 border-l-orange"
          : "hover:bg-[#fafaf8]"
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-[#2d2c2c] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
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
  );

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
          {totalConversations} samtale{totalConversations !== 1 ? "r" : ""}
          {totalUnread > 0 && <span className="ml-2 text-orange font-bold">· {totalUnread} ulæste</span>}
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Samtaleliste — grupperet per opgave */}
        <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-[#ede9e3] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#f0ede8]">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">Samtaler</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {totalConversations === 0 && (
              <p className="text-charcoal/30 text-sm text-center py-10">Ingen beskeder endnu</p>
            )}

            {/* Grupperet per opgave */}
            {requestGroups.map(group => (
              <div key={group.request_id}>
                <div className="px-4 py-2 bg-[#f8f6f3] border-b border-[#f0ede8]">
                  <p className="text-[9px] font-extrabold tracking-widest uppercase text-charcoal/35">Opgave</p>
                  <p className="text-xs font-bold text-charcoal/70 line-clamp-1 mt-0.5">
                    {group.details.reference_number
                      ? `${group.details.reference_number} — ${group.details.description}`
                      : group.details.description}
                  </p>
                </div>
                {group.users.map(u => <UserRow key={u.sender_id} u={u} />)}
              </div>
            ))}

            {/* Øvrige samtaler (ikke tilknyttet en opgave) */}
            {ungroupedUsers.length > 0 && (
              <div>
                {requestGroups.length > 0 && (
                  <div className="px-4 py-2 bg-[#f8f6f3] border-b border-[#f0ede8]">
                    <p className="text-[9px] font-extrabold tracking-widest uppercase text-charcoal/35">Øvrige samtaler</p>
                  </div>
                )}
                {ungroupedUsers.map(u => <UserRow key={u.sender_id} u={u} />)}
              </div>
            )}
          </div>
        </div>

        {/* Chat-vindue */}
        {selectedUser ? (
          <div className="flex-1 bg-white rounded-2xl border border-[#ede9e3] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#2d2c2c] flex items-center justify-center text-sm font-black text-white">
                {selectedUser.sender_name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-bold text-charcoal">{selectedUser.sender_name}</div>
                <div className="text-xs text-charcoal/40">{selectedUser.sender_type === "customer" ? "Kunde" : "Leverandør"}</div>
              </div>
              <button
                onClick={() => handleDeleteConversation(selectedUser.sender_id, selectedUser.sender_name)}
                className="text-xs bg-red-50 text-red-400 font-bold px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
              >
                Slet samtale
              </button>
            </div>

            {/* Tråd-faner */}
            <div className="flex gap-1 px-5 pt-3 pb-0 border-b border-[#f0ede8] flex-shrink-0 flex-wrap">
              <button
                onClick={() => selectThread(null)}
                className={`text-xs font-bold px-3 py-1.5 rounded-t-lg border-b-2 transition-all -mb-px ${
                  selectedThread === null
                    ? "border-orange text-orange"
                    : "border-transparent text-charcoal/40 hover:text-charcoal"
                }`}
              >
                💬 Generel
              </button>
              {(userRequestMap[selectedUser.sender_id] ?? []).map(rid => {
                const details = requestDetailsMap[rid];
                return (
                  <button
                    key={rid}
                    onClick={() => selectThread(rid)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-t-lg border-b-2 transition-all -mb-px ${
                      selectedThread === rid
                        ? "border-orange text-orange"
                        : "border-transparent text-charcoal/40 hover:text-charcoal"
                    }`}
                  >
                    📋 {details?.reference_number || rid.slice(0, 8)}
                  </button>
                );
              })}
            </div>

            {/* Beskeder */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-charcoal/40 text-sm font-semibold">Ingen beskeder i denne tråd</p>
                </div>
              )}
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
                placeholder={selectedThread
                  ? `Svar i tråd ${requestDetailsMap[selectedThread]?.reference_number || selectedThread.slice(0, 8)}…`
                  : "Skriv svar i Generel tråd…"}
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
