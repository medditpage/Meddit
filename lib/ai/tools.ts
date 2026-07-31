// lib/ai/tools.ts
// Internal RBAC-authorized AI tools for doctor search, patient history, posts, and appointments

import { createClient } from "@/utils/supabase/client";

export interface ToolContext {
  userId?: string;
  userRole?: string;
}

export async function toolSearchDoctors(query: string, context?: ToolContext) {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, name, specialization, hospital, consulting_fee, rating")
    .eq("role", "doctor")
    .ilike("name", `%${query}%`)
    .limit(5);

  return data || [];
}

export async function toolSearchAppointments(context?: ToolContext) {
  if (!context?.userId) return { error: "Unauthorized" };
  const supabase = createClient();

  const { data } = await supabase
    .from("appointments")
    .select("*, doctor:profiles!doctor_id(name), patient:profiles!patient_id(name)")
    .or(`doctor_id.eq.${context.userId},patient_id.eq.${context.userId}`)
    .order("appointment_date", { ascending: true })
    .limit(5);

  return data || [];
}

export async function toolSearchCommunityPosts(query: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, content, subcommunity, upvotes")
    .ilike("title", `%${query}%`)
    .limit(5);

  return data || [];
}

export async function toolSearchPatientHistory(patientId: string, context?: ToolContext) {
  // Authorization RBAC check: Only patient themselves or authenticated doctor can access
  if (!context?.userId) return { error: "Unauthorized access to patient record" };
  if (context.userRole !== "doctor" && context.userId !== patientId) {
    return { error: "Permission denied: Patient record access restricted" };
  }

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, age, gender, blood_group, abha_number, allergies, current_medications, medical_conditions")
    .eq("id", patientId)
    .single();

  return profile || { info: "Patient record summary loaded" };
}
