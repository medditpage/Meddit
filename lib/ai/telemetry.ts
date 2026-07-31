// lib/ai/telemetry.ts
// AI Observability & Telemetry Logger for model tracking, token metrics, latency, and fallback events

export interface AITelemetryEvent {
  feature: string;
  model: string;
  provider: string;
  latencyMs: number;
  tokensUsed?: number;
  estimatedCost?: number;
  retryCount?: number;
  fallbackTriggered?: boolean;
  success: boolean;
  error?: string;
  timestamp: string;
}

export function logAITelemetry(event: AITelemetryEvent): void {
  const logPayload = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[AI Telemetry] ${logPayload.feature} | Model: ${logPayload.model} (${logPayload.provider}) | Latency: ${logPayload.latencyMs}ms | Tokens: ${logPayload.tokensUsed || 0} | Success: ${logPayload.success}`
    );
    if (logPayload.fallbackTriggered) {
      console.warn(`[AI Telemetry Warning] Fallback triggered for feature ${logPayload.feature}`);
    }
  }
}
