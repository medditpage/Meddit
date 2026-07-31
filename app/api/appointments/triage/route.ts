// app/api/appointments/triage/route.ts
// Pre-appointment AI triage endpoint (Groq-powered)
// Maps patient symptoms to specialization and generates structured pre-visit intake summary.

import { NextResponse } from "next/server";
import { generateTriageSummary } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptomsText } = body;

    if (!symptomsText || typeof symptomsText !== "string" || !symptomsText.trim()) {
      return NextResponse.json(
        { error: "Field 'symptomsText' is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const triageResult = await generateTriageSummary(symptomsText.trim());

    return NextResponse.json({
      success: true,
      triage: triageResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Triage Route Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
