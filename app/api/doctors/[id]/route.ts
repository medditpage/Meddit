import { NextResponse } from "next/server";
import { database } from "@/lib/mockDb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // <-- Note the Promise type
) {
  // 1. Await the params before using them!
  const resolvedParams = await params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doctor =
    database.doctors[resolvedParams.id as keyof typeof database.doctors];

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json(doctor);
}
