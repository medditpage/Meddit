// app/api/community/moderate/route.ts
// Server route for AI Pre-Publication Misinformation & Community Safety Moderation (Fail-Closed Enforcement)

import { NextRequest, NextResponse } from "next/server";
import { moderateContentAI } from "@/lib/ai/moderation";

export async function POST(req: NextRequest) {
  try {
    const { title, content, imageBase64, imageUrl } = await req.json();
    const fullText = `${title || ""} ${content || ""}`.trim();
    const imgData = imageBase64 || imageUrl;

    if (!fullText && !imgData) {
      console.warn("[AI Moderation] Empty content submitted -> Blocking");
      return NextResponse.json({
        isAllowed: false,
        reason: "Empty content submitted. Please provide medical post title or details.",
        confidence: 1.0,
      });
    }

    console.log(`[AI Moderation] Running Gemini Safety Scan on text length ${fullText.length}, Image attached: ${!!imgData}`);

    const modResult = await moderateContentAI(fullText, imgData);

    const isBlocked =
      modResult.recommendedAction === "Dangerous Advice" ||
      modResult.recommendedAction === "Medical Misinformation" ||
      modResult.recommendedAction === "Hide Automatically";

    console.log(`[AI Moderation Result] Action: ${modResult.recommendedAction}, Allowed: ${!isBlocked}, Reason: "${modResult.reason}"`);

    return NextResponse.json({
      isAllowed: !isBlocked,
      severity: modResult.severity,
      confidence: modResult.confidence,
      reason: modResult.reason,
      recommendedAction: modResult.recommendedAction,
      appealable: modResult.appealable,
    });
  } catch (err: any) {
    console.error("[AI Moderation Error] Failing closed -> Blocking post:", err);
    // FAIL CLOSED: On error, reject post for safety
    return NextResponse.json({
      isAllowed: false,
      reason: "AI Safety Scanner unreachable. Post blocked for patient safety: " + (err.message || "Unknown error"),
      confidence: 0.0,
    });
  }
}
