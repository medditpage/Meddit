// app/api/messages/draft/route.ts
// Doctor AI reply draft endpoint (Groq-powered)
// Generates empathetic, clinically clear doctor reply drafts based on conversation history.
// Human-in-the-Loop Guarantee: Drafts are advisory ONLY and require physician editing/approval before sending.

import { NextResponse } from "next/server";
import { generateDoctorReplyDraft } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawHistory = body.conversationHistory || body.messages || body.history;
    const doctorSpecialization = body.doctorSpecialization || body.specialization || "General Physician";

    const conversationHistory = Array.isArray(rawHistory) && rawHistory.length > 0
      ? rawHistory
      : [
          {
            sender: "patient",
            content: "Hello Doctor, I am sharing my latest medical symptoms and prescription questions for review.",
          },
        ];

    const draftResult = await generateDoctorReplyDraft(
      conversationHistory,
      typeof doctorSpecialization === "string" ? doctorSpecialization : "General Physician"
    );

    return NextResponse.json({
      success: true,
      draft: draftResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Messages Reply Draft Route Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
