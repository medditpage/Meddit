"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";



export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);

  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploadingAadhaar, setUploadingAadhaar] = React.useState(false);
  const [uploadingCV, setUploadingCV] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Common fields
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [location, setLocation] = React.useState("");

  // Doctor fields
  const [specialization, setSpecialization] = React.useState("");
  const [hospital, setHospital] = React.useState("");
  const [professionalEmail, setProfessionalEmail] = React.useState("");
  const [consultingFee, setConsultingFee] = React.useState("");
  const [experienceYears, setExperienceYears] = React.useState("");
  const [languages, setLanguages] = React.useState("");
  const [cvUrl, setCvUrl] = React.useState("");
  const [aadhaarUrl, setAadhaarUrl] = React.useState("");

  // Patient fields
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [allergies, setAllergies] = React.useState("");
  const [currentMedications, setCurrentMedications] = React.useState("");
  const [medicalConditions, setMedicalConditions] = React.useState("");
  const [seeDoctorMode, setSeeDoctorMode] = React.useState(false);
  const [patientAadhaarUrl, setPatientAadhaarUrl] = React.useState("");

  React.useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();

      // Get auth user directly instead of relying on Zustand
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (data) {
        setProfile(data);
        setName(data.name || "");
        setUsername(data.username || "");
        setPhone(data.phone || "");
        setGender(data.gender || "");
        setAbout(data.about || "");
        setLocation(data.location || "");
        setSpecialization(data.specialization || "");
        setHospital(data.hospital || "");
        setProfessionalEmail(data.professional_email || "");
        setConsultingFee(data.consulting_fee || "");
        setExperienceYears(data.experience_years?.toString() || "");
        setLanguages(data.languages || "");
        setCvUrl(data.cv_url || "");
        setAadhaarUrl(data.aadhaar_url || "");
        setDateOfBirth(data.date_of_birth || "");
        setBloodGroup(data.blood_group || "");
        setAllergies(data.allergies || "");
        setCurrentMedications(data.current_medications || "");
        setMedicalConditions(data.medical_conditions || "");
        setSeeDoctorMode(data.see_doctor_mode || false);
        setPatientAadhaarUrl(data.aadhaar_url || "");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user?.id]);

  const uploadFile = async (
    file: File,
    folder: string,
    onSuccess: (url: string) => void,
    setUploading: (v: boolean) => void,
  ) => {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/${folder}_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: true });

    if (!error) {
      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(path);
      onSuccess(path);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;
    const userId = authUser.id;

    setSaving(true);
    setMessage(null);

    const avatarInitials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const isDoctor = profile?.role === "doctor";

    const updateData: any = {
      name,
      username,
      phone,
      gender,
      about,
      location,
      avatar_initials: avatarInitials,
    };

    if (isDoctor) {
      updateData.specialization = specialization;
      updateData.hospital = hospital;
      updateData.professional_email = professionalEmail;
      updateData.consulting_fee = consultingFee;
      updateData.experience_years = experienceYears
        ? parseInt(experienceYears)
        : null;
      updateData.languages = languages;
      updateData.cv_url = cvUrl;
      updateData.aadhaar_url = aadhaarUrl;
    } else {
      updateData.date_of_birth = dateOfBirth || null;
      updateData.blood_group = bloodGroup;
      updateData.allergies = allergies;
      updateData.current_medications = currentMedications;
      updateData.medical_conditions = medicalConditions;
      updateData.see_doctor_mode = seeDoctorMode;
      updateData.aadhaar_url = patientAadhaarUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("Save error:", JSON.stringify(error));
      setMessage({ type: "error", text: "Failed to save. " + error.message });
    } else {
      if (user?.id) {
        login({
          id: user.id,
          name,
          role: profile?.role || "doctor",
          avatarInitials,
        });
      }
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const isDoctor = profile?.role === "doctor";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Profile Settings
          </h1>
          <p className="text-slate-500 mt-1">
            {isDoctor
              ? "Manage your professional doctor profile."
              : "Manage your patient health profile."}
          </p>
        </div>

        {/* Role Badge */}
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

        {/* Avatar Preview */}
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
              {isDoctor ? specialization || "Your Specialization" : "Patient"}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              @{username || "username"} • ⭐{" "}
              {profile?.reliability_rating || "0.0"}
            </p>
          </div>
        </div>

        {/* Common Fields */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isDoctor ? "Dr. Arjun Mehta" : "Rahul Sharma"}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))
                }
                placeholder="dr_arjun"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
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
              <p className="text-xs text-slate-400 mt-1">
                Phone number cannot be changed after signup.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kanpur, Uttar Pradesh"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              About
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder={
                isDoctor
                  ? "Describe your specialty, approach, and experience..."
                  : "Tell us about yourself..."
              }
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>

        {/* DOCTOR SPECIFIC FIELDS */}
        {isDoctor && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Cardiologist"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Hospital / Clinic
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="AIIMS Delhi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Consulting Fee (₹)
                  </label>
                  <input
                    type="text"
                    value={consultingFee}
                    onChange={(e) => setConsultingFee(e.target.value)}
                    placeholder="500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Professional Email
                  </label>
                  <input
                    type="email"
                    value={professionalEmail}
                    onChange={(e) => setProfessionalEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Hindi, English"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Verification Documents
                <span className="ml-2 text-xs font-normal text-red-500">
                  * Required for verification
                </span>
              </h2>

              {/* Aadhaar Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Aadhaar Card * (PDF or Image)
                </label>
                {aadhaarUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-teal-700 text-sm font-medium">
                      ✅ Aadhaar uploaded
                    </span>
                    <button
                      onClick={() => setAadhaarUrl("")}
                      className="ml-auto text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                    <span className="text-2xl">📄</span>
                    <span className="text-sm text-slate-500">
                      {uploadingAadhaar
                        ? "Uploading..."
                        : "Click to upload Aadhaar"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={uploadingAadhaar}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          uploadFile(
                            file,
                            "aadhaar",
                            setAadhaarUrl,
                            setUploadingAadhaar,
                          );
                      }}
                    />
                  </label>
                )}
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Resume / CV * (PDF)
                </label>
                {cvUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-teal-700 text-sm font-medium">
                      ✅ CV uploaded
                    </span>
                    <button
                      onClick={() => setCvUrl("")}
                      className="ml-auto text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                    <span className="text-2xl">📋</span>
                    <span className="text-sm text-slate-500">
                      {uploadingCV
                        ? "Uploading..."
                        : "Click to upload CV/Resume"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      disabled={uploadingCV}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          uploadFile(file, "cv", setCvUrl, setUploadingCV);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </>
        )}

        {/* PATIENT SPECIFIC FIELDS */}
        {!isDoctor && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Health Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
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

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Known Allergies
                </label>
                <textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Dust, Peanuts"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Current Medications
                </label>
                <textarea
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="e.g. Amlodipine 5mg, Metformin 500mg"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Medical Conditions
                </label>
                <textarea
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Hypertension"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

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
                    onClick={() => setSeeDoctorMode(!seeDoctorMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${seeDoctorMode ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${seeDoctorMode ? "left-6" : "left-0.5"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Patient Aadhaar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Identity Verification
                <span className="ml-2 text-xs font-normal text-red-500">
                  * Mandatory
                </span>
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Aadhaar Card * (PDF or Image)
                </label>
                {patientAadhaarUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <span className="text-teal-700 text-sm font-medium">
                      ✅ Aadhaar uploaded
                    </span>
                    <button
                      onClick={() => setPatientAadhaarUrl("")}
                      className="ml-auto text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                    <span className="text-2xl">📄</span>
                    <span className="text-sm text-slate-500">
                      {uploadingAadhaar
                        ? "Uploading..."
                        : "Click to upload Aadhaar"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={uploadingAadhaar}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          uploadFile(
                            file,
                            "aadhaar",
                            setPatientAadhaarUrl,
                            setUploadingAadhaar,
                          );
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </>
        )}

        {/* Feedback Message */}
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

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </DashboardLayout>
  );
}
