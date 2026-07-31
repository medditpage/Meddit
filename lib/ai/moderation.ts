// lib/ai/moderation.ts
// AI Community Safety & Medical Misinformation Classifier (Fail-Closed Safety Engine)

import { executeAIRequest } from "./providers";
import { SYSTEM_PROMPTS } from "./prompts";
import { CommunityModerationSchema, CommunityModerationOutput } from "./schemas";
import { getAICache, setAICache } from "./cache";

export async function moderateContentAI(
  content: string,
  imageBase64?: string
): Promise<CommunityModerationOutput> {
  const cacheKey = `mod_${content.trim().toLowerCase().slice(0, 50)}_${imageBase64 ? imageBase64.slice(-30) : "noimg"}`;
  const cached = getAICache<CommunityModerationOutput>(cacheKey);
  if (cached) return cached;

  const prompt = `You are the Meddit Clinical Safety AI Scanner. Analyze this community post text and attached image for:
1. Medical Relevance: Is the topic related to human health, symptoms, medical questions, clinical practice, lab results, medications, or patient care? Off-topic posts, delivery apps, QR codes, vehicles, memes, sales promotions, or non-medical graphics MUST BE BLOCKED.
2. Safety & Misinformation: Check for dangerous medical advice, unverified miracle cures, lethal drug dosages, or toxic recommendations.

Content to Analyze: "${content}"
${imageBase64 ? `Attached Image Data (Base64/URL): Present (Check for non-medical promotional graphics, QR codes, delivery scooters, or off-topic imagery).` : "Attached Image: None."}

Respond ONLY with valid JSON matching:
{
  "severity": "None" | "Low" | "Medium" | "High" | "Critical",
  "confidence": number,
  "reason": string,
  "recommendedAction": "Safe" | "Needs Review" | "Medical Misinformation" | "Dangerous Advice" | "Hide Automatically",
  "appealable": boolean
}`;

  try {
    const rawText = await executeAIRequest({
      feature: "AI Community Moderation",
      prompt,
      systemPrompt: SYSTEM_PROMPTS.COMMUNITY_MODERATOR,
      modelEnvKey: "GEMINI_MODEL_PRIMARY",
      fallbackModelEnvKey: "OPENAI_MODEL_FALLBACK",
    });

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? rawText.substring(jsonStart, jsonEnd) : rawText;

    const parsed = JSON.parse(jsonStr);
    const validated = CommunityModerationSchema.parse(parsed);

    // Fail closed if image or text explicitly detected as off-topic or non-medical promotion
    if (
      content.toLowerCase().includes("scooter") ||
      content.toLowerCase().includes("delivery") ||
      content.toLowerCase().includes("promo") ||
      content.toLowerCase().includes("discount code")
    ) {
      validated.recommendedAction = "Hide Automatically";
      validated.reason = "Non-medical promotional or delivery content detected. Only healthcare topics are permitted.";
    }

    setAICache(cacheKey, validated, 7200);
    return validated;
  } catch (err: any) {
    console.error("AI Moderation failed. FAILING CLOSED FOR SAFETY:", err);
    // FAIL CLOSED: Block post on moderation error for safety
    return {
      severity: "High",
      confidence: 0.0,
      reason: `AI Safety Scanner unreachable (${err.message || "Unknown error"}). Post blocked for safety.`,
      recommendedAction: "Hide Automatically",
      appealable: true,
    };
  }
}
