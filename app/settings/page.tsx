"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";

const PencilIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ViewField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-slate-900 font-medium text-sm">
      {value || (
        <span className="text-slate-300 font-normal italic">Not set</span>
      )}
    </p>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: any) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
    />
  </div>
);

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);

  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [uploadingAadhaar, setUploadingAadhaar] = React.useState(false);
  const [uploadingCV, setUploadingCV] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [authUserId, setAuthUserId] = React.useState<string | null>(null);

  // Common
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [preferredLanguage, setPreferredLanguage] = React.useState("");

  // Doctor
  const [specialization, setSpecialization] = React.useState("");
  const [hospital, setHospital] = React.useState("");
  const [professionalEmail, setProfessionalEmail] = React.useState("");
  const [consultingFee, setConsultingFee] = React.useState("");
  const [experienceYears, setExperienceYears] = React.useState("");
  const [languages, setLanguages] = React.useState("");
  const [mciNumber, setMciNumber] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);
  const [cvUrl, setCvUrl] = React.useState("");
  const [aadhaarUrl, setAadhaarUrl] = React.useState("");

  // Patient
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [allergies, setAllergies] = React.useState("");
  const [currentMedications, setCurrentMedications] = React.useState("");
  const [medicalConditions, setMedicalConditions] = React.useState("");
  const [seeDoctorMode, setSeeDoctorMode] = React.useState(false);
  const [heightCm, setHeightCm] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [abhaNumber, setAbhaNumber] = React.useState("");
  const [insuranceProvider, setInsuranceProvider] = React.useState("");
  const [insurancePolicy, setInsurancePolicy] = React.useState("");
  const [familyHistory, setFamilyHistory] = React.useState("");
  const [pastSurgeries, setPastSurgeries] = React.useState("");
  const [emergencyName, setEmergencyName] = React.useState("");
  const [emergencyPhone, setEmergencyPhone] = React.useState("");
  const [emergencyRelation, setEmergencyRelation] = React.useState("");
  const [patientAadhaarUrl, setPatientAadhaarUrl] = React.useState("");

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
    setSpecialization(data.specialization || "");
    setHospital(data.hospital || "");
    setProfessionalEmail(data.professional_email || "");
    setConsultingFee(data.consulting_fee || "");
    setExperienceYears(data.experience_years?.toString() || "");
    setLanguages(data.languages || "");
    setMciNumber(data.mci_number || "");
    setAvailability(data.availability || "");
    setIsPublic(data.is_public ?? true);
    setCvUrl(data.cv_url || "");
    setAadhaarUrl(data.aadhaar_url || "");
    setDateOfBirth(data.date_of_birth || "");
    setBloodGroup(data.blood_group || "");
    setAllergies(data.allergies || "");
    setCurrentMedications(data.current_medications || "");
    setMedicalConditions(data.medical_conditions || "");
    setSeeDoctorMode(data.see_doctor_mode || false);
    setHeightCm(data.height_cm?.toString() || "");
    setWeightKg(data.weight_kg?.toString() || "");
    setAbhaNumber(data.abha_number || "");
    setInsuranceProvider(data.insurance_provider || "");
    setInsurancePolicy(data.insurance_policy || "");
    setFamilyHistory(data.family_history || "");
    setPastSurgeries(data.past_surgeries || "");
    setEmergencyName(data.emergency_contact_name || "");
    setEmergencyPhone(data.emergency_contact_phone || "");
    setEmergencyRelation(data.emergency_contact_relation || "");
    setPatientAadhaarUrl(data.aadhaar_url || "");
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
      if (error) console.error("Fetch error:", error);
      if (data) populateForm(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Calculate BMI
  const bmi = React.useMemo(() => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!h || !w) return null;
    const bmiVal = w / ((h / 100) * (h / 100));
    return bmiVal.toFixed(1);
  }, [heightCm, weightKg]);

  const bmiCategory = (bmi: string) => {
    const b = parseFloat(bmi);
    if (b < 18.5) return { label: "Underweight", color: "text-blue-600" };
    if (b < 25) return { label: "Normal", color: "text-teal-600" };
    if (b < 30) return { label: "Overweight", color: "text-amber-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  // Calculate profile completion
  const calcCompletion = () => {
    const isDoctor = profile?.role === "doctor";
    const fields = isDoctor
      ? [
          name,
          specialization,
          hospital,
          mciNumber,
          consultingFee,
          experienceYears,
          languages,
          aadhaarUrl,
          cvUrl,
          about,
        ]
      : [
          name,
          dateOfBirth,
          bloodGroup,
          emergencyName,
          emergencyPhone,
          patientAadhaarUrl,
          allergies,
          currentMedications,
          heightCm,
          weightKg,
        ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = profile ? calcCompletion() : 0;

  const getFileUrl = async (path: string) => {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(path, 3600);
    return data?.signedUrl;
  };

  const handleViewFile = async (path: string) => {
    const url = await getFileUrl(path);
    if (url) window.open(url, "_blank");
  };

  const uploadFile = async (
    file: File,
    folder: string,
    onSuccess: (path: string) => void,
    setUploading: (v: boolean) => void,
  ) => {
    if (!authUserId) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${authUserId}/${folder}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: true });
    if (!error) onSuccess(path);
    else console.error("Upload error:", error);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!authUserId) return;
    setSaving(true);
    setMessage(null);
    const supabase = createClient(); 

    // ← YE ADD KARO YAHAN
    if (username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", authUserId)
        .single();

      if (existing) {
        setMessage({
          type: "error",
          text: "Username already taken. Try another.",
        });
        setSaving(false);
        return;
      }
    }
    const isDoctor = profile?.role === "doctor";

    const avatarInitials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const updateData: any = {
      name,
      username: username || null,
      gender,
      about,
      location,
      avatar_initials: avatarInitials,
      preferred_language: preferredLanguage,
    };

    if (isDoctor) {
      Object.assign(updateData, {
        specialization,
        hospital,
        professional_email: professionalEmail,
        consulting_fee: consultingFee,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        languages,
        mci_number: mciNumber,
        availability,
        is_public: isPublic,
        cv_url: cvUrl || null,
        aadhaar_url: aadhaarUrl || null,
      });
    } else {
      Object.assign(updateData, {
        date_of_birth: dateOfBirth || null,
        blood_group: bloodGroup,
        allergies,
        current_medications: currentMedications,
        medical_conditions: medicalConditions,
        see_doctor_mode: seeDoctorMode,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        abha_number: abhaNumber,
        insurance_provider: insuranceProvider,
        insurance_policy: insurancePolicy,
        family_history: familyHistory,
        past_surgeries: pastSurgeries,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
        emergency_contact_relation: emergencyRelation,
        aadhaar_url: patientAadhaarUrl || null,
        aadhaar_verified: !!patientAadhaarUrl,
      });
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", authUserId);

    if (error) {
      console.error("Save error:", JSON.stringify(error));
      setMessage({ type: "error", text: "Failed to save: " + error.message });
    } else {
      if (user?.id)
        login({
          id: user.id,
          name,
          role: profile?.role || "doctor",
          avatarInitials,
        });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
      // Refresh profile
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUserId)
        .single();
      if (data) populateForm(data);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const isDoctor = profile?.role === "doctor";

  // File upload card component
  const FileCard = ({
    label,
    url,
    uploading,
    onUpload,
    onRemove,
    accept,
  }: {
    label: string;
    url: string;
    uploading: boolean;
    onUpload: (f: File) => void;
    onRemove: () => void;
    accept: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {url ? (
        <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
          <span className="text-2xl">📄</span>
          <div className="flex-1 min-w-0">
            <p className="text-teal-700 text-sm font-semibold">
              ✅ File uploaded
            </p>
            <p className="text-teal-500 text-xs truncate">
              {url.split("/").pop()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handleViewFile(url)}
              className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              👁 View
            </button>
            {editMode && (
              <button
                onClick={onRemove}
                className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : editMode ? (
        <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
          <span className="text-2xl">📤</span>
          <span className="text-sm text-slate-500 font-medium">
            {uploading ? "Uploading..." : `Click to upload ${label}`}
          </span>
          <span className="text-xs text-slate-400">PDF, JPG, PNG accepted</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
        </label>
      ) : (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium">
            ⚠️ Not uploaded — required for verification
          </p>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Profile Settings
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {isDoctor
                ? "Your professional doctor profile"
                : "Your patient health profile"}
            </p>
          </div>
          <button
            onClick={() => {
              setEditMode(!editMode);
              setMessage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              editMode
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            <PencilIcon />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Role + Verification Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              isDoctor
                ? "bg-teal-50 text-teal-700 border border-teal-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {isDoctor ? "👨‍⚕️ Doctor Account" : "🏥 Patient Account"}
            {profile?.is_verified && (
              <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
                ✓ Verified
              </span>
            )}
          </div>
          {!profile?.is_verified && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              ⏳ Verification Pending — Upload documents to get verified
            </div>
          )}
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">
              Profile Completion
            </p>
            <p className="text-sm font-bold text-teal-600">{completion}%</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {completion < 100
              ? `Fill in all fields to reach 100% and get verified faster`
              : "🎉 Profile is complete!"}
          </p>
        </div>

        {/* Avatar Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-2xl border border-teal-200 shrink-0">
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "?"}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">
              {name || "Your Name"}
            </p>
            <p className="text-teal-600 text-sm font-medium">
              {isDoctor
                ? specialization || "Specialization not set"
                : "Patient"}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              @{username || "username"} • ⭐{" "}
              {profile?.reliability_rating || "0.0"}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Basic Information
          </h2>
          {editMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name *"
                  value={name}
                  onChange={setName}
                  placeholder={isDoctor ? "Dr. Arjun Mehta" : "Rahul Sharma"}
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500">
                    <span className="px-3 py-2.5 bg-slate-100 text-slate-500 text-sm font-semibold border-r border-slate-200 shrink-0">
                      {isDoctor ? "dr_" : "pt_"}
                    </span>
                    <input
                      type="text"
                      value={username.replace(/^(dr_|pt_)/, "")}
                      onChange={(e) => {
                        const prefix = isDoctor ? "dr_" : "pt_";
                        const val = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, "");
                        setUsername(prefix + val);
                      }}
                      placeholder="your_name"
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      🔒 Locked
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  placeholder="Kanpur, UP"
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Preferred Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Select</option>
                    {[
                      "Hindi",
                      "English",
                      "Tamil",
                      "Telugu",
                      "Bengali",
                      "Marathi",
                      "Gujarati",
                      "Kannada",
                      "Malayalam",
                      "Punjabi",
                    ].map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <TextAreaField
                label="About"
                value={about}
                onChange={setAbout}
                placeholder={
                  isDoctor
                    ? "Describe your specialty and approach..."
                    : "Tell us about yourself..."
                }
                rows={3}
              />
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ViewField label="Full Name" value={name} />
              <ViewField
                label="Username"
                value={username ? `@${username}` : ""}
              />
              <ViewField label="Gender" value={gender} />
              <ViewField label="Phone" value={phone} />
              <ViewField label="Location" value={location} />
              <ViewField label="Preferred Language" value={preferredLanguage} />
              <div className="md:col-span-2">
                <ViewField label="About" value={about} />
              </div>
            </div>
          )}
        </div>

        {/* DOCTOR FIELDS */}
        {isDoctor && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Professional Information
              </h2>
              {editMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Specialization *"
                      value={specialization}
                      onChange={setSpecialization}
                      placeholder="Cardiologist"
                    />
                    <InputField
                      label="MCI/NMC Registration No. *"
                      value={mciNumber}
                      onChange={setMciNumber}
                      placeholder="MCI-12345"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Experience (Years)"
                      value={experienceYears}
                      onChange={setExperienceYears}
                      placeholder="10"
                      type="number"
                    />
                    <InputField
                      label="Consulting Fee (₹)"
                      value={consultingFee}
                      onChange={setConsultingFee}
                      placeholder="500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Hospital / Clinic"
                      value={hospital}
                      onChange={setHospital}
                      placeholder="AIIMS Delhi"
                    />
                    <InputField
                      label="Professional Email"
                      value={professionalEmail}
                      onChange={setProfessionalEmail}
                      placeholder="doctor@hospital.com"
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Languages Spoken
                      </label>
                      <select
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="">Select Primary</option>
                        {[
                          "Hindi",
                          "English",
                          "Hindi + English",
                          "Tamil",
                          "Telugu",
                          "Bengali",
                          "Marathi",
                          "Gujarati",
                          "Kannada",
                          "Malayalam",
                        ].map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Availability"
                      value={availability}
                      onChange={setAvailability}
                      placeholder="Mon-Sat, 10am-6pm"
                    />
                  </div>
                  {/* Profile Visibility */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-colors ${isPublic ? "border-teal-400 bg-teal-50" : "border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          Public Profile
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Patients can find and view your profile
                        </p>
                      </div>
                      <button
                        onClick={() => setIsPublic(!isPublic)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? "bg-teal-600" : "bg-slate-300"}`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isPublic ? "left-6" : "left-0.5"}`}
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ViewField label="Specialization" value={specialization} />
                  <ViewField label="MCI/NMC Number" value={mciNumber} />
                  <ViewField
                    label="Experience"
                    value={experienceYears ? `${experienceYears} years` : ""}
                  />
                  <ViewField
                    label="Consulting Fee"
                    value={consultingFee ? `₹${consultingFee}` : ""}
                  />
                  <ViewField label="Hospital / Clinic" value={hospital} />
                  <ViewField
                    label="Professional Email"
                    value={professionalEmail}
                  />
                  <ViewField label="Languages" value={languages} />
                  <ViewField label="Availability" value={availability} />
                  <ViewField
                    label="Profile Visibility"
                    value={isPublic ? "🌐 Public" : "🔒 Private"}
                  />
                </div>
              )}
            </div>

            {/* Doctor Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Verification Documents{" "}
                <span className="text-xs font-normal text-red-500">
                  * Required
                </span>
              </h2>
              <FileCard
                label="Aadhaar Card *"
                url={aadhaarUrl}
                uploading={uploadingAadhaar}
                onUpload={(f) =>
                  uploadFile(f, "aadhaar", setAadhaarUrl, setUploadingAadhaar)
                }
                onRemove={() => setAadhaarUrl("")}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileCard
                label="Resume / CV *"
                url={cvUrl}
                uploading={uploadingCV}
                onUpload={(f) => uploadFile(f, "cv", setCvUrl, setUploadingCV)}
                onRemove={() => setCvUrl("")}
                accept=".pdf"
              />
            </div>
          </>
        )}

        {/* PATIENT FIELDS */}
        {!isDoctor && (
          <>
            {/* Health Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Health Information
              </h2>
              {editMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Date of Birth"
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                      placeholder=""
                      type="date"
                    />
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        <option value="">Select</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                  {/* Height Weight BMI */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="Height (cm)"
                      value={heightCm}
                      onChange={setHeightCm}
                      placeholder="170"
                      type="number"
                    />
                    <InputField
                      label="Weight (kg)"
                      value={weightKg}
                      onChange={setWeightKg}
                      placeholder="70"
                      type="number"
                    />
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        BMI (Auto)
                      </label>
                      <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                        {bmi ? (
                          <span
                            className={`font-bold ${bmiCategory(bmi).color}`}
                          >
                            {bmi} — {bmiCategory(bmi).label}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Enter height & weight
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <TextAreaField
                    label="Known Allergies"
                    value={allergies}
                    onChange={setAllergies}
                    placeholder="e.g. Penicillin, Dust"
                  />
                  <TextAreaField
                    label="Current Medications"
                    value={currentMedications}
                    onChange={setCurrentMedications}
                    placeholder="e.g. Amlodipine 5mg"
                  />
                  <TextAreaField
                    label="Medical Conditions"
                    value={medicalConditions}
                    onChange={setMedicalConditions}
                    placeholder="e.g. Type 2 Diabetes"
                  />
                  <TextAreaField
                    label="Family Medical History"
                    value={familyHistory}
                    onChange={setFamilyHistory}
                    placeholder="e.g. Father: Diabetes, Mother: BP"
                  />
                  <TextAreaField
                    label="Past Surgeries / Hospitalizations"
                    value={pastSurgeries}
                    onChange={setPastSurgeries}
                    placeholder="e.g. Appendectomy 2018"
                  />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ViewField label="Date of Birth" value={dateOfBirth} />
                  <ViewField label="Blood Group" value={bloodGroup} />
                  <ViewField
                    label="Height"
                    value={heightCm ? `${heightCm} cm` : ""}
                  />
                  <ViewField
                    label="Weight"
                    value={weightKg ? `${weightKg} kg` : ""}
                  />
                  {bmi && (
                    <ViewField
                      label="BMI"
                      value={`${bmi} — ${bmiCategory(bmi).label}`}
                    />
                  )}
                  <ViewField label="Known Allergies" value={allergies} />
                  <ViewField
                    label="Current Medications"
                    value={currentMedications}
                  />
                  <ViewField
                    label="Medical Conditions"
                    value={medicalConditions}
                  />
                  <ViewField label="Family History" value={familyHistory} />
                  <ViewField label="Past Surgeries" value={pastSurgeries} />
                </div>
              )}

              {/* See Doctor Mode */}
              <div
                className={`p-4 rounded-xl border-2 transition-colors ${seeDoctorMode ? "border-teal-400 bg-teal-50" : "border-slate-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      See Doctor Mode
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Platform manages your complete medical data during
                      consultation
                    </p>
                  </div>
                  <button
                    onClick={() => editMode && setSeeDoctorMode(!seeDoctorMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${seeDoctorMode ? "bg-teal-600" : "bg-slate-300"} ${!editMode ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${seeDoctorMode ? "left-6" : "left-0.5"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Insurance + ABHA */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Insurance & Health ID
              </h2>
              {editMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Insurance Provider"
                      value={insuranceProvider}
                      onChange={setInsuranceProvider}
                      placeholder="Star Health, LIC"
                    />
                    <InputField
                      label="Policy Number"
                      value={insurancePolicy}
                      onChange={setInsurancePolicy}
                      placeholder="POL-123456"
                    />
                  </div>
                  <InputField
                    label="ABHA Number (Ayushman Bharat Health ID)"
                    value={abhaNumber}
                    onChange={setAbhaNumber}
                    placeholder="12-3456-7890-1234"
                  />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ViewField
                    label="Insurance Provider"
                    value={insuranceProvider}
                  />
                  <ViewField label="Policy Number" value={insurancePolicy} />
                  <ViewField label="ABHA Number" value={abhaNumber} />
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Emergency Contact{" "}
                <span className="text-xs font-normal text-red-500">
                  * Critical
                </span>
              </h2>
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Name *"
                    value={emergencyName}
                    onChange={setEmergencyName}
                    placeholder="Rakesh Sharma"
                  />
                  <InputField
                    label="Phone *"
                    value={emergencyPhone}
                    onChange={setEmergencyPhone}
                    placeholder="9876543210"
                    type="tel"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Relation
                    </label>
                    <select
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="">Select</option>
                      {[
                        "Father",
                        "Mother",
                        "Spouse",
                        "Sibling",
                        "Son",
                        "Daughter",
                        "Friend",
                        "Other",
                      ].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <ViewField label="Name" value={emergencyName} />
                  <ViewField label="Phone" value={emergencyPhone} />
                  <ViewField label="Relation" value={emergencyRelation} />
                </div>
              )}
            </div>

            {/* Aadhaar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Identity Verification
                {patientAadhaarUrl && (
                  <span className="ml-2 text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </h2>
              {!patientAadhaarUrl && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
                  🔓 Upload Aadhaar to unlock See Doctor Mode, Medical Vault,
                  and Reliability Rating
                </div>
              )}
              <FileCard
                label="Aadhaar Card *"
                url={patientAadhaarUrl}
                uploading={uploadingAadhaar}
                onUpload={(f) =>
                  uploadFile(
                    f,
                    "aadhaar",
                    setPatientAadhaarUrl,
                    setUploadingAadhaar,
                  )
                }
                onRemove={() => setPatientAadhaarUrl("")}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </>
        )}

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6 space-y-4">
          <h2 className="font-bold text-red-700 text-lg border-b border-red-100 pb-3">
            ⚠️ Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 text-sm">Sign Out</p>
              <p className="text-xs text-slate-500">
                Sign out from all devices
              </p>
            </div>
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Save Button */}
        {editMode && (
          <>
            {message && (
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === "success"
                    ? "bg-teal-50 text-teal-700 border border-teal-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
