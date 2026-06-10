"use client";
// app/messsages/page.tsx
import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInboxItem } from "@/components/chat/ChatInboxItem";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInputArea } from "@/components/chat/ChatInputArea";
import { PatientInfoPanel } from "@/components/chat/PatientInfoPanel";
import {
  DateSeparator,
  getSeparatorIndices,
} from "@/components/chat/DateSeperator";
import { ConversationStatusBadge } from "@/components/chat/ConversationalStatusBadge";
import { MessageCategorySelector } from "@/components/chat/MessageCategoryTag";
import type { MessageCategory } from "@/components/chat/MessageCategoryTag";
import { createClient } from "@/utils/supabase/client";

export default function MessagingPage() {
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = React.useState<any>(null);
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
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<MessageCategory | null>(null);
  const [otherProfile, setOtherProfile] = React.useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [isCalling, setIsCalling] = React.useState(false);
  const [incomingCallUrl, setIncomingCallUrl] = React.useState<string | null>(
    null,
  );
  // ─── Init ─────────────────────────────────────────────────
  React.useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profile) setCurrentProfile(profile);
      }
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
        p1:profiles!conversations_participant_1_fkey(id, name, avatar_initials, role, username , is_verified),
        p2:profiles!conversations_participant_2_fkey(id, name, avatar_initials, role, username , is_verified)
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
        () => fetchConversations(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchConversations]);

  // ─── Fetch messages ───────────────────────────────────────
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
          setMessages((prev) => {
            // Avoid duplicate if optimistic update already added it
            const exists = prev.some(
              (m) =>
                m.id === payload.new.id ||
                (m.id?.toString().startsWith("temp_") &&
                  m.content === payload.new.content &&
                  m.sender_id === payload.new.sender_id),
            );
            if (exists)
              return prev.map((m) =>
                m.id?.toString().startsWith("temp_") &&
                m.content === payload.new.content
                  ? payload.new
                  : m,
              );
            return [...prev, payload.new];
          });
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
  // ─── Realtime: Global Incoming Calls ──────────────────────
  React.useEffect(() => {
    if (!currentUserId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`global_calls_${currentUserId}_${Date.now()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          // Only listen for messages sent TO this specific user
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          // If the message is a video call invitation, trigger the popup!
          if (payload.new.file_type === "call_invite") {
            setIncomingCallUrl(payload.new.file_url);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // ─── Fetch other profile when conversation changes ────────
  React.useEffect(() => {
    if (!activeConversation || !currentUserId) return;
    const other = getOtherParticipant(activeConversation);
    if (!other?.id) return;

    const fetchOtherProfile = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", other.id)
        .single();

      if (data) {
        if (data.cv_url && !data.cv_url.startsWith("http")) {
          // THE FIX: Construct the full path using the user's ID
          // If cv_url already has a slash, use it. Otherwise, prepend the folder ID!
          const filePath = data.cv_url.includes("/")
            ? data.cv_url
            : `${other.id}/${data.cv_url}`;

          const { data: urlData, error } = await supabase.storage
            .from("documents")
            .createSignedUrl(filePath, 60);

          if (error) {
            console.error("Supabase Storage Error:", error.message);
            data.cv_url = "#";
          } else if (urlData) {
            data.cv_url = urlData.signedUrl; // Swap the filename with the secure link
          }
        }
        setOtherProfile(data);
      }
    };
    fetchOtherProfile();
  }, [activeConversation, currentUserId]);
  // ─── Auto scroll ──────────────────────────────────────────
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ─── Send message ─────────────────────────────────────────
  // ─── Send message (Updated for File Uploads) ────────────────
  const handleSend = async (text: string, file?: File | null) => {
    // Prevent sending if BOTH text and file are empty
    if (
      (!text.trim() && !file) ||
      !activeConversation ||
      !currentUserId ||
      sending
    )
      return;

    setSending(true);

    const supabase = createClient();
    const otherId =
      activeConversation.participant_1 === currentUserId
        ? activeConversation.participant_2
        : activeConversation.participant_1;

    let finalFileUrl = null;
    let finalFileType = "text";

    // 1. Handle File Upload if a file exists
    if (file) {
      // Create a unique filename: conversationID/timestamp.ext
      const fileExt = file.name.split(".").pop();
      const filePath = `${activeConversation.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        setSending(false);
        alert("Failed to upload file. Please try again.");
        return; // Stop the message from sending if upload fails
      }

      finalFileUrl = filePath; // Save the path so we can generate secure links later

      // Determine the type for the UI
      if (file.type.startsWith("image/")) {
        finalFileType = "image";
      } else if (file.type === "application/pdf") {
        finalFileType = "pdf";
      } else {
        finalFileType = "document";
      }
    }

    // Default text if they only send a file
    const finalContent = text.trim() ? text : `Sent a ${finalFileType}`;

    // Optimistic update for UI (so it feels instant)
    const tempId = `temp_${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversation_id: activeConversation.id,
        sender_id: currentUserId,
        receiver_id: otherId,
        content: finalContent,
        is_read: false,
        created_at: new Date().toISOString(),
        file_url: finalFileUrl,
        file_type: finalFileType,
      },
    ]);
    setInputValue("");

    // 2. Insert into the database
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConversation.id,
      sender_id: currentUserId,
      receiver_id: otherId,
      content: finalContent,
      is_read: false,
      file_url: finalFileUrl,
      file_type: finalFileType,
    });

    if (!error) {
      await supabase
        .from("conversations")
        .update({
          last_message:
            finalFileType === "text"
              ? finalContent
              : `📎 ${finalFileType} attached`,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", activeConversation.id);
    } else {
      console.error("Database Error:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }

    setSending(false);
  };
  // ─── Start Video Call ───────────────────────────────────────
  // ─── Start Video Call (Jitsi Free Bypass) ───────────────────
  // ─── Start Video Call (Jitsi Free Bypass) ───────────────────
  const handleStartCall = async () => {
    if (!activeConversation || !currentUserId || isCalling) return;
    setIsCalling(true);

    try {
      // 1. Generate a secure, unique Jitsi room URL locally (No API needed!)
      // 1. Generate the URL with configuration to start automatically
      const uniqueRoomName = `Medit-Consult-${activeConversation.id.replace(/-/g, "")}-${Date.now()}`;
      const jitsiUrl = `https://meet.jit.si/${uniqueRoomName}#config.prejoinPageEnabled=false&config.startAudioMuted=false&config.startVideoMuted=false`;
      const supabase = createClient();
      const otherId =
        activeConversation.participant_1 === currentUserId
          ? activeConversation.participant_2
          : activeConversation.participant_1;

      // 2. Insert the invitation directly into the chat
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConversation.id,
        sender_id: currentUserId,
        receiver_id: otherId,
        content: "📞 Video call started",
        file_url: jitsiUrl, // Use the free Jitsi link
        file_type: "call_invite",
        is_read: false,
      });

      if (error) {
        console.error("Database error inserting call:", error);
        alert("Failed to send call invitation.");
        return;
      }

      // 3. Update the conversation preview
      await supabase
        .from("conversations")
        .update({
          last_message: "📞 Video call invitation",
          last_message_at: new Date().toISOString(),
        })
        .eq("id", activeConversation.id);
    } catch (error) {
      console.error("Call error:", error);
      alert("Something went wrong starting the call.");
    } finally {
      setIsCalling(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────
  const getOtherParticipant = (conv: any) => {
    if (!currentUserId) return null;
    return conv.participant_1 === currentUserId ? conv.p2 : conv.p1;
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Build PatientInfo for panel
  // Build Profile Info for panel (Handles both Patient and Doctor)
  const profileDataForPanel = otherProfile
    ? {
        role: otherProfile.role,
        name: otherProfile.name || "Unknown",
        avatarInitials: otherProfile.avatar_initials,
        gender: otherProfile.gender,

        // PRIVACY ENFORCEMENT:
        // phone and aadhaar_url are strictly EXCLUDED from this object.

        // --- PATIENT SPECIFIC DATA ---
        ...(otherProfile.role === "patient" && {
          age: otherProfile.date_of_birth
            ? Math.floor(
                (Date.now() - new Date(otherProfile.date_of_birth).getTime()) /
                  (365.25 * 24 * 60 * 60 * 1000),
              )
            : undefined,
          // Only pass sensitive medical data if see_doctor_mode is true
          bloodGroup: otherProfile.see_doctor_mode
            ? otherProfile.blood_group
            : "Hidden",
          allergies:
            otherProfile.see_doctor_mode && otherProfile.allergies
              ? otherProfile.allergies.split(",").map((a: string) => a.trim())
              : [],
          conditions:
            otherProfile.see_doctor_mode && otherProfile.medical_conditions
              ? otherProfile.medical_conditions
                  .split(",")
                  .map((c: string) => c.trim())
              : [],
          isMedicalDataHidden: !otherProfile.see_doctor_mode, // Flag for your UI to show a lock icon
        }),

        // --- DOCTOR SPECIFIC DATA ---
        ...(otherProfile.role === "doctor" && {
          specialization: otherProfile.specialization,
          experience: otherProfile.experience_years
            ? `${otherProfile.experience_years} Years`
            : undefined,
          hospital: otherProfile.hospital,
          consultingFee: otherProfile.consulting_fee,
          cvUrl: otherProfile.cv_url, // Resume is public/allowed
        }),
      }
    : null;

  // Date separators
  const separatorIndices = getSeparatorIndices(
    messages.map((m) => m.created_at),
  );

  // Unread count per conversation
  const getUnreadCount = (convId: string) =>
    messages.filter(
      (m) =>
        m.conversation_id === convId &&
        m.receiver_id === currentUserId &&
        !m.is_read,
    ).length;

  const isDoctor = currentProfile?.role === "doctor";

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
        {/* ── Left: Inbox ──────────────────────────────────── */}
        <div
          className={`${activeConversation ? "hidden md:flex" : "flex"} flex-col w-full md:w-[300px] shrink-0 border-r border-slate-200`}
        >
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-slate-900">Messages</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </p>
          </div>

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
                <p className="text-xs mt-1">
                  Go to Doctors and click 💬 Message
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                return (
                  <ChatInboxItem
                    key={conv.id}
                    name={other?.name || "Unknown"}
                    lastMessage={conv.last_message || "Start a conversation"}
                    time={formatConvTime(conv.last_message_at)}
                    unreadCount={getUnreadCount(conv.id)}
                    isActive={activeConversation?.id === conv.id}
                    isVerified={other?.is_verified}
                    onClick={() => {
                      setActiveConversation(conv);
                      setIsPanelOpen(false);
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* ── Center: Chat Window ───────────────────────────── */}
        {/* ── Center: Chat Window ───────────────────────────── */}
        <div
          className={`${activeConversation ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0`}
        >
          {!activeConversation ? (
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
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-1 -ml-1 text-slate-500 hover:text-teal-600 shrink-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 text-sm">
                  {otherParticipant?.avatar_initials ||
                    otherParticipant?.name?.charAt(0) ||
                    "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {otherParticipant?.name || "Unknown"}
                    </h3>
                    <ConversationStatusBadge
                      status="active"
                      variant="compact"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {otherParticipant?.username
                      ? `@${otherParticipant.username} • `
                      : ""}
                    <span className="capitalize">
                      {otherParticipant?.role || "User"}
                    </span>
                  </p>
                </div>

                {/* Info panel toggle — only show for doctor viewing patient */}
                {/* Info panel toggle — show for EVERYONE */}
                {/* ── Chat Actions (Call & Info) ── */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleStartCall}
                    disabled={isCalling}
                    className="flex items-center gap-1.5 p-2 sm:px-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <span>📹</span>
                    <span className="hidden sm:inline">
                      {isCalling ? "Connecting..." : "Video Call"}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className={`hidden lg:flex p-2 px-3 rounded-xl text-sm font-semibold transition-colors ${
                      isPanelOpen
                        ? "bg-teal-100 text-teal-700"
                        : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  >
                    {otherParticipant?.role === "patient"
                      ? "🏥 Patient Info"
                      : "👨‍⚕️ Doctor Profile"}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 bg-slate-50">
                {loadingMsgs ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    <p className="text-3xl mb-2">👋</p>
                    <p>No messages yet — say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <React.Fragment key={msg.id}>
                      {separatorIndices.has(i) && (
                        <DateSeparator date={msg.created_at} />
                      )}
                      <MessageBubble
                        content={msg.content}
                        timestamp={formatTime(msg.created_at)}
                        isOwn={msg.sender_id === currentUserId}
                        isRead={msg.is_read}
                        fileUrl={msg.file_url}
                        fileType={msg.file_type}
                      />
                    </React.Fragment>
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

              {/* Input with category selector */}
              <div className="bg-white border-t border-slate-200">
                {/* Category selector row */}
                <div className="px-4 pt-3 flex items-center gap-2">
                  <MessageCategorySelector
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  />
                  {selectedCategory && (
                    <span className="text-xs text-slate-400">
                      Category will be tagged with your message
                    </span>
                  )}
                </div>
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

        {/* ── Right: Patient Info Panel ─────────────────────── */}
        <div className="relative">
          <PatientInfoPanel
            patient={profileDataForPanel}
            isOpen={isPanelOpen}
            onToggle={() => setIsPanelOpen(!isPanelOpen)}
          />
        </div>
      </div>
      {/* ── Incoming Call Modal Overlay ── */}
      {incomingCallUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              {/* Pulsing animation ring */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-ping opacity-20"></div>
              <p className="text-4xl relative z-10">📹</p>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Incoming Video Call
            </h3>
            <p className="text-sm text-slate-500 mb-8 mt-2">
              The doctor is ready and waiting for you in the consultation room.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIncomingCallUrl(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Decline
              </button>
              <a
                href={incomingCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIncomingCallUrl(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
              >
                Accept Call
              </a>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
