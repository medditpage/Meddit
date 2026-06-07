"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInboxItem } from "@/components/chat/ChatInboxItem";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInputArea } from "@/components/chat/ChatInputArea";
import { useStore } from "@/lib/store";

const MessagingPage = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  // 1. Grab the action to clear global notifications
  const markMessageRead = useStore((state) => state.markMessageRead);

  // Clear unread badge when this page loads
  React.useEffect(() => {
    markMessageRead();
    markMessageRead(); // Calling twice to clear the '2' badge
  }, [markMessageRead]);

  // 2. Set up our live conversation state
  const [messages, setMessages] = React.useState([
    {
      id: "m1",
      content: "Hello Dr. Rao, are my blood test reports ready?",
      timestamp: "10:25 AM",
      isOwn: true,
      isRead: true,
    },
    {
      id: "m2",
      content:
        "Yes, they are ready. Everything looks within the normal range. I've uploaded them to your portal.",
      timestamp: "10:30 AM",
      isOwn: false,
      isRead: true,
    },
  ]);

  const conversations = [
    {
      id: "1",
      name: "Dr. Ananya Rao",
      lastMessage: messages[messages.length - 1].content,
      time: "Just now",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      lastMessage: "Thank you for the guidance.",
      time: "Yesterday",
      unreadCount: 0,
      isOnline: false,
    },
  ];

  // 3. Handle sending a message and the auto-reply
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate the Doctor replying after 2 seconds
    setTimeout(() => {
      setIsTyping(false);
      const botReply = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand. Let's schedule a brief follow-up call tomorrow to discuss this in detail. Does 2:00 PM work for you?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: false,
        isRead: true,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 2500);
  };

  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
        {/* Left Sidebar: Inbox */}
        <div className="hidden md:block w-1/3 min-w-[280px] border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900 bg-slate-50/50">
            Conversations
          </div>
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <ChatInboxItem
                key={conv.id}
                {...conv}
                isActive={conv.id === "1"}
              />
            ))}
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3 z-10 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              AR
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Dr. Ananya Rao</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 block"></span>{" "}
                Online
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                timestamp={msg.timestamp}
                isOwn={msg.isOwn}
                isRead={msg.isRead}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-sm p-2 animate-pulse">
                Dr. Ananya Rao is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-2 md:p-4">
            <ChatInputArea
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagingPage;
