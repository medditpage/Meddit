// lib/ai/client.ts
// Centralized Groq AI Client Wrapper for Meddit
// Uses Groq API (free high-speed LLM models e.g. llama-3.3-70b-versatile)
// Supports pre-visit triage, pre-publish community moderation, and doctor reply drafts.

import type {
  TriageResult,
  ModerationResult,
  ReplyDraftResult,
  MedicalSpecialization,
} from "@/types/ai";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Gets active Groq API Key from environment variables.
 */
function getApiKey(): string | null {
  return (
    process.env.GROQ_API_KEY ||
    process.env.LLM_API_KEY ||
    null
  );
}

/**
 * Calls Groq OpenAI-compatible Chat Completions API with JSON response format.
 */
async function callGroqLLM(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response returned from Groq API.");
  }

  return content;
}

// ============================================================================
// 1. SYMPTOM-TO-SPECIALIZATION & PRE-VISIT TRIAGE
// ============================================================================

const TRIAGE_SYSTEM_PROMPT = `
You are a medical triage assistant for the Meddit healthcare platform.
Analyze patient free-text symptom descriptions and return a JSON object with:
{
  "matched_specialization": "<One of: Cardiology, Dermatology, Orthopedics, Neurology, General Physician, Pediatrics, Psychiatry, Gastroenterology, Pulmonology, ENT, Oncology, Gynecology, Urology, Ophthalmology>",
  "confidence_score": <number between 0.0 and 1.0>,
  "symptoms_summary": "<Brief summary of main complaints>",
  "structured_summary": {
    "likely_symptoms": ["<symptom 1>", "<symptom 2>"],
    "duration": "<Estimated duration or 'Unspecified'>",
    "relevant_history": ["<historical factor or 'None stated'>"],
    "urgency_level": "<low | medium | urgent | emergency>",
    "recommended_actions": ["<action 1>", "<action 2>"]
  }
}
Always return strictly valid JSON matching this schema.
`.trim();

/**
 * Maps patient symptoms to medical specialization and builds structured intake summary.
 */
export async function generateTriageSummary(
  symptomsText: string
): Promise<TriageResult> {
  const apiKey = getApiKey();

  // Fallback engine if no API key is present
  if (!apiKey) {
    return generateFallbackTriage(symptomsText);
  }

  try {
    const rawJson = await callGroqLLM(
      TRIAGE_SYSTEM_PROMPT,
      `Patient symptom description:\n"${symptomsText}"`
    );
    const parsed = JSON.parse(rawJson) as TriageResult;
    return parsed;
  } catch (error) {
    console.warn("Groq LLM triage call failed, using deterministic fallback:", error);
    return generateFallbackTriage(symptomsText);
  }
}

function generateFallbackTriage(text: string): TriageResult {
  const lower = text.toLowerCase();
  let matched_specialization: MedicalSpecialization = "General Physician";

  if (lower.includes("chest") || lower.includes("heart") || lower.includes("bp")) {
    matched_specialization = "Cardiology";
  } else if (lower.includes("skin") || lower.includes("rash") || lower.includes("acne")) {
    matched_specialization = "Dermatology";
  } else if (lower.includes("bone") || lower.includes("joint") || lower.includes("knee") || lower.includes("back pain")) {
    matched_specialization = "Orthopedics";
  } else if (lower.includes("headache") || lower.includes("seizure") || lower.includes("numbness")) {
    matched_specialization = "Neurology";
  } else if (lower.includes("stomach") || lower.includes("nausea") || lower.includes("acid")) {
    matched_specialization = "Gastroenterology";
  } else if (lower.includes("cough") || lower.includes("breath") || lower.includes("lungs")) {
    matched_specialization = "Pulmonology";
  } else if (lower.includes("ear") || lower.includes("throat") || lower.includes("nose")) {
    matched_specialization = "ENT";
  }

  const isEmergency = lower.includes("chest pain") || lower.includes("faint") || lower.includes("stroke") || lower.includes("severe bleed");

  return {
    matched_specialization,
    confidence_score: 0.85,
    symptoms_summary: text.slice(0, 120),
    structured_summary: {
      likely_symptoms: text.split(",").map((s) => s.trim()).filter(Boolean),
      duration: "Not specified",
      relevant_history: ["No major prior conditions mentioned"],
      urgency_level: isEmergency ? "emergency" : lower.includes("severe") ? "urgent" : "medium",
      recommended_actions: [
        "Consult matched specialist for detailed physical assessment.",
        isEmergency ? "Seek immediate emergency care (Dial 112 / 911)." : "Monitor vitals and rest.",
      ],
    },
  };
}

// ============================================================================
// 2. COMMUNITY PRE-PUBLISH MODERATION CLASSIFIER
// ============================================================================

const MODERATION_SYSTEM_PROMPT = `
You are a proactive community safety, health relevance, and moderation AI for Meddit.
Meddit is an exclusive medical and healthcare platform. Posts MUST be relevant to medical topics, health issues, illnesses, symptoms, medical history, treatments, or healthcare queries.

Return a JSON object:
{
  "is_medical": <boolean>,
  "confidence": <number between 0.0 and 1.0>,
  "medical_type": "<Clinical Image | Prescription | Lab Report | X-Ray | Text Inquiry | Other>",
  "category": "<General | Dermatology | Cardiology | Neurology | Orthopedics | Pediatrics | Oncology | Psychiatry | Ayurveda>",
  "subcategory": "<Description of subcategory>",
  "specialty": "<Recommended Medical Specialty>",
  "contains_text": <boolean>,
  "contains_prescription": <boolean>,
  "contains_bill": <boolean>,
  "contains_lab_report": <boolean>,
  "contains_xray": <boolean>,
  "contains_sensitive_content": <boolean>,
  "medically_relevant": <boolean>,
  "flagged": <boolean>,
  "severity": "<low | medium | high | critical>",
  "trigger_warning_banner": <boolean>,
  "warning_banner_text": "<Warning message or null>",
  "reason": "<Detailed explanation>",
  "recommended_tags": ["<tag1>", "<tag2>"]
}
Always return valid JSON.
`.trim();

/**
 * Calls Google Gemini 2.5 Flash Vision API using signed URL or image stream for multimodal medical analysis.
 */
export async function analyzeImageMedicalRelevance(
  imageUrl: string,
  textPrompt?: string
): Promise<ModerationResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY is missing. Using fallback moderation.");
    return generateFallbackModeration(textPrompt || "Uploaded Image", "Image Upload");
  }

  try {
    let mimeType = "image/jpeg";
    let base64Data = "";

    if (imageUrl.startsWith("data:")) {
      const match = imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (imageUrl.startsWith("http")) {
      try {
        const imgRes = await fetch(imageUrl);
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          base64Data = Buffer.from(buffer).toString("base64");
          mimeType = imgRes.headers.get("content-type") || "image/jpeg";
        }
      } catch (err) {
        console.warn("Could not fetch image for base64 inline encoding:", err);
      }
    }

    const promptText = `Analyze this image and post text for medical relevance.
Is this image or text related to human health, medical symptoms, x-rays, skin lesions, lab results, prescriptions, or clinical issues?
If it is NOT medically relevant (e.g. video games, memes, cars, anime, food, sports, non-health chat), set "is_medical": false and "medically_relevant": false.
Text Context: "${textPrompt || "N/A"}"

Return strictly valid JSON matching this schema:
{
  "is_medical": boolean,
  "confidence": number,
  "medical_type": string,
  "category": string,
  "subcategory": string,
  "specialty": string,
  "contains_text": boolean,
  "contains_prescription": boolean,
  "contains_bill": boolean,
  "contains_lab_report": boolean,
  "contains_xray": boolean,
  "contains_sensitive_content": boolean,
  "medically_relevant": boolean,
  "flagged": boolean,
  "severity": "low" | "medium" | "high" | "critical",
  "trigger_warning_banner": boolean,
  "warning_banner_text": string | null,
  "reason": string,
  "recommended_tags": string[]
}`;

    const parts: any[] = [{ text: promptText }];
    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    // 15-second AbortController timeout to prevent hanging fetches
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.1,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText) as ModerationResult;
          parsed.medically_relevant = parsed.is_medical ?? parsed.medically_relevant ?? true;
          return parsed;
        }
      }

      const errText = await response.text();
      console.warn(`Gemini Vision (${geminiModel}) error (${response.status}):`, errText);

      return {
        is_medical: false,
        confidence: 0,
        medical_type: "Unscanned Clinical Image",
        category: "Rate Limited",
        specialty: "N/A",
        medically_relevant: false,
        flagged: true,
        severity: "high",
        trigger_warning_banner: false,
        warning_banner_text: null,
        reason: response.status === 429
          ? "Google Gemini Vision AI rate limit reached (429 Quota Exceeded). Please wait 30 seconds before uploading clinical photos."
          : `Gemini Vision AI scan error (${response.status}). Please check image formatting and retry.`,
        recommended_tags: [],
      };
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      const isAbort = fetchErr?.name === "AbortError";
      return {
        is_medical: false,
        confidence: 0,
        medical_type: "Unscanned Clinical Image",
        category: "Timeout",
        specialty: "N/A",
        medically_relevant: false,
        flagged: true,
        severity: "high",
        trigger_warning_banner: false,
        warning_banner_text: null,
        reason: isAbort
          ? "Gemini Vision AI request timed out after 15 seconds. Please try uploading a smaller image or retry."
          : "Could not connect to Gemini Vision AI. Please check network connectivity and retry.",
        recommended_tags: [],
      };
    }
  } catch (error) {
    console.warn("Gemini Vision AI processing error:", error);
    return {
      is_medical: false,
      confidence: 0,
      medical_type: "Unscanned Clinical Image",
      category: "Scanner Error",
      specialty: "N/A",
      medically_relevant: false,
      flagged: true,
      severity: "high",
      trigger_warning_banner: false,
      warning_banner_text: null,
      reason: "Could not complete AI Vision scan for uploaded image. Please retry in a few moments.",
      recommended_tags: [],
    };
  }
}

/**
 * Scans community post/comment content for safety, medical misinformation, and emergency signals.
 */
export async function classifyCommunityContent(
  text: string,
  title?: string
): Promise<ModerationResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateFallbackModeration(text, title);
  }

  try {
    const rawJson = await callGroqLLM(
      MODERATION_SYSTEM_PROMPT,
      `Content to scan:\nTitle: "${title || "N/A"}"\nBody: "${text}"`
    );
    const result = JSON.parse(rawJson) as ModerationResult;
    result.is_medical = result.is_medical ?? result.medically_relevant ?? true;
    result.medically_relevant = result.is_medical;
    if (!result.recommended_tags) {
      result.recommended_tags = [`m/${result.category || "General"}`];
    }
    return result;
  } catch (error) {
    console.warn("Groq LLM moderation call failed, using deterministic fallback:", error);
    return generateFallbackModeration(text, title);
  }
}

function generateFallbackModeration(text: string, title?: string): ModerationResult {
  const fullText = `${title || ""} ${text}`.toLowerCase();

  const isEmergency =
    fullText.includes("chest pain") ||
    fullText.includes("suicide") ||
    fullText.includes("self harm") ||
    fullText.includes("stroke") ||
    fullText.includes("cannot breathe");

  if (isEmergency) {
    return {
      is_medical: true,
      confidence: 0.99,
      medical_type: "Emergency Signal",
      category: "emergency_signal",
      specialty: "Emergency Medicine",
      medically_relevant: true,
      flagged: true,
      severity: "critical",
      trigger_warning_banner: true,
      warning_banner_text:
        "🚨 Emergency Alert: If you or someone you know is experiencing acute severe symptoms (chest pain, breathing difficulty) or emotional distress, please seek immediate emergency care or call 112 / emergency services right away.",
      reason: "Detected potential medical emergency or crisis keywords.",
      recommended_tags: ["m/Emergency", "UrgentCare"],
    };
  }

  const isMisinformation =
    fullText.includes("cure cancer overnight") ||
    fullText.includes("bleach cures") ||
    fullText.includes("miracle cure");

  if (isMisinformation) {
    return {
      is_medical: true,
      confidence: 0.95,
      medical_type: "Misinformation Claim",
      category: "medical_misinformation",
      specialty: "General Medicine",
      medically_relevant: true,
      flagged: true,
      severity: "high",
      trigger_warning_banner: false,
      warning_banner_text: null,
      reason: "Content contains unverified or potentially harmful medical claims.",
      recommended_tags: ["m/General"],
    };
  }

  const medicalKeywords = [
    "doctor", "patient", "hospital", "clinic", "pain", "fever", "cough", "symptom",
    "disease", "illness", "health", "medicine", "pill", "tablet", "surgery", "treatment",
    "infection", "blood", "heart", "brain", "skin", "stomach", "bone", "lung", "kidney",
    "liver", "headache", "nausea", "swelling", "cancer", "diabetes", "bp", "rash", "allergy",
    "ayurveda", "dawa", "dawai", "bukhar", "dard", "khasi", "test", "report", "scan", "mri",
    "prescription", "diagnosis", "therapy", "mental", "anxiety", "depression"
  ];
  const isRelevant = medicalKeywords.some((k) => fullText.includes(k));

  if (!isRelevant) {
    return {
      is_medical: false,
      confidence: 0.9,
      medical_type: "Non-Medical Content",
      category: "Off-Topic",
      specialty: "N/A",
      medically_relevant: false,
      flagged: true,
      severity: "medium",
      trigger_warning_banner: false,
      warning_banner_text: null,
      reason: "Post is not relevant to medical topics, illnesses, symptoms, or health history.",
      recommended_tags: [],
    };
  }

  return {
    is_medical: true,
    confidence: 0.95,
    medical_type: "Clinical Inquiry",
    category: "General",
    specialty: "General Medicine",
    medically_relevant: true,
    flagged: false,
    severity: "low",
    trigger_warning_banner: false,
    warning_banner_text: null,
    reason: "Medical content verified.",
    recommended_tags: ["m/General"],
  };
}

// ============================================================================
// 3. DOCTOR REPLY DRAFT GENERATOR
// ============================================================================

const REPLY_DRAFT_SYSTEM_PROMPT = `
You are an AI clinical assistant helping doctors draft polite, accurate, empathetic reply drafts for patient messages.
CRITICAL SAFETY RULE: Drafts are ADVISORY ONLY and will be presented to the doctor for editing and manual confirmation.

Return a JSON object:
{
  "draft_reply": "<Suggested clinical response text for doctor review>",
  "key_points_addressed": ["<point 1>", "<point 2>"],
  "disclaimer": "AI-generated draft for doctor review. This response will not be sent automatically."
}
Always return valid JSON.
`.trim();

/**
 * Generates an AI draft reply for doctor review in 1:1 patient conversations.
 */
export async function generateDoctorReplyDraft(
  messagesHistory: { sender: string; content: string }[],
  doctorSpecialization: string = "General Physician"
): Promise<ReplyDraftResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateFallbackReplyDraft(messagesHistory, doctorSpecialization);
  }

  try {
    const formattedHistory = messagesHistory
      .map((m) => `${m.sender}: "${m.content}"`)
      .join("\n");

    const rawJson = await callGroqLLM(
      REPLY_DRAFT_SYSTEM_PROMPT,
      `Doctor Specialization: ${doctorSpecialization}\nConversation History:\n${formattedHistory}`
    );
    return JSON.parse(rawJson) as ReplyDraftResult;
  } catch (error) {
    console.warn("Groq LLM draft call failed, using fallback draft:", error);
    return generateFallbackReplyDraft(messagesHistory, doctorSpecialization);
  }
}

function generateFallbackReplyDraft(
  history: { sender: string; content: string }[],
  doctorSpecialization: string
): ReplyDraftResult {
  const lastPatientMsg =
    [...history].reverse().find((m) => m.sender.toLowerCase().includes("patient"))?.content ||
    "my symptoms";

  return {
    draft_reply: `Hello, thank you for reaching out to ${doctorSpecialization} regarding ${lastPatientMsg.slice(
      0,
      60
    )}. Based on what you've described, I recommend monitoring your symptoms closely. If you experience any worsening pain, fever, or new discomfort, please schedule a follow-up or visit our clinic. Feel free to reply with any further details.`,
    key_points_addressed: [
      `Acknowledged patient complaint regarding: ${lastPatientMsg.slice(0, 40)}`,
      "Advised symptom monitoring and follow-up criteria",
    ],
    disclaimer:
      "AI-generated draft for doctor review. Must be approved and confirmed by the physician before sending.",
  };
}
