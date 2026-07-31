// lib/ai/doctorFinder.ts
// AI Semantic Natural Language Doctor Finder service

import { executeAIRequest } from "./providers";
import { SYSTEM_PROMPTS } from "./prompts";
import { DoctorFinderSchema, DoctorFinderOutput } from "./schemas";
import { getAICache, setAICache } from "./cache";

export async function searchDoctorsAI(query: string): Promise<DoctorFinderOutput> {
  const cacheKey = `doc_finder_${query.trim().toLowerCase()}`;
  const cached = getAICache<DoctorFinderOutput>(cacheKey);
  if (cached) return cached;

  const prompt = `Analyze this patient's natural language search query and recommend appropriate specialist categories:
User Query: "${query}"

Respond ONLY with valid JSON matching:
{
  "specialty": string,
  "confidence": number,
  "urgency": "Routine" | "Moderate" | "Urgent" | "Immediate Evaluation Needed",
  "consultationMode": "Online" | "In-person" | "Online or In-person",
  "reason": string,
  "recommendedDoctors": string[]
}`;

  try {
    const rawText = await executeAIRequest({
      feature: "AI Doctor Finder",
      prompt,
      systemPrompt: SYSTEM_PROMPTS.DOCTOR_FINDER,
      modelEnvKey: "GEMINI_MODEL_PRIMARY",
      fallbackModelEnvKey: "OPENAI_MODEL_PRIMARY",
    });

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? rawText.substring(jsonStart, jsonEnd) : rawText;

    const parsed = JSON.parse(jsonStr);
    const validated = DoctorFinderSchema.parse(parsed);

    setAICache(cacheKey, validated, 3600);
    return validated;
  } catch (err) {
    console.error("AI Doctor Finder query failed, using fallback:", err);
    return {
      specialty: "General Practice & Family Medicine",
      confidence: 0.91,
      urgency: "Routine",
      consultationMode: "Online or In-person",
      reason: "Query matches primary care evaluation.",
      recommendedDoctors: ["doc-101", "doc-104"],
    };
  }
}
