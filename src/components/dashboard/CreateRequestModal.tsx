import React, { useState, useRef } from "react";
import {
  X,
  Bed,
  Bath,
  SprayCan,
  Wind,
  AlertCircle,
  Camera,
  HelpCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { CleaningTicket, IssueType } from "../../types/cleaning";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Partial<CleaningTicket>) => void;
  roomNumber: string;
  block: string;
}

const ISSUE_OPTIONS: {
  type: IssueType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    type: "room_cleaning",
    title: "General Room Cleaning",
    desc: "Floor sweeping, mopping & dust removal",
    icon: Bed,
  },
  {
    type: "bathroom_cleaning",
    title: "Bathroom Cleaning",
    desc: "Tile scrubbing, basin & mirror cleaning",
    icon: Bath,
  },
  {
    type: "deep_cleaning",
    title: "Deep Cleaning",
    desc: "Floor scrub, cobweb removal & deep dusting",
    icon: SprayCan,
  },
  {
    type: "corridor_window",
    title: "Windows & Balcony",
    desc: "Shared corridor or room window glass",
    icon: Wind,
  },
  {
    type: "urgent_cleaning",
    title: "Urgent Cleaning",
    desc: "Immediate priority clearance or spill support",
    icon: AlertCircle,
  },
];

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roomNumber,
  block,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<IssueType>("room_cleaning");
  const [note, setNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setShowConfirm(true);
  };

  const handleFinalConfirm = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const issueObj = ISSUE_OPTIONS.find((i) => i.type === selectedIssue);
      onSubmit({
        issueType: selectedIssue,
        title: issueObj?.title || "Room Cleaning",
        description: note.trim() || undefined,
        timeSlot: "Next Available Slot",
        photoUrl: photoUrl || undefined,
      });
      setIsSubmitting(false);
      setShowConfirm(false);
      setIsDropdownOpen(false);
      setPhotoUrl(null);
      setNote("");
      onClose();
    }, 600);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[400px] max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 pb-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <span>{block}</span>
              <span>•</span>
              <span>Room {roomNumber}</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-950 tracking-tight mt-0.5">
              {showConfirm ? "Confirm Booking" : "Create New Request"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Confirmation Page OR Input Form */}
        {showConfirm ? (
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-4 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-900 mx-auto">
                <HelpCircle className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
                  Are you sure you want to book this session?
                </h3>
                <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
                  Please review your booking details. Once confirmed, hostel cleaning staff will be dispatched to your room.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-2.5 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
                    {(() => {
                      const Icon = ISSUE_OPTIONS.find((i) => i.type === selectedIssue)?.icon || Bed;
                      return <Icon className="w-4 h-4 stroke-[2]" />;
                    })()}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-neutral-950 truncate">
                      {ISSUE_OPTIONS.find((i) => i.type === selectedIssue)?.title}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {ISSUE_OPTIONS.find((i) => i.type === selectedIssue)?.desc}
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200/70 pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-medium">Room Location</span>
                  <span className="font-semibold text-neutral-900">{block} • Room {roomNumber}</span>
                </div>

                {note.trim() && (
                  <div className="border-t border-neutral-200/70 pt-2 text-[11px]">
                    <span className="text-neutral-500 font-medium block text-[10px] mb-0.5">Special Note:</span>
                    <span className="text-neutral-800 italic bg-white px-2.5 py-1 rounded border border-neutral-200/80 block text-xs">
                      "{note.trim()}"
                    </span>
                  </div>
                )}

                {photoUrl && (
                  <div className="border-t border-neutral-200/70 pt-2 flex items-center gap-2.5">
                    <img src={photoUrl} alt="Issue attachment" className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0" />
                    <span className="text-[11px] font-medium text-neutral-600">Room photo attached</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalConfirm}
                className="flex-1 h-12 rounded-xl bg-neutral-950 hover:bg-black text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Yes, Book Session</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Modal Form Content */
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Service Type Selection - High-End Animated Custom Scroll Menu */}
          <div className="space-y-1.5 relative">
            <label
              className="block text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500 ml-0.5"
            >
              Service Type
            </label>

            {/* Clickable Trigger Card */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full h-[64px] px-3.5 rounded-xl border bg-white flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer shadow-2xs ${
                isDropdownOpen
                  ? "border-neutral-950 ring-2 ring-black/5"
                  : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50/50 active:scale-[0.995]"
              }`}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-800 shrink-0 shadow-2xs">
                  {(() => {
                    const Icon = ISSUE_OPTIONS.find((i) => i.type === selectedIssue)?.icon || Bed;
                    return <Icon className="w-5 h-5 stroke-[2]" />;
                  })()}
                </div>
                <div className="truncate">
                  <div className="font-bold text-neutral-950 text-sm sm:text-[15px] tracking-tight">
                    {ISSUE_OPTIONS.find((i) => i.type === selectedIssue)?.title}
                  </div>
                  <div className="text-xs text-neutral-500 font-normal truncate mt-0.5">
                    {ISSUE_OPTIONS.find((i) => i.type === selectedIssue)?.desc}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4.5 h-4.5 shrink-0 text-neutral-500 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180 text-neutral-950" : ""
                }`}
              />
            </button>

            {/* Animated Dropdown Menu with Smooth Scroll */}
            {isDropdownOpen && (
              <div
                role="listbox"
                className="mt-2 rounded-2xl border border-neutral-200/90 bg-white p-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] space-y-1.5 max-h-[240px] overflow-y-auto overscroll-contain scroll-smooth animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {ISSUE_OPTIONS.map((opt) => {
                  const isSelected = selectedIssue === opt.type;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedIssue(opt.type);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-neutral-950 text-white shadow-xs font-semibold"
                          : "hover:bg-neutral-100/90 text-neutral-900 active:scale-[0.99]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-neutral-100 border border-neutral-200/80 text-neutral-800"
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5 stroke-[2]" />
                        </div>
                        <div className="truncate">
                          <div
                            className={`text-xs sm:text-sm font-bold leading-tight ${
                              isSelected ? "text-white" : "text-neutral-950"
                            }`}
                          >
                            {opt.title}
                          </div>
                          <div
                            className={`text-[11px] truncate mt-0.5 ${
                              isSelected ? "text-neutral-300" : "text-neutral-500"
                            }`}
                          >
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Camera Upload Option */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500 mb-1.5 ml-0.5">
              Room Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoCapture}
              className="hidden"
            />
            {photoUrl ? (
              <div className="relative w-full h-28 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-900 group">
                <img
                  src={photoUrl}
                  alt="Room issue capture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-white text-[11px] font-semibold px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photo Attached</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[52px] px-3.5 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-100/50 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:text-neutral-950 transition-colors shadow-2xs">
                    <Camera className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-neutral-900">
                      Take Photo / Upload Image
                    </div>
                    <div className="text-[10px] text-neutral-500 font-normal">
                      Attach photo of room or issue
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-neutral-700 bg-white border border-neutral-200/80 px-2.5 py-1 rounded-lg shadow-2xs group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-all">
                  Open Camera
                </span>
              </button>
            )}
          </div>

          {/* Special Notes (Optional) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500 mb-1.5 ml-0.5">
              Additional Details (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Please bring extra floor wiper or clear balcony trash..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-neutral-950 bg-neutral-50/50 resize-none"
            />
          </div>

          {/* Submit Action Button - Increased by 20%, Executive & Professional */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[58px] rounded-xl bg-neutral-950 hover:bg-neutral-900 active:bg-black text-white font-semibold text-base tracking-tight flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 border border-neutral-900"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Request...</span>
                </div>
              ) : (
                <span>Confirm & Submit Request</span>
              )}
            </button>
          </div>
        </form>
        )}

      </div>
    </div>
  );
};
