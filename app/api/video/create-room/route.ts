import { NextResponse } from "next/server";

export async function POST() {
  try {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Daily API key is missing" },
        { status: 500 },
      );
    }

    // Call Daily.co REST API to create a secure, temporary room
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          // Room automatically self-destructs after 1 hour (3600 seconds)
          exp: Math.floor(Date.now() / 1000) + 3600,
          // We disable their built-in chat because you already built a better one!
          enable_chat: false,
          enable_screenshare: true,
        },
      }),
    });

    const room = await response.json();

    if (!response.ok) {
      throw new Error(room.error || "Failed to create room");
    }

    // Return the secure room URL to the frontend
    return NextResponse.json({ url: room.url });
  } catch (error: any) {
    console.error("Video Room Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
