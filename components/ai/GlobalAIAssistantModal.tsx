"use client";

// components/ai/GlobalAIAssistantModal.tsx
// Global Floating Context-Aware Meddit AI Assistant (Ctrl+K Keyboard Shortcut & Tool Calling)

import * as React from "react";
import { usePathname } from "next/navigation";

export function GlobalAIAssistantModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputMsg, setInputMsg] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your Meddit Healthcare AI Assistant. Ask me medical education questions, lab terminology, appointment preparation tips, or platform guidance.",
    },
  ]);
  const [loading, setLoading] = React.useState(false);

  // Global Ctrl+K keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          routeContext: { pathname },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right */}
      <button
        onClick={() => setIsOpen(true)}
        title="Open Meddit AI Assistant (Ctrl+K)"
        aria-label="Open Meddit AI Assistant (Ctrl+K)"
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full shadow-lg transition-all flex items-center justify-center"
      >
        <span className="text-lg">🤖</span>
      </button>

      {/* Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 w-full max-w-xl h-[550px] flex flex-col shadow-xl text-slate-900 dark:text-slate-100 transition-colors">
            {/* Modal Top Header */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  m/
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Meddit AI Assistant</h3>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                    Active Context: {pathname}
                  </p>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            {/* Suggested Context Prompt Chips */}
            <div className="p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => handleSend("Explain hypertension symptoms and when to see a doctor")}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:border-teal-500"
              >
                🩺 Explain Symptoms
              </button>
              <button
                onClick={() => handleSend("What questions should I ask my doctor during a appointment?")}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:border-teal-500"
              >
                ❓ Appointment Prep
              </button>
              <button
                onClick={() => handleSend("Find top rated cardiologist specialists near me")}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:border-teal-500"
              >
                🔍 Search Doctors
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-xl ${
                      m.role === "user"
                        ? "bg-teal-600 text-white rounded-br-none shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <p className="leading-relaxed font-normal whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && <div className="text-slate-400 text-xs animate-pulse">Meddit AI is processing context...</div>}
            </div>

            {/* Composer Footer Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Meddit AI Assistant..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
              >
                Send →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
