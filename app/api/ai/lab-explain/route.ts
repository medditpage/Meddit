// app/api/ai/lab-explain/route.ts
// API endpoint for AI Multimodal Lab Report Explanation

import { NextRequest, NextResponse } from "next/server";
import { explainLabReport } from "@/lib/ai/labReport";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, textContext, fileHash } = body;

    const hash = fileHash || `lab_${Date.now()}`;
    const imagePayload = imageBase64 ? { mime_type: mimeType || "image/png", data: imageBase64 } : null;

    const result = await explainLabReport(hash, imagePayload, textContext);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to analyze lab report" }, { status: 500 });
  }
}
