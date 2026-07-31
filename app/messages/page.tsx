"use client";

// app/messages/page.tsx
// Production-Grade Clinical E2EE Direct Messaging Workspace with Realtime Attachment Storage & Receipts

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";
import { getLocalPrivateKey, generateE2EEKeyPair } from "@/utils/crypto";
import {
  Bot,
  Stethoscope,
  MessageSquare,
  FileText,
  Download,
  Paperclip,
  Check,
  CheckCheck,
  AlertCircle,
  X,
  Search,
} from "lucide-react";

interface MessageConversation {
  id: string;
  participant_1: string;
  participant_2: string;
  p1?: { id: string; name: string; avatar_initials?: string; username?: string; role?: string; is_verified?: boolean };
  p2?: { id: string; name: string; avatar_initials?: string; username?: string; role?: string; is_verified?: boolean };
  last_message?: string;
  last_message_at?: string;
  is_pinned?: boolean;
  unread_count?: number;
}

interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id?: string;
  content: string;
  is_read?: boolean;
  created_at: string;
  delivered_at?: string | null;
  read_at?: string | null;
  file_url?: string | null; // stores the raw Storage PATH, not a signed URL
  file_type?: string | null; // 'text' | 'image' | 'pdf'
  file_name?: string | null;
  file_size?: number | null;
  reply_to_id?: string | null;
  is_uploading?: boolean;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return "PDF Document";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Resolves a Storage PATH (stored in messages.file_url) into a temporary
// signed URL. Bucket is private, so getPublicUrl() would 403 — must sign.
async function resolveSignedUrl(filePath?: string | null): Promise<string> {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://") || filePath.startsWith("data:")) {
    return filePath;
  }
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("chat-files")
    .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
  if (error || !data) {
    console.error("[Signed URL Error]", error?.message);
    return "";
  }
  return data.signedUrl;
}

function formatDateDivider(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatMessageTime(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessagesPage() {
  const user = useStore((state) => state.user);
  const isDoctor = user?.role === "doctor";

  const [conversations, setConversations] = React.useState<MessageConversation[]>([]);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // Maps a Storage file path -> resolved signed URL, refreshed on load
  const [resolvedUrls, setResolvedUrls] = React.useState<Record<string, string>>({});

  // Lightbox Modal for Image Preview
  const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null);

  // Reply & Drawer State
  const [replyToMessage, setReplyToMessage] = React.useState<MessageItem | null>(null);
  const [showPatientDrawer, setShowPatientDrawer] = React.useState(false);

  // AI Reply Draft Modal State
  const [showAIDraftModal, setShowAIDraftModal] = React.useState(false);
  const [aiDraftPrompt, setAiDraftPrompt] = React.useState("");
  const [aiDraftResult, setAiDraftResult] = React.useState("");
  const [generatingDraft, setGeneratingDraft] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch initial conversations list
  React.useEffect(() => {
    const initData = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        let key = await getLocalPrivateKey();
        if (!key) {
          const pair = await generateE2EEKeyPair();
          key = pair.privateKey;
        }

        let { data: convData, error: convErr } = await supabase
          .from("conversations")
          .select("*, p1:profiles!conversations_participant_1_fkey(id, name, role), p2:profiles!conversations_participant_2_fkey(id, name, role)")
          .or(`participant_1.eq.${authUser.id},participant_2.eq.${authUser.id}`)
          .order("last_message_at", { ascending: false });

        if (convErr) {
          console.warn("Conversations query fallback:", convErr.message);
          const fallback = await supabase
            .from("conversations")
            .select("*")
            .or(`participant_1.eq.${authUser.id},participant_2.eq.${authUser.id}`)
            .order("last_message_at", { ascending: false });
          convData = fallback.data;
        }

        if (!convData || convData.length === 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name, role, specialization")
            .neq("id", authUser.id)
            .limit(5);

          if (profiles && profiles.length > 0) {
            convData = profiles.map((p) => ({
              id: `c-${p.id}`,
              participant_1: authUser.id,
              participant_2: p.id,
              p1: { id: authUser.id, name: authUser.user_metadata?.name || "Me" },
              p2: p,
              last_message: `Encrypted consultation channel with ${p.name}`,
              last_message_at: new Date().toISOString(),
            }));
          }
        }

        if (convData && convData.length > 0) {
          const mapped: MessageConversation[] = convData.map((c: any) => ({
            id: c.id,
            participant_1: c.participant_1,
            participant_2: c.participant_2,
            p1: c.p1 || { id: c.participant_1, name: "Participant 1" },
            p2: c.p2 || { id: c.participant_2, name: "Dr. Medical Specialist" },
            last_message: c.last_message || "Started encrypted conversation",
            last_message_at: c.last_message_at || c.updated_at || new Date().toISOString(),
          }));
          setConversations(mapped);
          setActiveConvId(mapped[0].id);
        }
      }
      setLoading(false);
    };

    initData();
  }, []);

  // Active Conversation Info
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activePartner = activeConv
    ? activeConv.participant_1 === user?.id
      ? activeConv.p2
      : activeConv.p1
    : null;

  // Fetch messages when active conversation changes
  const fetchMessages = React.useCallback(async () => {
    if (!activeConvId) return;
    setFetchError(null);
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const currConv = conversations.find((c) => c.id === activeConvId);
    const partnerId = currConv
      ? currConv.participant_1 === authUser?.id
        ? currConv.participant_2
        : currConv.participant_1
      : null;

    let query = supabase.from("messages").select("*");

    if (partnerId && authUser) {
      query = query.or(
        `conversation_id.eq.${activeConvId},and(sender_id.eq.${authUser.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${authUser.id})`
      );
    } else {
      query = query.eq("conversation_id", activeConvId);
    }

    const { data: msgData, error: msgErr } = await query.order("created_at", { ascending: true });

    if (msgErr) {
      console.error("[Messages Fetch Error]", msgErr);
      setFetchError(`Database Access Error (${msgErr.code}): ${msgErr.message}`);
      setMessages([]);
    } else if (msgData) {
      setMessages(msgData as MessageItem[]);
      scrollToBottom();

      // Mark unread messages as READ when recipient opens chat
      if (authUser) {
        const unreadMsgIds = msgData
          .filter((m) => m.receiver_id === authUser.id && (!m.is_read || !m.read_at))
          .map((m) => m.id);

        if (unreadMsgIds.length > 0) {
          const nowIso = new Date().toISOString();
          await supabase
            .from("messages")
            .update({ is_read: true, read_at: nowIso })
            .in("id", unreadMsgIds);
        }
      }
    } else {
      setMessages([]);
    }
  }, [activeConvId, conversations, scrollToBottom]);

  // Realtime subscription for incoming messages and read receipts
  React.useEffect(() => {
    fetchMessages();
    if (!activeConvId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`chat:${activeConvId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMsg = payload.new as MessageItem;
            if (
              newMsg.conversation_id === activeConvId ||
              (newMsg.sender_id === user?.id && newMsg.receiver_id === activePartner?.id) ||
              (newMsg.receiver_id === user?.id && newMsg.sender_id === activePartner?.id)
            ) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              scrollToBottom();

              // Mark as delivered / read automatically if user is recipient
              if (user && newMsg.receiver_id === user.id) {
                const nowIso = new Date().toISOString();
                await supabase
                  .from("messages")
                  .update({ delivered_at: nowIso, is_read: true, read_at: nowIso })
                  .eq("id", newMsg.id);
              }
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedMsg = payload.new as MessageItem;
            setMessages((prev) =>
              prev.map((m) => (m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId, fetchMessages, user, activePartner, scrollToBottom]);

  // Resolve signed URLs for any attachment messages whose path we haven't
  // signed yet. Re-runs whenever the message list changes (e.g. new upload,
  // conversation switch, reload). Signed URLs expire after 1hr so this keeps
  // them fresh rather than relying on a URL stored at send-time.
  React.useEffect(() => {
    const pathsToResolve = messages
      .map((m) => m.file_url)
      .filter((path): path is string => !!path && !resolvedUrls[path]);

    if (pathsToResolve.length === 0) return;

    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        pathsToResolve.map(async (path) => [path, await resolveSignedUrl(path)] as const)
      );
      if (!cancelled) {
        setResolvedUrls((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Send Text Message Handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeConvId || !user) return;

    const partnerId = activeConv
      ? activeConv.participant_1 === user.id
        ? activeConv.participant_2
        : activeConv.participant_1
      : null;

    const textToSend = inputMessage.trim();
    setInputMessage("");
    setReplyToMessage(null);
    setUploadError(null);

    const tempId = `temp-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newMsg: MessageItem = {
      id: tempId,
      conversation_id: activeConvId,
      sender_id: user.id,
      receiver_id: partnerId || undefined,
      content: textToSend,
      file_type: "text",
      created_at: nowIso,
      reply_to_id: replyToMessage?.id || null,
    };

    setMessages((prev) => [...prev, newMsg]);
    scrollToBottom();

    const supabase = createClient();
    const insertPayload: Record<string, any> = {
      conversation_id: activeConvId,
      sender_id: user.id,
      receiver_id: partnerId,
      content: textToSend,
      file_type: "text",
      created_at: nowIso,
    };
    if (replyToMessage?.id) {
      insertPayload.reply_to_id = replyToMessage.id;
    }

    const { data: insertedData, error: insertErr } = await supabase
      .from("messages")
      .insert(insertPayload)
      .select()
      .single();

    if (insertedData) {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? (insertedData as MessageItem) : m)));
    }

    if (insertErr) {
      console.error("[Send Message Error]", insertErr);
    }

    // Atomically update conversation last_message
    await supabase
      .from("conversations")
      .update({
        last_message: textToSend.slice(0, 60),
        last_message_at: nowIso,
      })
      .eq("id", activeConvId);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, last_message: textToSend.slice(0, 60), last_message_at: nowIso }
          : c
      )
    );
  };

  // Upload File & Attachment Handler (Images / PDFs)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file || !user || !activeConvId) return;

    // 1. Enforce strict File Size Limit (<= 10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`File size exceeds 10MB limit (Selected: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Enforce Allowed Mime Types
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      setUploadError("Unsupported format. Only clinical images and PDF documents are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const fileType = isImage ? "image" : "pdf";
    const partnerId = activeConv
      ? activeConv.participant_1 === user.id
        ? activeConv.participant_2
        : activeConv.participant_1
      : null;

    const tempId = `temp-upload-${Date.now()}`;
    const nowIso = new Date().toISOString();

    // Show temporary upload state in chat thread
    const tempMsg: MessageItem = {
      id: tempId,
      conversation_id: activeConvId,
      sender_id: user.id,
      receiver_id: partnerId || undefined,
      content: file.name,
      file_type: fileType,
      file_name: file.name,
      file_size: file.size,
      created_at: nowIso,
      is_uploading: true,
    };

    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();

    const supabase = createClient();

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${user.id}/${Date.now()}_${sanitizedName}`;

      // Upload file to Supabase Storage bucket 'chat-files'
      const { error: uploadErr } = await supabase.storage
        .from("chat-files")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) {
        throw new Error(`Storage upload failed: ${uploadErr.message}`);
      }

      // Bucket is private -> generate a signed URL for immediate preview.
      // The DB row stores the raw filePath, not this signed URL, since
      // signed URLs expire and get re-resolved on every load (see the
      // resolveSignedUrl effect above).
      const { data: signedData, error: signErr } = await supabase.storage
        .from("chat-files")
        .createSignedUrl(filePath, 60 * 60);

      if (signErr || !signedData) {
        throw new Error(`Could not generate file URL: ${signErr?.message}`);
      }

      const signedUrl = signedData.signedUrl;

      const insertPayload: Record<string, any> = {
        conversation_id: activeConvId,
        sender_id: user.id,
        receiver_id: partnerId,
        content: file.name,
        file_url: filePath, // store Storage PATH in chat-files bucket
        file_type: fileType,
        created_at: nowIso,
      };

      let { data: insertedMsg, error: dbErr } = await supabase
        .from("messages")
        .insert(insertPayload)
        .select()
        .maybeSingle();

      if (dbErr) {
        console.warn("[Attachment DB Insert Error] Retrying with core payload:", dbErr.message);
        const fallbackRes = await supabase.from("messages").insert(insertPayload);
        if (fallbackRes.error) throw fallbackRes.error;
      }

      // Seed resolvedUrls immediately so the image/card renders without
      // waiting for the background resolution effect to catch up.
      setResolvedUrls((prev) => ({ ...prev, [filePath]: signedUrl }));

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...tempMsg,
                ...(insertedMsg || {}),
                file_url: filePath,
                file_name: file.name,
                file_size: file.size,
                is_uploading: false,
              }
            : m
        )
      );

      // Update conversation preview snippet
      const previewText = fileType === "image" ? "📷 Photo" : "📄 Document";
      await supabase
        .from("conversations")
        .update({ last_message: previewText, last_message_at: nowIso })
        .eq("id", activeConvId);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, last_message: previewText, last_message_at: nowIso } : c
        )
      );
    } catch (err: any) {
      console.error("[Attachment Upload Failure]", err);
      setUploadError(`Failed to upload attachment: ${err.message || "Network error"}`);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // AI Reply Draft Generator Call
  const handleGenerateAIDraft = async () => {
    setGeneratingDraft(true);
    setAiDraftResult("");
    try {
      const history = messages.length > 0
        ? messages.map((m) => ({
            sender: m.sender_id === user?.id ? "doctor" : "patient",
            content: m.content || "",
          }))
        : [
            {
              sender: "patient",
              content: "Hello Doctor, I am sharing my latest medical symptoms and prescription questions for review.",
            },
          ];

      if (aiDraftPrompt.trim()) {
        history.push({
          sender: "doctor_instruction",
          content: aiDraftPrompt.trim(),
        });
      }

      const res = await fetch("/api/messages/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationHistory: history,
          doctorSpecialization: user?.specialization || "General Physician",
        }),
      });
      const data = await res.json();
      if (data.draft?.draft_reply) {
        setAiDraftResult(data.draft.draft_reply);
      } else if (typeof data.draft === "string") {
        setAiDraftResult(data.draft);
      } else if (data.error) {
        setAiDraftResult(`Could not generate draft: ${data.error}`);
      }
    } catch (e) {
      setAiDraftResult("Unable to generate AI reply draft. Please try again.");
    } finally {
      setGeneratingDraft(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-6.5rem)] flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Left Inbox Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950/50 shrink-0">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Direct Messages</span>
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                🔐 E2EE Active
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500 animate-pulse">Loading channels...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No active conversations found.</div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.participant_1 === user?.id ? conv.p2 : conv.p1;
                const partnerName = partner?.name || "Dr. Meddit Specialist";
                const isSelected = conv.id === activeConvId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-slate-100 dark:bg-slate-800 border-l-4 border-teal-600"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {partnerName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">{partnerName}</h4>
                        <span className="text-[10px] text-slate-400">{formatMessageTime(conv.last_message_at || "")}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
                        {conv.last_message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Thread Workspace */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {activeConv ? (
            <>
              {/* Thread Top Header */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {(activePartner?.name || "M").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {activePartner?.name || "Meddit User"}
                    </h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> End-to-End Encrypted Session
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isDoctor && (
                    <button
                      onClick={() => setShowAIDraftModal(true)}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Reply Draft</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowPatientDrawer(!showPatientDrawer)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Clinical Context</span>
                  </button>
                </div>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center justify-between px-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {uploadError}
                  </span>
                  <button onClick={() => setUploadError(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Messages Scroll Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white dark:bg-slate-900">
                {fetchError ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
                    <span>⚠️ {fetchError}</span>
                    <button onClick={fetchMessages} className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Retry</button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">No messages in this conversation yet.</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Send an encrypted message or clinical document below.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.sender_id === user?.id;
                    const prevMsg = messages[index - 1];

                    // Date Separator Computation
                    const currentDateDivider = formatDateDivider(msg.created_at);
                    const prevDateDivider = prevMsg ? formatDateDivider(prevMsg.created_at) : null;
                    const showDateDivider = currentDateDivider !== prevDateDivider;

                    // Group Consecutive Messages (Sender same & time diff <= 3 mins)
                    const isConsecutive =
                      !showDateDivider &&
                      prevMsg &&
                      prevMsg.sender_id === msg.sender_id &&
                      Math.abs(new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime()) < 180000;

                    // Message Tick Progression (3 States)
                    const isDelivered = !!msg.delivered_at;
                    const isRead = !!msg.read_at || !!msg.is_read;

                    // Resolve this message's signed URL (from Storage path)
                    const resolvedFileUrl = msg.file_url ? resolvedUrls[msg.file_url] || "" : "";

                    return (
                      <React.Fragment key={msg.id || index}>
                        {/* Centered Date Separator Pill */}
                        {showDateDivider && (
                          <div className="flex justify-center my-3">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-semibold rounded-full border border-slate-200 dark:border-slate-700">
                              {currentDateDivider}
                            </span>
                          </div>
                        )}

                        <div className={`flex ${isMe ? "justify-end" : "justify-start"} ${isConsecutive ? "mt-1" : "mt-3"}`}>
                          <div
                            className={`max-w-xs sm:max-w-md p-3 rounded-xl text-xs space-y-1.5 ${
                              isMe
                                ? "bg-teal-600 text-white rounded-br-none shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {/* Uploading Placeholder State */}
                            {msg.is_uploading && (
                              <div className="flex items-center gap-2 text-teal-100 dark:text-teal-200 text-xs animate-pulse">
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                                <span>Uploading attachment...</span>
                              </div>
                            )}

                            {/* Inline Image Attachment Rendering */}
                            {!msg.is_uploading && msg.file_type === "image" && (
                              <div
                                onClick={() => resolvedFileUrl && setLightboxUrl(resolvedFileUrl)}
                                className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-w-[240px] max-h-[200px] cursor-pointer group bg-black/10"
                              >
                                {resolvedFileUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={resolvedFileUrl}
                                    alt={msg.file_name || "Clinical Photo"}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="w-[240px] h-[160px] flex items-center justify-center text-[10px] text-slate-400 animate-pulse">
                                    Loading image...
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                                  View Photo 🔍
                                </div>
                              </div>
                            )}

                            {/* Inline PDF / Document Attachment Rendering */}
                            {!msg.is_uploading && msg.file_type === "pdf" && (
                              <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-xs truncate">{msg.file_name || msg.content}</p>
                                  <p className="text-[10px] text-slate-500">{formatBytes(msg.file_size)}</p>
                                </div>
                                {resolvedFileUrl ? (
                                  <a
                                    href={resolvedFileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                    className="p-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors shrink-0"
                                    title="Download Document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                ) : (
                                  <span className="p-1.5 text-[9px] text-slate-400">Loading…</span>
                                )}
                              </div>
                            )}

                            {/* Message Text Content */}
                            {msg.content && msg.file_type !== "image" && msg.file_type !== "pdf" && (
                              <p className="leading-relaxed font-normal whitespace-pre-wrap">{msg.content}</p>
                            )}

                            {/* Footer Timestamp & Sender Tick Status (3 States) */}
                            <div className={`text-[9px] flex items-center justify-end gap-1 ${isMe ? "text-teal-100" : "text-slate-400"}`}>
                              <span>{formatMessageTime(msg.created_at)}</span>
                              {isMe && (
                                <span title={isRead ? "Read" : isDelivered ? "Delivered" : "Sent"}>
                                  {isRead ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                                  ) : isDelivered ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-teal-200" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-teal-200" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer Composer */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
                {replyToMessage && (
                  <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>Replying to: {replyToMessage.content}</span>
                    <button onClick={() => setReplyToMessage(null)} className="font-bold">✕</button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach Image or PDF (Max 10MB)"
                    className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type encrypted message..."
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />

                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Send →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-500">
              Select a conversation to start encrypted medical messaging.
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxUrl} alt="Clinical Lightbox View" className="w-full h-full object-contain" />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white font-bold flex items-center justify-center border border-slate-700 hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* AI Reply Draft Modal */}
      {showAIDraftModal && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Clinical AI Reply Assistant</span>
              </h3>
              <button onClick={() => setShowAIDraftModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold">✕</button>
            </div>

            <textarea
              value={aiDraftPrompt}
              onChange={(e) => setAiDraftPrompt(e.target.value)}
              placeholder="e.g. Advise patient to take Telmisartan after food and track blood pressure daily for 3 days."
              rows={3}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />

            <button
              onClick={handleGenerateAIDraft}
              disabled={generatingDraft}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
            >
              {generatingDraft ? "Generating Clinical Response..." : "Generate AI Reply Draft"}
            </button>

            {aiDraftResult && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="text-slate-700 dark:text-slate-300 font-normal">{aiDraftResult}</p>
                <button
                  onClick={() => {
                    setInputMessage(aiDraftResult);
                    setShowAIDraftModal(false);
                  }}
                  className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-xs"
                >
                  Use Draft in Composer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}