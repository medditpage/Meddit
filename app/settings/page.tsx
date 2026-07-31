"use client";

// app/settings/page.tsx
// Complete Production Settings & Profile Manager covering all 47 schema columns of public.profiles

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import {
  User,
  ShieldCheck,
  Stethoscope,
  Clock,
  HeartPulse,
  PhoneCall,
  Award,
  Save,
  Edit3,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Globe,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [authUserId, setAuthUserId] = React.useState<string | null>(null);

  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // -------------------------------------------------------------
  // 1. BASIC PROFILE FIELDS (ALL USERS)
  // -------------------------------------------------------------
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [preferredLanguage, setPreferredLanguage] = React.useState("");
  const [languages, setLanguages] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);

  // Verification & Security
  const [aadhaarUrl, setAadhaarUrl] = React.useState("");
  const [cvUrl, setCvUrl] = React.useState("");
  const [uploadingAadhaar, setUploadingAadhaar] = React.useState(false);
  const [uploadingCV, setUploadingCV] = React.useState(false);

  // -------------------------------------------------------------
  // 2. DOCTOR CREDENTIALS & PRACTICE FIELDS (DOCTOR)
  // -------------------------------------------------------------
  const [specialization, setSpecialization] = React.useState("");
  const [hospital, setHospital] = React.useState("");
  const [professionalEmail, setProfessionalEmail] = React.useState("");
  const [consultingFee, setConsultingFee] = React.useState("");
  const [experienceYears, setExperienceYears] = React.useState("");
  const [mciNumber, setMciNumber] = React.useState("");
  const [availability, setAvailability] = React.useState("");

  // Availability Slots Manager
  const [availSlots, setAvailSlots] = React.useState<any[]>([]);
  const [savingAvailability, setSavingAvailability] = React.useState(false);
  const [availabilityMessage, setAvailabilityMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // -------------------------------------------------------------
  // 3. PATIENT HEALTH & ABHA DETAILS (PATIENT)
  // -------------------------------------------------------------
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [heightCm, setHeightCm] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [abhaNumber, setAbhaNumber] = React.useState("");
  const [insuranceProvider, setInsuranceProvider] = React.useState("");
  const [insurancePolicy, setInsurancePolicy] = React.useState("");
  const [seeDoctorMode, setSeeDoctorMode] = React.useState(false);

  // -------------------------------------------------------------
  // 4. PATIENT MEDICAL HISTORY (PATIENT)
  // -------------------------------------------------------------
  const [allergies, setAllergies] = React.useState("");
  const [currentMedications, setCurrentMedications] = React.useState("");
  const [medicalConditions, setMedicalConditions] = React.useState("");
  const [familyHistory, setFamilyHistory] = React.useState("");
  const [pastSurgeries, setPastSurgeries] = React.useState("");

  // -------------------------------------------------------------
  // 5. EMERGENCY CONTACT (ALL USERS)
  // -------------------------------------------------------------
  const [emergencyName, setEmergencyName] = React.useState("");
  const [emergencyPhone, setEmergencyPhone] = React.useState("");
  const [emergencyRelation, setEmergencyRelation] = React.useState("");

  // Populate state from DB row
  const populateForm = (data: any) => {
    setProfile(data);
    setName(data.name || "");
    const raw = data.username || "";
    const prefix = data.role === "doctor" ? "dr_" : "pt_";
    setUsername(raw.startsWith(prefix) ? raw : prefix + raw);
    setPhone(data.phone || "");
    setGender(data.gender || "");
    setAbout(data.about || "");
    setLocation(data.location || "");
    setPreferredLanguage(data.preferred_language || "");
    setLanguages(data.languages || "");
    setIsPublic(data.is_public ?? true);
    setAadhaarUrl(data.aadhaar_url || "");

    // Doctor
    setSpecialization(data.specialization || "");
    setHospital(data.hospital || "");
    setProfessionalEmail(data.professional_email || "");
    setConsultingFee(data.consulting_fee?.toString() || "");
    setExperienceYears(data.experience_years?.toString() || "");
    setMciNumber(data.mci_number || "");
    setAvailability(data.availability || "");
    setCvUrl(data.cv_url || "");

    // Patient
    setDateOfBirth(data.date_of_birth || "");
    setBloodGroup(data.blood_group || "");
    setHeightCm(data.height_cm?.toString() || "");
    setWeightKg(data.weight_kg?.toString() || "");
    setAbhaNumber(data.abha_number || "");
    setInsuranceProvider(data.insurance_provider || "");
    setInsurancePolicy(data.insurance_policy || "");
    setSeeDoctorMode(data.see_doctor_mode || false);

    // Medical History
    setAllergies(data.allergies || "");
    setCurrentMedications(data.current_medications || "");
    setMedicalConditions(data.medical_conditions || "");
    setFamilyHistory(data.family_history || "");
    setPastSurgeries(data.past_surgeries || "");

    // Emergency Contact
    setEmergencyName(data.emergency_contact_name || "");
    setEmergencyPhone(data.emergency_contact_phone || "");
    setEmergencyRelation(data.emergency_contact_relation || "");
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      setAuthUserId(authUser.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) console.error("Fetch profile error:", error);
      if (data) populateForm(data);

      if (data?.role === "doctor") {
        const { data: slots } = await supabase
          .from("doctor_availability")
          .select("*")
          .eq("doctor_id", authUser.id)
          .order("day_of_week", { ascending: true });
        if (slots) setAvailSlots(slots);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Completion calculation
  const calcCompletion = () => {
    const isDoc = profile?.role === "doctor";
    let filled = 0;
    let total = 0;

    const check = (val: any) => {
      total++;
      if (val !== null && val !== undefined && val !== "") filled++;
    };

    check(name);
    check(username);
    check(phone);
    check(gender);
    check(about);
    check(location);
    check(preferredLanguage);
    check(languages);
    check(aadhaarUrl);

    if (isDoc) {
      check(specialization);
      check(hospital);
      check(professionalEmail);
      check(consultingFee);
      check(experienceYears);
      check(mciNumber);
      check(cvUrl);
    } else {
      check(dateOfBirth);
      check(bloodGroup);
      check(heightCm);
      check(weightKg);
      check(abhaNumber);
      check(allergies);
      check(currentMedications);
      check(medicalConditions);
      check(emergencyName);
      check(emergencyPhone);
    }

    return Math.min(100, Math.round((filled / Math.max(1, total)) * 100));
  };

  const completion = calcCompletion();

  // BMI Calculation
  const bmi = React.useMemo(() => {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return (w / (h * h)).toFixed(1);
  }, [heightCm, weightKg]);

  const bmiCategory = (val: string | null) => {
    if (!val) return { label: "N/A", color: "text-slate-500" };
    const num = parseFloat(val);
    if (num < 18.5) return { label: "Underweight", color: "text-amber-500" };
    if (num < 25) return { label: "Normal weight", color: "text-emerald-500" };
    if (num < 30) return { label: "Overweight", color: "text-amber-500" };
    return { label: "Obese", color: "text-rose-500" };
  };

  // Upload Handlers
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cv_url" | "aadhaar_url"
  ) => {
    const file = e.target.files?.[0];
    if (!file || !authUserId) return;

    if (field === "cv_url") setUploadingCV(true);
    else setUploadingAadhaar(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filePath = `documents/${authUserId}/${field}_${Date.now()}.${ext}`;

    try {
      const { error: uploadErr } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      if (field === "cv_url") setCvUrl(publicUrl);
      else setAadhaarUrl(publicUrl);

      setMessage({
        type: "success",
        text: `${field === "cv_url" ? "CV/Resume PDF" : "Aadhaar Government ID"} uploaded successfully! Click Save Changes to apply.`,
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage({
        type: "error",
        text: `Upload failed: ${err.message || "Network error"}`,
      });
    } finally {
      setUploadingCV(false);
      setUploadingAadhaar(false);
    }
  };

  // Availability Slot Handlers
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const handleAddSlot = () => {
    setAvailSlots((prev) => [
      ...prev,
      {
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",
        slot_duration_minutes: 30,
        is_active: true,
      },
    ]);
  };

  const handleUpdateSlot = (index: number, field: string, value: any) => {
    setAvailSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleRemoveSlot = (index: number) => {
    setAvailSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    setSavingAvailability(true);
    setAvailabilityMessage(null);
    const supabase = createClient();

    try {
      await supabase.from("doctor_availability").delete().eq("doctor_id", authUserId);

      if (availSlots.length > 0) {
        const slotsToInsert = availSlots.map((slot) => ({
          doctor_id: authUserId,
          day_of_week: Number(slot.day_of_week),
          start_time: slot.start_time,
          end_time: slot.end_time,
          slot_duration_minutes: Number(slot.slot_duration_minutes),
          is_active: slot.is_active,
        }));

        const { error } = await supabase.from("doctor_availability").insert(slotsToInsert);
        if (error) throw error;
      }

      setAvailabilityMessage({
        type: "success",
        text: "Consultation availability schedule saved successfully!",
      });
    } catch (err: any) {
      setAvailabilityMessage({
        type: "error",
        text: err.message || "Failed to save availability.",
      });
    } finally {
      setSavingAvailability(false);
    }
  };

  // Save Full Profile
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    const isDoc = profile?.role === "doctor";
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

    const initials = name
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "M";

    const compVal = calcCompletion();

    const payload: any = {
      name,
      username: cleanUsername,
      phone,
      gender,
      about,
      location,
      preferred_language: preferredLanguage,
      languages,
      is_public: isPublic,
      aadhaar_url: aadhaarUrl || null,
      avatar_initials: initials,
      profile_completed: compVal,
    };

    if (isDoc) {
      payload.specialization = specialization;
      payload.hospital = hospital;
      payload.professional_email = professionalEmail;
      payload.consulting_fee = consultingFee ? consultingFee : null;
      payload.experience_years = experienceYears ? parseInt(experienceYears) : 0;
      payload.mci_number = mciNumber;
      payload.availability = availability;
      payload.cv_url = cvUrl || null;
    } else {
      payload.date_of_birth = dateOfBirth || null;
      payload.blood_group = bloodGroup || null;
      payload.allergies = allergies || null;
      payload.current_medications = currentMedications || null;
      payload.medical_conditions = medicalConditions || null;
      payload.see_doctor_mode = seeDoctorMode;
      payload.height_cm = heightCm ? parseFloat(heightCm) : null;
      payload.weight_kg = weightKg ? parseFloat(weightKg) : null;
      payload.abha_number = abhaNumber || null;
      payload.insurance_provider = insuranceProvider || null;
      payload.insurance_policy = insurancePolicy || null;
      payload.family_history = familyHistory || null;
      payload.past_surgeries = pastSurgeries || null;
      payload.emergency_contact_name = emergencyName || null;
      payload.emergency_contact_phone = emergencyPhone || null;
      payload.emergency_contact_relation = emergencyRelation || null;
    }

    const { error } = await supabase.from("profiles").update(payload).eq("id", authUserId);

    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
      setProfile({ ...profile, ...payload });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-slate-500 text-xs animate-pulse">
          Loading profile parameters...
        </div>
      </DashboardLayout>
    );
  }

  const isDoctor = profile?.role === "doctor";
  const isVerified = profile?.is_verified || profile?.verification_status === "approved";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-12">
        {/* Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
              {profile?.avatar_initials || name?.substring(0, 2).toUpperCase() || "M"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {name || "User Profile"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700 capitalize">
                  {profile?.role || "patient"}
                </span>

                {/* Verification Status Badge */}
                {isVerified ? (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Practitioner
                  </span>
                ) : profile?.verification_status === "rejected" ? (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Verification Rejected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Verification Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">
                @{profile?.username || "username"} • Member since {new Date(profile?.created_at || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (editMode) handleSave();
              else setEditMode(true);
            }}
            disabled={saving}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
          >
            {editMode ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Profile Completion Index</span>
            <span className="text-teal-600 dark:text-teal-400">{completion}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300"
                : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: BASIC PROFILE INFORMATION */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Basic Profile Information</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Public Profile Visibility:</span>
              <button
                onClick={() => editMode && setIsPublic(!isPublic)}
                disabled={!editMode}
                className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  isPublic
                    ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isPublic ? "Publicly Visible" : "Private"}</span>
              </button>
            </div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Full Name *</label>
              <input
                type="text"
                disabled={!editMode}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Username (@handle)</label>
              <input
                type="text"
                disabled={!editMode}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                disabled={!editMode}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Gender</label>
              <select
                disabled={!editMode}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Location / Address</label>
              <input
                type="text"
                disabled={!editMode}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State, Country"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Preferred Spoken Language</label>
              <input
                type="text"
                disabled={!editMode}
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                placeholder="e.g. English, Hindi"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">All Spoken Languages</label>
              <input
                type="text"
                disabled={!editMode}
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. English, Hindi, Marathi, Tamil"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-xs">Bio / Healthcare Summary</label>
            <textarea
              disabled={!editMode}
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell patients or doctors about your health background..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: IDENTITY VERIFICATION & AADHAAR (BOTH ROLES) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Government Identity Verification (Aadhaar)</span>
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
              profile?.aadhaar_verified || aadhaarUrl
                ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
            }`}>
              {profile?.aadhaar_verified || aadhaarUrl ? "Aadhaar Uploaded" : "Aadhaar Required"}
            </span>
          </h2>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Aadhaar Government ID Document</p>
              <p className="text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                Upload front/back Aadhaar card copy or PDF for verified account status.
              </p>
              {aadhaarUrl && (
                <a
                  href={aadhaarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium hover:underline mt-2"
                >
                  <FileText className="w-3.5 h-3.5" /> View Uploaded Aadhaar Document
                </a>
              )}
            </div>

            {editMode && (
              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg cursor-pointer text-xs font-medium hover:bg-teal-700 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingAadhaar ? "Uploading..." : "Upload Aadhaar ID"}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, "aadhaar_url")}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: DOCTOR CREDENTIALS & CV UPLOAD (DOCTOR ONLY) */}
        {/* ------------------------------------------------------------- */}
        {isDoctor && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Doctor Credentials & Clinical CV / Resume</span>
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                profile?.verification_status === "approved"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                  : profile?.verification_status === "rejected"
                  ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                Medical Board Verification: {profile?.verification_status || "Pending"}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Medical Specialization</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Cardiologist, Neurologist"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Hospital / Clinic Affiliation</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. AIIMS Delhi, Apollo Hospital"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Professional Email</label>
                <input
                  type="email"
                  disabled={!editMode}
                  value={professionalEmail}
                  onChange={(e) => setProfessionalEmail(e.target.value)}
                  placeholder="dr.name@hospital.org"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">MCI / State Medical License No.</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={mciNumber}
                  onChange={(e) => setMciNumber(e.target.value)}
                  placeholder="MCI-12345-REG"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Consultation Fee (₹)</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={consultingFee}
                  onChange={(e) => setConsultingFee(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Years of Clinical Experience</label>
                <input
                  type="number"
                  disabled={!editMode}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Doctor CV / Resume PDF Upload Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-2">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Doctor Curriculum Vitae (CV / Resume PDF)</p>
                <p className="text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Required for Medical Board verification and patient discovery credentials.
                </p>
                {cvUrl && (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium hover:underline mt-2"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Uploaded CV PDF
                  </a>
                )}
              </div>

              {editMode && (
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg cursor-pointer text-xs font-medium hover:bg-teal-700 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingCV ? "Uploading..." : "Upload Doctor CV PDF"}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, "cv_url")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: DOCTOR AVAILABILITY SLOTS (DOCTOR ONLY) */}
        {/* ------------------------------------------------------------- */}
        {isDoctor && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Consultation Availability Slots</span>
              </h2>
              <button
                onClick={handleAddSlot}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                + Add Time Slot
              </button>
            </div>

            {availSlots.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No availability slots configured yet.</p>
            ) : (
              <div className="space-y-3">
                {availSlots.map((slot, index) => (
                  <div key={index} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Day</label>
                        <select
                          value={slot.day_of_week}
                          onChange={(e) => handleUpdateSlot(index, "day_of_week", e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-medium"
                        >
                          {dayNames.map((d, i) => (
                            <option key={d} value={i}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Start Time</label>
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => handleUpdateSlot(index, "start_time", e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">End Time</label>
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => handleUpdateSlot(index, "end_time", e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-medium"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => handleUpdateSlot(index, "is_active", !slot.is_active)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            slot.is_active
                              ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                              : "bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {slot.is_active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => handleRemoveSlot(index)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {availabilityMessage && (
              <div className={`p-3 rounded-lg font-medium border ${availabilityMessage.type === "success" ? "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300" : "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"}`}>
                {availabilityMessage.text}
              </div>
            )}

            <button
              onClick={handleSaveAvailability}
              disabled={savingAvailability}
              className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 border border-slate-800 text-white font-medium text-xs rounded-lg transition-colors"
            >
              {savingAvailability ? "Saving Schedule..." : "Save Availability Slots"}
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: PATIENT HEALTH PROFILE & ABHA DETAILS (PATIENT) */}
        {/* ------------------------------------------------------------- */}
        {!isDoctor && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Patient Health Profile & ABHA Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Date of Birth</label>
                <input
                  type="date"
                  disabled={!editMode}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Blood Group</label>
                <select
                  disabled={!editMode}
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Height (cm)</label>
                <input
                  type="number"
                  disabled={!editMode}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Weight (kg)</label>
                <input
                  type="number"
                  disabled={!editMode}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="70"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">ABHA Health Number</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={abhaNumber}
                  onChange={(e) => setAbhaNumber(e.target.value)}
                  placeholder="12-3456-7890-1234"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Insurance Provider & Policy</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!editMode}
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    placeholder="Provider Name"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                  />
                  <input
                    type="text"
                    disabled={!editMode}
                    value={insurancePolicy}
                    onChange={(e) => setInsurancePolicy(e.target.value)}
                    placeholder="Policy No."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {bmi && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Calculated Body Mass Index (BMI):</span>
                <span className={`font-bold ${bmiCategory(bmi).color}`}>
                  {bmi} ({bmiCategory(bmi).label})
                </span>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 6: PATIENT MEDICAL HISTORY (PATIENT) */}
        {/* ------------------------------------------------------------- */}
        {!isDoctor && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Medical History & Clinical Background</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Known Allergies</label>
                <textarea
                  disabled={!editMode}
                  rows={2}
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Dust"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Current Medications</label>
                <textarea
                  disabled={!editMode}
                  rows={2}
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="e.g. Metformin 500mg daily"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Chronic Medical Conditions</label>
                <textarea
                  disabled={!editMode}
                  rows={2}
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Asthma"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Past Surgeries / Procedures</label>
                <textarea
                  disabled={!editMode}
                  rows={2}
                  value={pastSurgeries}
                  onChange={(e) => setPastSurgeries(e.target.value)}
                  placeholder="e.g. Appendectomy (2020)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-xs">Family Health History</label>
              <textarea
                disabled={!editMode}
                rows={2}
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
                placeholder="e.g. History of Type 2 Diabetes (Father)"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-60"
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 7: EMERGENCY CONTACT INFORMATION */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Emergency Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Contact Name</label>
              <input
                type="text"
                disabled={!editMode}
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Full Contact Name"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Relationship</label>
              <input
                type="text"
                disabled={!editMode}
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                placeholder="e.g. Spouse, Parent, Sibling"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Emergency Phone</label>
              <input
                type="text"
                disabled={!editMode}
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 8: SYSTEM STATS & ACCOUNT STATUS (READ ONLY) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Account Stats & Reliability Metrics</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Reliability Score</span>
              <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                {profile?.reliability_rating || "5.0"} ★
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Consultations</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {profile?.consulting_count || 0}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Success Rate</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {profile?.success_count || 0}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Account Status</span>
              <span className="text-xs font-semibold text-teal-600 capitalize block mt-1">
                {profile?.account_status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 9: ACCOUNT SECURITY & SESSION MANAGEMENT (PROFESSIONAL SIGN OUT) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Account Security & Session Management</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                Manage active authentication session and security preferences for this device.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Active Session Sign Out</p>
              <p className="text-slate-500 dark:text-slate-400 font-normal">Safely end active session on this device</p>
            </div>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
