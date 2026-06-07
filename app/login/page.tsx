

"use client";


import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

// ADD THIS AT THE TOP
console.log("Checking Supabase Environment:");
console.log("URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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
    setError,
    watch,
    setValue,
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

  // --- STEP 1: SUBMIT CREDENTIALS ---
  const onSubmitCredentials = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    setAuthError("");
    const supabase = createClient();

    try {
      if (isSignUp) {
        let hasError = false;
        if (!data.name || data.name.trim() === "") {
          setError("name", {
            type: "manual",
            message: "Full Name is required.",
          });
          hasError = true;
        }
        if (!data.phone || data.phone.trim() === "") {
          setError("phone", {
            type: "manual",
            message: "Mobile Number is required.",
          });
          hasError = true;
        }
        if (hasError) {
          setIsAuthenticating(false);
          return;
        }

        // Send Registration & Trigger OTP
        
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
              phone: data.phone,
              role: data.role, // Passes the exact role!
            },
          },
        });

        if (error) throw error;

        // Pause the flow and show the OTP screen!
        setUnverifiedEmail(data.email);
        setStep("OTP");
      } else {
        // Normal Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        router.push("/");
      }
    } catch (error: any) {
      console.error("Full Auth Error:", error);
      // If error.message is missing, force it to read the object or show a fallback
      if (typeof error === "object" && Object.keys(error).length === 0) {
        setAuthError(
          "Registration blocked: This email may already exist, or the mail server rejected it.",
        );
      } else {
        setAuthError(error?.message || JSON.stringify(error));
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: unverifiedEmail,
        token: otpCode,
        type: "signup", // Validates the 6-digit code
      });

      if (error) throw error;

      // OTP Success! Now they are officially allowed into the app.
      router.push("/");
    } catch (error: any) {
      setAuthError("Invalid or expired verification code.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Branding Panel (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-teal-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-slate-900 opacity-90" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-white">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight">Medit</span>
        </div>
        <div className="relative z-10 max-w-lg mb-20">
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Clinical intelligence, simplified.
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed mb-8">
            Connect securely with your healthcare providers or manage your
            medical practice end-to-end.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* OTP VERIFICATION VIEW */}
          {step === "OTP" ? (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Verify your account
                </h2>
                <p className="text-slate-500">
                  We sent a 6-digit secure verification code to{" "}
                  <span className="font-semibold text-slate-900">
                    {unverifiedEmail}
                  </span>
                  .
                </p>
              </div>

              {authError && (
                <div className="p-3 text-sm font-medium text-red-800 bg-red-100 rounded-lg">
                  {authError}
                </div>
              )}

              <form onSubmit={onVerifyOtp} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 tracking-widest text-center text-2xl font-semibold"
                    placeholder="000000"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 mt-4"
                  disabled={isAuthenticating || otpCode.length !== 6}
                >
                  {isAuthenticating ? "Verifying..." : "Confirm & Enter App"}
                </Button>
              </form>
            </div>
          ) : (
            /* CREDENTIALS VIEW */
            <div className="animate-in fade-in slide-in-from-left-4 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {isSignUp ? "Create an account" : "Welcome back"}
                </h2>
                <p className="text-slate-500">
                  Please enter your details to continue.
                </p>
              </div>

              {authError && (
                <div className="p-3 text-sm font-medium text-red-800 bg-red-100 rounded-lg">
                  {authError}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmitCredentials)}
                className="space-y-5"
              >
                {isSignUp && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                    {/* ROLE SELECTOR */}
                    <div className="p-1 bg-slate-100 rounded-lg flex gap-1">
                      <button
                        type="button"
                        onClick={() => setValue("role", "patient")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === "patient" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        I am a Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue("role", "doctor")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === "doctor" ? "bg-white shadow-sm text-teal-700" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        I am a Doctor
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">
                        Exact Full Name
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder={
                          selectedRole === "doctor"
                            ? "Dr. Sarah Chen"
                            : "Sarah Chen"
                        }
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 mt-4"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating
                    ? "Processing..."
                    : isSignUp
                      ? "Send Verification Code"
                      : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-teal-600 font-semibold hover:underline"
                >
                  {isSignUp ? "Sign In" : "Create one now"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
