// types/ai.ts
// Type definitions for Meddit AI / Inference Layer (Groq Powered)

export type MedicalSpecialization =
  | "Cardiology"
  | "Dermatology"
  | "Orthopedics"
  | "Neurology"
  | "General Physician"
  | "Pediatrics"
  | "Psychiatry"
  | "Gastroenterology"
  | "Pulmonology"
  | "ENT"
  | "Oncology"
  | "Gynecology"
  | "Urology"
  | "Ophthalmology";

export type UrgencyLevel = "low" | "medium" | "urgent" | "emergency";

export type ModerationCategory =
  | "clean"
  | "medical_misinformation"
  | "requires_doctor_consultation"
  | "emergency_signal";

export type ModerationSeverity = "low" | "medium" | "high" | "critical";

export interface StructuredPreVisitSummary {
  likely_symptoms: string[];
  duration: string;
  relevant_history: string[];
  urgency_level: UrgencyLevel;
  recommended_actions: string[];
}

export interface TriageResult {
  matched_specialization: MedicalSpecialization;
  confidence_score: number;
  symptoms_summary: string;
  structured_summary: StructuredPreVisitSummary;
}

export interface ModerationResult {
  is_medical: boolean;
  confidence: number;
  medical_type?: string;
  category: ModerationCategory | string;
  subcategory?: string;
  specialty?: string;
  contains_text?: boolean;
  contains_prescription?: boolean;
  contains_bill?: boolean;
  contains_lab_report?: boolean;
  contains_xray?: boolean;
  contains_sensitive_content?: boolean;
  medically_relevant: boolean;
  flagged: boolean;
  severity: ModerationSeverity;
  trigger_warning_banner: boolean;
  warning_banner_text: string | null;
  reason: string;
  recommended_tags?: string[];
}

export interface ReplyDraftResult {
  draft_reply: string;
  key_points_addressed: string[];
  disclaimer: string;
}

// Database schema record structures
export interface PreVisitSummaryRecord {
  id: string;
  appointment_id?: string;
  patient_id?: string;
  symptoms_text: string;
  matched_specialization: MedicalSpecialization;
  confidence_score: number;
  structured_summary: StructuredPreVisitSummary;
  urgency_level: UrgencyLevel;
  created_at: string;
}

export interface ModerationFlagRecord {
  id: string;
  post_id?: string;
  comment_id?: string;
  author_id?: string;
  content_scanned: string;
  flagged_category: ModerationCategory;
  severity: ModerationSeverity;
  trigger_warning_banner: boolean;
  reason: string;
  created_at: string;
}
