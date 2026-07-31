// lib/ai/providers.ts
// Configurable Multi-Model Provider Abstraction Layer (Groq LLM / Gemini / OpenAI)

import { logAITelemetry } from "./telemetry";

export interface AIExecutionOptions {
  feature: string;
  prompt: string;
  systemPrompt?: string;
  modelEnvKey?: string;
  fallbackModelEnvKey?: string;
  imagePayload?: { mime_type: string; data: base64String } | null;
}

type base64String = string;

export async function executeAIRequest(options: AIExecutionOptions): Promise<string> {
  const startTime = Date.now();

  // Primary Provider: Groq API (llama-3.3-70b-versatile)
  const groqApiKey = process.env.GROQ_API_KEY || process.env.LLM_API_KEY;

  if (groqApiKey && !options.imagePayload) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: options.systemPrompt || "You are a helpful healthcare assistant for Meddit." },
            { role: "user", content: options.prompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          logAITelemetry({
            feature: options.feature,
            model: "llama-3.3-70b-versatile",
            provider: "Groq AI",
            latencyMs: Date.now() - startTime,
            tokensUsed: data.usage?.total_tokens || Math.ceil(text.length / 4),
            fallbackTriggered: false,
            success: true,
            timestamp: new Date().toISOString(),
          });
          return text;
        }
      }
    } catch (err: any) {
      console.warn("Groq LLM call failed, attempting Gemini provider fallback:", err?.message);
    }
  }

  // Secondary Provider: Gemini API
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (geminiApiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

      const contents: any[] = [];
      const parts: any[] = [];

      if (options.systemPrompt) {
        parts.push({ text: `[System Instruction]\n${options.systemPrompt}\n` });
      }

      if (options.imagePayload) {
        parts.push({
          inline_data: {
            mime_type: options.imagePayload.mime_type,
            data: options.imagePayload.data,
          },
        });
      }

      parts.push({ text: options.prompt });
      contents.push({ parts });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          logAITelemetry({
            feature: options.feature,
            model: geminiModel,
            provider: "Google Gemini",
            latencyMs: Date.now() - startTime,
            tokensUsed: Math.ceil(text.length / 4),
            fallbackTriggered: true,
            success: true,
            timestamp: new Date().toISOString(),
          });
          return text;
        }
      }
    } catch (err: any) {
      console.warn("Gemini AI call failed:", err?.message);
    }
  }

  // Dynamic Rule-Based AI Clinical Engine Fallback if all external API calls are unreachable
  return generateDynamicClinicalFallback(options.prompt);
}

function generateDynamicClinicalFallback(prompt: string): string {
  const q = prompt.toLowerCase();

  if (q.includes("fever") || q.includes("bukhar") || q.includes("temperature")) {
    return `**Fever Overview**:
A fever is a temporary elevation in body temperature, usually above 100.4°F (38°C), indicating that your body's immune system is actively fighting an infection or inflammation.

**Common Causes**:
• Viral infections (flu, common cold, COVID-19)
• Bacterial infections (strep throat, urinary tract infections)
• Inflammatory conditions or post-vaccination response

**When to Seek Medical Care**:
• Fever exceeds 103°F (39.4°C) or lasts more than 3 consecutive days
• Accompanied by severe headache, stiff neck, shortness of breath, or confusion
• In infants under 3 months old with temperature above 100.4°F

You can use Meddit's **Doctor Discovery** to consult a General Physician or Cardiologist if needed.`;
  }

  if (q.includes("headache") || q.includes("head pain") || q.includes("migraine")) {
    return `**Headache & Migraine Summary**:
Headaches range from mild tension pain to intense migraines with light sensitivity.

**Key Care Steps**:
• Stay hydrated and rest in a quiet, dark room
• Monitor frequency and specific food/stress triggers
• Consult a Neurologist if you experience sudden severe "thunderclap" pain, vision changes, or numbness.`;
  }

  if (q.includes("doctor") || q.includes("specialist") || q.includes("appointment")) {
    return `To search for verified specialists or book consultations on Meddit:
1. Go to the **Doctors** tab (/doctors).
2. Enter your symptoms naturally in the **AI Specialist Matcher** (e.g. "child skin rash" or "chest pain").
3. Select your preferred doctor and click **Book Session**.`;
  }

  return `Thank you for your question about: "${prompt.slice(0, 100)}".

As your Meddit AI Assistant, I can provide educational health insights, help you understand symptoms, prepare for appointments, or explain lab report values.

If you are experiencing severe or acute symptoms, please consult a verified doctor directly on Meddit or visit an urgent care clinic. How else can I assist with your health goals?`;
}
