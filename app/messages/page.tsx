"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInboxItem } from "@/components/chat/ChatInboxItem";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInputArea } from "@/components/chat/ChatInputArea";
import { createClient } from "@/utils/supabase/client";

export default function MessagingPage() {
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<
    any | null
  >(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [loadingConvs, setLoadingConvs] = React.useState(true);
  const [loadingMsgs, setLoadingMsgs] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // ─── Fetch current user ───────────────────────────────────
  React.useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    init();
  }, []);

  // ─── Fetch conversations ──────────────────────────────────
  const fetchConversations = React.useCallback(async () => {
    if (!currentUserId) return;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        p1:profiles!conversations_participant_1_fkey(id, name, avatar_initials, role),
        p2:profiles!conversations_participant_2_fkey(id, name, avatar_initials, role)
      `,
      )
      .or(`participant_1.eq.${currentUserId},participant_2.eq.${currentUserId}`)
      .order("last_message_at", { ascending: false });

    if (error) console.error("Conversations error:", error);
    if (data) setConversations(data);
    setLoadingConvs(false);
  }, [currentUserId]);

  React.useEffect(() => {
    if (currentUserId) fetchConversations();
  }, [currentUserId, fetchConversations]);

  // ─── Realtime: conversations ──────────────────────────────
  React.useEffect(() => {
    if (!currentUserId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`conversations_${currentUserId}_${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          fetchConversations();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchConversations]);

  // ─── Fetch messages for active conversation ───────────────
  const fetchMessages = React.useCallback(
    async (conversationId: string) => {
      setLoadingMsgs(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) console.error("Messages error:", error);
      if (data) setMessages(data);
      setLoadingMsgs(false);

      // Mark messages as read
      if (currentUserId) {
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", conversationId)
          .eq("receiver_id", currentUserId)
          .eq("is_read", false);
      }
    },
    [currentUserId],
  );

  React.useEffect(() => {
    if (activeConversation) fetchMessages(activeConversation.id);
  }, [activeConversation, fetchMessages]);

  // ─── Realtime: messages ───────────────────────────────────
  React.useEffect(() => {
    if (!activeConversation) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`messages_${activeConversation.id}_${Date.now()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          // Mark as read if receiver
          if (payload.new.receiver_id === currentUserId) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", payload.new.id);
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation, currentUserId]);

  // ─── Auto scroll ──────────────────────────────────────────
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ─── Send message ─────────────────────────────────────────
  const handleSend = async (text: string) => {
    if (!text.trim() || !activeConversation || !currentUserId || sending)
      return;
    setSending(true);

    const supabase = createClient();
    const otherId =
      activeConversation.participant_1 === currentUserId
        ? activeConversation.participant_2
        : activeConversation.participant_1;

    // Insert message
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConversation.id,
      sender_id: currentUserId,
      receiver_id: otherId,
      content: text,
      is_read: false,
    });

    if (!error) {
      // Update conversation last message
      await supabase
        .from("conversations")
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", activeConversation.id);

      setInputValue("");
    }
    setSending(false);
  };

  // ─── Get other participant ────────────────────────────────
  const getOtherParticipant = (conv: any) => {
    if (!currentUserId) return null;
    return conv.participant_1 === currentUserId ? conv.p2 : conv.p1;
  };

  // ─── Format time ─────────────────────────────────────────
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatConvTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const otherParticipant = activeConversation
    ? getOtherParticipant(activeConversation)
    : null;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* ── Left: Inbox ────────────────────────────────── */}
        <div className="hidden md:flex flex-col w-[300px] shrink-0 border-r border-slate-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-slate-900">Messages</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {conversations.length} conversations
            </p>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingConvs ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 rounded-xl animate-pulse"
                />
              ))
            ) : conversations.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                <p className="text-2xl mb-2">💬</p>
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const unread = messages.filter(
                  (m) =>
                    m.conversation_id === conv.id &&
                    m.receiver_id === currentUserId &&
                    !m.is_read,
                ).length;
                return (
                  <ChatInboxItem
                    key={conv.id}
                    name={other?.name || "Unknown"}
                    lastMessage={conv.last_message || "Start a conversation"}
                    time={formatConvTime(conv.last_message_at)}
                    unreadCount={unread}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => setActiveConversation(conv)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Chat Window ──────────────────────────── */}
        <div className="flex-1 flex flex-col">
          {!activeConversation ? (
            // Empty state
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <p className="text-5xl mb-4">💬</p>
              <p className="font-semibold text-slate-600">
                Select a conversation
              </p>
              <p className="text-sm mt-1">
                Choose from your inbox to start messaging
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
                  {otherParticipant?.avatar_initials ||
                    otherParticipant?.name?.charAt(0) ||
                    "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {otherParticipant?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {otherParticipant?.role || "User"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-slate-50">
                {loadingMsgs ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    <p>No messages yet — say hello! 👋</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      content={msg.content}
                      timestamp={formatTime(msg.created_at)}
                      isOwn={msg.sender_id === currentUserId}
                      isRead={msg.is_read}
                    />
                  ))
                )}
                {isTyping && (
                  <MessageBubble
                    content=""
                    timestamp=""
                    isOwn={false}
                    isLoading
                  />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-slate-200">
                <ChatInputArea
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                  isLoading={sending}
                  placeholder="Type a message..."
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
