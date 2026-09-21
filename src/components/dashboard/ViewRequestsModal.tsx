import React, { useState } from "react";
import {
  ArrowLeft,
  X,
  Bed,
  Bath,
  SprayCan,
  Wind,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Plus,
} from "lucide-react";
import { CleaningTicket } from "../../types/cleaning";

interface ViewRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: CleaningTicket[];
  onVerifyCompletion?: (ticketId: string) => void;
  onOpenNewRequest: () => void;
  roomNumber?: string;
  block?: string;
}

const getIssueIcon = (type?: string) => {
  switch (type) {
    case "bathroom_cleaning":
      return Bath;
    case "deep_cleaning":
      return SprayCan;
    case "corridor_window":
      return Wind;
    case "urgent_cleaning":
    case "other":
      return AlertCircle;
    case "room_cleaning":
    default:
      return Bed;
  }
};

const getStatusBadge = (status: CleaningTicket["status"]) => {
  switch (status) {
    case "NEW":
    case "ASSIGNED":
      return {
        label: "PENDING",
      };
    case "IN PROGRESS":
      return {
        label: "CLEANING",
      };
    case "COMPLETED":
      return {
        label: "DONE",
        Icon: CheckCircle2,
      };
    case "VERIFIED":
    default:
      return {
        label: "SUCCESSFUL",
        Icon: CheckCircle2,
      };
  }
};

export const ViewRequestsModal: React.FC<ViewRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onVerifyCompletion,
  onOpenNewRequest,
  roomNumber = "663",
  block = "Block Q",
}) => {
  const [activeTab, setActiveTab] = useState<"pending" | "successful">("pending");

  if (!isOpen) return null;

  const pendingRequests = requests.filter((r) => r.status !== "VERIFIED");
  const successfulRequests = requests.filter((r) => r.status === "VERIFIED");

  const displayedList = activeTab === "pending" ? pendingRequests : successfulRequests;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Full Page Mobile Screen Canvas */}
      <div className="w-full max-w-[420px] h-screen sm:h-[844px] max-h-[100dvh] sm:max-h-[844px] bg-white sm:rounded-[38px] sm:shadow-2xl border-0 sm:border border-neutral-200 flex flex-col justify-between overflow-hidden relative animate-in slide-in-from-right-4 duration-200">
        
        {/* Central Watermark Logo (Increased by 35%) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}logo.jpg`}
            alt=""
            className="w-[350px] h-[350px] sm:w-[390px] sm:h-[390px] object-contain opacity-[0.11] mix-blend-multiply select-none pointer-events-none"
          />
        </div>

        {/* Full Page Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xs relative z-10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[16px] sm:text-[17px] font-semibold text-neutral-800 hover:text-black py-2 px-2.5 -ml-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5.5 h-5.5 stroke-[2.2]" />
              <span>Home</span>
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {block} • Room {roomNumber}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3">
            <h1 className="text-2xl font-bold font-serif text-neutral-950 tracking-normal">
              Requests & History
            </h1>
            <p className="text-sm text-neutral-500 font-normal mt-0.5 leading-relaxed">
              Track pending cleanings and view past successful completions.
            </p>
          </div>

          {/* Segmented Filter Control (Reduced by 20%) */}
          <div className="mt-3.5 grid grid-cols-2 p-1 bg-neutral-100/90 rounded-xl border border-neutral-200/90">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-2.5 rounded-lg text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-white text-neutral-950 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <span>Pending & Cleaning</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "pending" ? "bg-neutral-950 text-white" : "bg-neutral-200 text-neutral-600"
              }`}>
                {pendingRequests.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("successful")}
              className={`py-2 px-2.5 rounded-lg text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "successful"
                  ? "bg-white text-neutral-950 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Successful</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "successful" ? "bg-neutral-950 text-white" : "bg-neutral-200 text-neutral-600"
              }`}>
                {successfulRequests.length}
              </span>
            </button>
          </div>
        </div>

        {/* Full Page Requests List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 relative z-10">
          {displayedList.length > 0 ? (
            displayedList.map((item) => {
              const Icon = getIssueIcon(item.issueType);
              const badge = getStatusBadge(item.status);
              const StatusIcon = badge.Icon;
              return (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 bg-white/95 backdrop-blur-xs rounded-xl border border-neutral-200/90 shadow-2xs space-y-2.5 transition-all hover:border-neutral-300"
                >
                  {/* Top Bar: Icon, Name, Date & Status (JUST TEXT, no sparkles, blending into card) */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3">
                      <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-center text-neutral-900 shrink-0 shadow-2xs mt-0.5">
                        <Icon className="w-4.5 h-4.5 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-[15px] font-bold text-neutral-950 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-neutral-600 font-medium mt-0.5">
                          {item.assignedCleaner
                            ? `Staff: ${item.assignedCleaner}`
                            : "Staff: Pending Assignment"}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 font-medium mt-1">
                          <Calendar className="w-3 h-3 text-neutral-400 stroke-[2]" />
                          <span>
                            {item.status === "COMPLETED" || item.status === "VERIFIED"
                              ? `Cleaned: ${item.cleanedDate || "20 Sep 2026"}`
                              : `Date: ${item.cleanedDate || "21 Sep 2026"}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status: JUST TEXT, no sparkles symbol, blending seamlessly into the white card */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-950 shrink-0 pt-0.5">
                      {StatusIcon && <StatusIcon className="w-3.5 h-3.5 stroke-[2.2] text-neutral-950" />}
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  {/* Optional Note */}
                  {item.description && (
                    <div className="text-sm text-neutral-700 bg-neutral-50/90 p-3 rounded-xl border border-neutral-200/80 font-normal italic leading-relaxed">
                      "{item.description}"
                    </div>
                  )}

                  {/* Optional Room Photo */}
                  {item.photoUrl && (
                    <div className="rounded-xl overflow-hidden border border-neutral-200 h-32 w-full bg-neutral-900">
                      <img
                        src={item.photoUrl}
                        alt="Attached room photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Action if Completed / Done */}
                  {item.status === "COMPLETED" && onVerifyCompletion && (
                    <button
                      type="button"
                      onClick={() => onVerifyCompletion(item.id)}
                      className="w-full h-12 rounded-xl bg-neutral-950 hover:bg-black active:scale-[0.99] text-white font-semibold text-sm sm:text-[15px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-1"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
                      <span>Confirm Cleaning Successful ✓</span>
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-14 px-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-dashed border-neutral-200">
              <CheckCircle2 className="w-11 h-11 text-neutral-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-neutral-900">
                {activeTab === "pending"
                  ? "No Pending Cleanings"
                  : "No Successful History Yet"}
              </h4>
              <p className="text-sm text-neutral-500 max-w-[260px] mx-auto mt-1 leading-relaxed">
                {activeTab === "pending"
                  ? "Your room is all clean. You can book a new request whenever needed."
                  : "Completed cleanings will appear here once verified."}
              </p>
            </div>
          )}
        </div>

        {/* Full Page Bottom Bar */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white/95 backdrop-blur-xs relative z-10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewRequest();
            }}
            className="w-full h-15 sm:h-16 rounded-2xl bg-neutral-950 hover:bg-black active:scale-[0.99] text-white font-bold text-base sm:text-[18px] tracking-wide shadow-md flex items-center justify-center gap-3 cursor-pointer transition-all"
          >
            <Plus className="w-5.5 h-5.5 stroke-[2.5]" />
            <span>Book New Cleaning Request</span>
          </button>
        </div>

      </div>
    </div>
  );
};
