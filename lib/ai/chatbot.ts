// lib/ai/chatbot.ts
// Context-Aware Conversational Meddit AI Assistant service

import { executeAIRequest } from "./providers";
import { SYSTEM_PROMPTS } from "./prompts";
import {
  toolSearchDoctors,
  toolSearchAppointments,
  toolSearchCommunityPosts,
  toolSearchPatientHistory,
  ToolContext,
} from "./tools";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RouteContext {
  pathname: string;
  patientId?: string;
  doctorId?: string;
}

export async function processChatbotRequest(
  messages: ChatMessage[],
  routeContext: RouteContext,
  userContext: ToolContext
): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const queryLower = lastUserMsg.toLowerCase();

  // Route Context Injection & Tool Authorization check
  let toolData = "";

  if (queryLower.includes("doctor") || queryLower.includes("specialist")) {
    const docs = await toolSearchDoctors(lastUserMsg, userContext);
    toolData += `\n[Tool Result - Doctors]: ${JSON.stringify(docs)}`;
  } else if (queryLower.includes("appointment") || queryLower.includes("schedule")) {
    const apts = await toolSearchAppointments(userContext);
    toolData += `\n[Tool Result - Appointments]: ${JSON.stringify(apts)}`;
  } else if (queryLower.includes("post") || queryLower.includes("community")) {
    const posts = await toolSearchCommunityPosts(lastUserMsg);
    toolData += `\n[Tool Result - Community]: ${JSON.stringify(posts)}`;
  } else if (routeContext.patientId && (queryLower.includes("history") || queryLower.includes("record"))) {
    const history = await toolSearchPatientHistory(routeContext.patientId, userContext);
    toolData += `\n[Tool Result - Patient History]: ${JSON.stringify(history)}`;
  }

  const contextInstruction = `Active Route: ${routeContext.pathname}${
    routeContext.patientId ? ` | Viewing Patient ID: ${routeContext.patientId}` : ""
  }${toolData}`;

  const prompt = `${contextInstruction}\n\nUser Question: ${lastUserMsg}`;

  const reply = await executeAIRequest({
    feature: "Meddit AI Assistant",
    prompt,
    systemPrompt: SYSTEM_PROMPTS.CHATBOT_ASSISTANT,
    modelEnvKey: "OPENAI_MODEL_PRIMARY",
    fallbackModelEnvKey: "GEMINI_MODEL_PRIMARY",
  });

  return `${reply}\n\n*${SYSTEM_PROMPTS.MEDICAL_DISCLAIMER}*`;
}
