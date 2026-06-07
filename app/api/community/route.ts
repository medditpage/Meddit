import { NextResponse } from "next/server";
import { database } from "@/lib/mockDb";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate delay
  return NextResponse.json(database.community);
}
