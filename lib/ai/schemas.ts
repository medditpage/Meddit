// lib/ai/schemas.ts
// Centralized Zod validation schemas for all structured AI outputs

import { z } from "zod";

// 1. AI Medical Timeline Output Schema
export const MedicalTimelineSchema = z.object({
  trend: z.string().describe("Longitudinal trend observed across medical records"),
  confidence: z.number().min(0).max(1).describe("AI confidence rating from 0.0 to 1.0"),
  evidence: z.array(z.string()).describe("List of supporting clinical records or dates"),
  insight: z.string().describe("Clinical overview of patient history"),
  anomaly: z.string().optional().describe("Notable outlier, missed visit, or symptom spike"),
  suggestedFollowUpTopics: z
    .string()
    .describe("Educational follow-up discussion points for doctor consultation"),
});
export type MedicalTimelineOutput = z.infer<typeof MedicalTimelineSchema>;

// 2. AI Lab Report Explainer Output Schema
export const LabReportExplainerSchema = z.object({
  overallSummary: z.string().describe("Patient-friendly summary of lab report"),
  abnormalValues: z
    .array(
      z.object({
        parameter: z.string(),
        value: z.string(),
        referenceRange: z.string(),
        status: z.enum(["High", "Low", "Normal", "Critical"]),
        explanation: z.string(),
      })
    )
    .describe("Extracted out-of-range metrics"),
  plainLanguageExplanation: z.string().describe("Simplified breakdown of medical terminology"),
  questionsToAskDoctor: z.array(z.string()).describe("Suggested questions for consultation"),
  suggestedTopics: z.string().describe("General lifestyle & monitoring discussion topics"),
  disclaimer: z
    .string()
    .default(
      "This explanation is educational only and is not a substitute for professional medical advice or diagnosis."
    ),
});
export type LabReportExplainerOutput = z.infer<typeof LabReportExplainerSchema>;

// 3. AI Doctor Finder Output Schema
export const DoctorFinderSchema = z.object({
  specialty: z.string().describe("Recommended medical specialty"),
  confidence: z.number().min(0).max(1).describe("Matching confidence rating"),
  urgency: z.enum(["Routine", "Moderate", "Urgent", "Immediate Evaluation Needed"]),
  consultationMode: z.enum(["Online", "In-person", "Online or In-person"]),
  reason: z.string().describe("Explanation for specialty recommendation"),
  recommendedDoctors: z.array(z.string()).describe("Matching doctor IDs"),
});
export type DoctorFinderOutput = z.infer<typeof DoctorFinderSchema>;

// 4. AI Community Moderation Output Schema
export const CommunityModerationSchema = z.object({
  severity: z.enum(["None", "Low", "Medium", "High", "Critical"]),
  confidence: z.number().min(0).max(1),
  reason: z.string().describe("Moderation violation reason if any"),
  recommendedAction: z.enum(["Safe", "Needs Review", "Medical Misinformation", "Dangerous Advice", "Hide Automatically"]),
  appealable: z.boolean().default(true),
});
export type CommunityModerationOutput = z.infer<typeof CommunityModerationSchema>;
