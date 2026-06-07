import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  selectedDate: number;
  selectedSlot: string;
}

export const BookingModal = ({
  isOpen,
  onClose,
  doctorName,
  selectedDate,
  selectedSlot,
}: BookingModalProps) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setIsConfirming(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsConfirming(true);
    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false);
      setIsSuccess(true);
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isConfirming ? onClose : undefined}
      />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Appointment Confirmed!
              </h3>
              <p className="text-slate-600">
                You are scheduled to see Dr. {doctorName}.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Confirm Booking
                </h3>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Doctor</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    Dr. {doctorName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Date</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    November {selectedDate}, 2024
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Time</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {selectedSlot}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={onClose}
                  disabled={isConfirming}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                >
                  {isConfirming ? "Confirming..." : "Confirm Booking"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
