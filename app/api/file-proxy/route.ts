import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the secure Supabase URL from the hidden request
  const url = request.nextUrl.searchParams.get("url");

  // Basic validation to ensure we are only proxying our own Supabase files
  if (!url || !url.includes("supabase.co")) {
    return new NextResponse("Invalid file request", { status: 400 });
  }

  try {
    // 1. Fetch the file securely on the server side (backend to backend)
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // 2. Stream the file directly to the browser
    // This completely hides the Supabase URL from the user's address bar
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
        // "inline" opens it in the browser tab. Use "attachment" to force download.
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse("Error fetching file", { status: 500 });
  }
}
