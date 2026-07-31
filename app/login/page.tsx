"use client";

// app/login/page.tsx
// Meddit Universal Authentication & OTP Workspace (Universal Theme Support)

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const loginSchema = z.object({
  role: z.enum(["doctor", "patient"]).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [authError, setAuthError] = React.useState("");

  // REAL-WORLD OTP STATE
  const [step, setStep] = React.useState<"CREDENTIALS" | "OTP">("CREDENTIALS");
  const [otpCode, setOtpCode] = React.useState("");
  const [unverifiedEmail, setUnverifiedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      role: "patient",
    },
  });

  const selectedRole = watch("role");

  // STEP 1: SUBMIT CREDENTIALS
  const onSubmitCredentials = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    setAuthError("");
    const supabase = createClient();

    try {
      if (isSignUp) {
        const initials = data.name
          ? data.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "PT";

        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name || (data.role === "doctor" ? "Dr. Specialist" : "Patient"),
              role: data.role || "patient",
              avatar_initials: initials,
              phone: data.phone || "",
            },
          },
        });

        if (error) {
          setAuthError(error.message);
          setIsAuthenticating(false);
          return;
        }

        if (signUpData.session) {
          router.push("/dashboard");
          return;
        }

        setUnverifiedEmail(data.email);
        setStep("OTP");
        setIsAuthenticating(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          setAuthError(error.message);
          setIsAuthenticating(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Auth Exception:", err);
      setAuthError(err instanceof Error ? err.message : "Authentication error");
      setIsAuthenticating(false);
    }
  };

  // STEP 2: VERIFY OTP
  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) return;

    setIsAuthenticating(true);
    setAuthError("");
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: unverifiedEmail,
        token: otpCode,
        type: "signup",
      });

      if (error) {
        setAuthError(error.message);
        setIsAuthenticating(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "OTP Verification failed");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative selection:bg-teal-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Floating Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => router.push("/")}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
          m/
        </div>
        <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">meddit</span>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-colors">
        {step === "OTP" ? (
          /* OTP VERIFICATION VIEW */
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Verify your email</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                We sent a 6-digit security code to{" "}
                <span className="font-bold text-teal-600 dark:text-teal-300">{unverifiedEmail}</span>.
              </p>
            </div>

            {authError && (
              <div className="p-3 text-xs font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={onVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xl font-mono font-extrabold tracking-widest text-teal-600 dark:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || otpCode.length !== 6}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-extrabold text-xs rounded-full transition-all shadow-xs"
              >
                {isAuthenticating ? "Verifying..." : "Confirm & Enter Meddit Workspace"}
              </button>
            </form>
          </div>
        ) : (
          /* CREDENTIALS VIEW */
          <div className="space-y-6 animate-in fade-in">
            <div className="space-y-1 text-center">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {isSignUp ? "Join Meddit Healthcare" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isSignUp ? "Create your verified patient or doctor account." : "Access your encrypted medical workspace."}
              </p>
            </div>

            {authError && (
              <div className="p-3 text-xs font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-4">
              {isSignUp && (
                <div className="space-y-4">
                  {/* Role Selector */}
                  <div className="p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-1">
                    <button
                      type="button"
                      onClick={() => setValue("role", "patient")}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                        selectedRole === "patient"
                          ? "bg-white dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-teal-500/40 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      👤 Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "doctor")}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                        selectedRole === "doctor"
                          ? "bg-white dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-teal-500/40 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      👨‍⚕️ Doctor
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Dr. Ananya Rao or Rohan Verma"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      {...register("phone")}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-1">Password *</label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.password && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-extrabold text-xs rounded-full transition-all shadow-xs"
              >
                {isAuthenticating ? "Authenticating..." : isSignUp ? "Create Account & Send Code" : "Sign In to Meddit"}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError("");
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold transition-colors"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
