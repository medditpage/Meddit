// app/api/ai/chat/route.ts
// Streaming API route for Meddit AI Assistant

import { NextRequest, NextResponse } from "next/server";
import { processChatbotRequest } from "@/lib/ai/chatbot";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { messages, routeContext } = await req.json();

    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const userContext = {
      userId: authUser?.id,
      userRole: authUser?.user_metadata?.role || "patient",
    };

    const reply = await processChatbotRequest(messages || [], routeContext || { pathname: "/" }, userContext);

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process AI chat" }, { status: 500 });
  }
}
