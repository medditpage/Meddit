"use client";

import { DoctorProfileHero } from "@/components/doctor/DoctorProfileHero";
import { AvailabilityCalendar } from "@/components/doctor/AvailabilityCalendar";
import { ConsultationCard } from "@/components/patient/ConsultationCard";
import { MedicalHistoryCard } from "@/components/patient/MedicalHistoryCard";
import { LabReportCard } from "@/components/patient/LabReportCard";
import { DoctorListCard } from "@/components/layout/DoctorListCard";

export default function ConsultPage() {
  return (
    <div className="p-6">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Profile */}
        <div className="lg:col-span-2">
          <DoctorProfileHero
            doctor={{
              name: "Priya Sharma",
              specialty: "Cardiologist",
              location: "Mumbai",
              experience: 14,
              rating: 4.9,
              fee: "₹700",
              isVerified: true,
              metrics: {
                successRate: "47/50",
                patients: "1200+",
                reliability: "98%",
              },
            }}
          />
        </div>

        <div className="mt-8 space-y-4">
          <DoctorListCard
            name="Rajesh Kumar"
            specialty="Dermatologist"
            experience={8}
            rating={4.7}
            consultationFee="₹500"
            location="Delhi"
            isVerified
          />

          <DoctorListCard
            name="Anjali Verma"
            specialty="Neurologist"
            experience={12}
            rating={4.9}
            consultationFee="₹900"
            location="Lucknow"
            isVerified
          />
        </div>

        {/* Availability Calendar */}
        <div>
          <AvailabilityCalendar
            monthYear="November 2025"
            availableDates={[1, 3, 5, 7, 9, 12, 15]}
            selectedDate={5}
            slots={["09:00 AM", "11:00 AM", "02:00 PM"]}
            selectedSlot="11:00 AM"
          />
        </div>
      </div>

      {/* BOTTOM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <ConsultationCard
          doctor={{
            name: "Priya Sharma",
            specialty: "Cardiologist",
          }}
          appointment={{
            date: "12 Nov 2025",
            time: "11:00 AM",
            type: "video",
            status: "upcoming",
          }}
          actionLabel="Join Consultation"
        />

        <MedicalHistoryCard
          type="condition"
          title="Hypertension"
          subtitle="Diagnosed in 2022"
          status="Managed"
        />

        <LabReportCard
          testName="Complete Blood Count"
          labName="Apollo Diagnostics"
          date="10 Nov 2025"
          status="normal"
        />
      </div>
    </div>
  );
}
