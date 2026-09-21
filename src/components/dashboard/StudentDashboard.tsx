import React, { useState, useEffect } from "react";
import { PlusCircle, ListTodo, LogOut, ArrowUpRight } from "lucide-react";
import { CreateRequestModal } from "./CreateRequestModal";
import { ViewRequestsModal } from "./ViewRequestsModal";
import { CleaningTicket, StudentUser } from "../../types/cleaning";

interface StudentDashboardProps {
  user: StudentUser;
  onSignOut: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onSignOut,
}) => {
  const [requests, setRequests] = useState<CleaningTicket[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch requests for user's room and block
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/requests?roomNumber=${encodeURIComponent(
          user.roomNumber
        )}&block=${encodeURIComponent(user.block)}`
      );
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.warn("Backend not reachable directly, using local state", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user.roomNumber, user.block]);

  const handleCreateRequest = async (newTicket: Partial<CleaningTicket>) => {
    const payload = {
      issueType: newTicket.issueType || "room_cleaning",
      title: newTicket.title || "Room Cleaning",
      description: newTicket.description,
      roomNumber: user.roomNumber,
      block: user.block,
      studentId: user.regNo,
      timeSlot: newTicket.timeSlot || "Next Available Slot",
      photoUrl: newTicket.photoUrl,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests([data.ticket, ...requests]);
      } else {
        throw new Error("Failed to save to backend");
      }
    } catch {
      // Fallback local creation
      const staffList = ["RAJ", "kannan", "Rajesh", "kumar"];
      const randomStaff = staffList[Math.floor(Math.random() * staffList.length)];
      const ticket: CleaningTicket = {
        id: `VIT-${Math.floor(100 + Math.random() * 900)}`,
        issueType: newTicket.issueType || "room_cleaning",
        title: newTicket.title || "Room Cleaning",
        description: newTicket.description,
        roomNumber: user.roomNumber,
        block: user.block,
        studentId: user.regNo,
        createdTime: "Just now",
        timeSlot: newTicket.timeSlot || "Next Available Slot",
        photoUrl: newTicket.photoUrl,
        status: "NEW",
        assignedCleaner: randomStaff,
        cleanedDate: "21 Sep 2026",
      };
      setRequests([ticket, ...requests]);
    }

    setIsCreateOpen(false);
    setIsViewOpen(true);
  };

  const handleVerifyCompletion = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/requests/${ticketId}/verify`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(requests.map((r) => (r.id === ticketId ? data.ticket : r)));
        return;
      }
    } catch {
      // Fallback local update
    }

    setRequests(
      requests.map((r) =>
        r.id === ticketId
          ? { ...r, status: "VERIFIED", cleanedDate: "21 Sep 2026" }
          : r
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center p-0 sm:p-4 selection:bg-black selection:text-white">
      {/* Mobile Phone App Canvas */}
      <div className="w-full max-w-[420px] h-screen sm:h-[844px] max-h-[100dvh] sm:max-h-[844px] bg-white sm:rounded-[38px] sm:shadow-2xl border-0 sm:border border-neutral-200/80 flex flex-col justify-between p-4 sm:p-7 relative overflow-hidden transition-all">
        
        {/* Top phone speaker bar indicator */}
        <div className="hidden sm:flex justify-center pt-1 pb-2 relative z-10">
          <div className="w-20 h-1 bg-neutral-200 rounded-full" />
        </div>

        {/* Smoothed architectural curves with subtle grey shading at the top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-36 sm:h-48 z-0">
          <svg viewBox="0 0 420 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="topGreyShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#525252" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#525252" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M-20 0 L-20 50 C 90 95, 230 40, 440 85 L440 0 Z" fill="url(#topGreyShade)" />
            <path d="M-30 45 C 90 95, 230 40, 450 85" stroke="#525252" strokeWidth="1.4" strokeOpacity="0.22" strokeLinecap="round" />
            <path d="M-20 72 C 105 120, 250 65, 440 110" stroke="#525252" strokeWidth="1.1" strokeOpacity="0.14" strokeLinecap="round" />
            <path d="M-10 98 C 120 142, 270 90, 430 135" stroke="#525252" strokeWidth="0.8" strokeOpacity="0.08" strokeLinecap="round" />
          </svg>
        </div>

        {/* Central Watermark Logo */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}logo.jpg`}
            alt=""
            className="w-[520px] h-[520px] sm:w-[640px] sm:h-[640px] max-w-none object-contain opacity-[0.12] mix-blend-multiply select-none pointer-events-none"
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col justify-between relative z-10 py-0.5 sm:py-1">
          
          {/* Top Bar with Sign Out */}
          <div className="flex items-center justify-end pb-1">
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="flex items-center gap-1.5 text-neutral-950 hover:text-neutral-600 text-xs sm:text-[13px] font-semibold tracking-tight transition-colors cursor-pointer bg-transparent py-1 px-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Dynamic Room & Student Identification Header */}
          <div className="flex flex-col items-center text-center pt-1 pb-1.5 sm:pt-3 sm:pb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400 block">
              Welcome,
            </span>
            <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-600 mt-0.5">
              {user.regNo}
            </h2>
            <h1 className="text-[19px] sm:text-[22px] font-serif font-bold text-neutral-950 tracking-tight mt-0.5 sm:mt-1">
              {user.block} • Room - {user.roomNumber}
            </h1>
          </div>

          {/* TWO PRIMARY ACTION BLOCKS */}
          <div className="space-y-2.5 sm:space-y-3.5 my-auto py-1 sm:py-2">
            
            {/* BLOCK 1: Create New Request */}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="w-full p-3.5 sm:p-5 rounded-2xl bg-white hover:bg-neutral-50/90 text-neutral-900 text-left transition-all duration-200 border border-neutral-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between group cursor-pointer active:scale-[0.985]"
            >
              <div className="flex items-center justify-between w-full mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <PlusCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                  Create New Request
                </h2>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-normal mt-0.5 sm:mt-1 leading-relaxed">
                  Book cleaning for your floor, bathroom, or trash clearance with photo.
                </p>
              </div>
            </button>

            {/* BLOCK 2: View Requests */}
            <button
              type="button"
              onClick={() => setIsViewOpen(true)}
              className="w-full p-3.5 sm:p-5 rounded-2xl bg-white hover:bg-neutral-50/90 text-neutral-900 text-left transition-all duration-200 border border-neutral-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between group cursor-pointer active:scale-[0.985]"
            >
              <div className="flex items-center justify-between w-full mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <ListTodo className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                  View Requests
                </h2>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-normal mt-0.5 sm:mt-1 leading-relaxed">
                  Track assigned cleaner (RAJ, kannan, Rajesh, kumar) & verify completion.
                </p>
              </div>
            </button>

          </div>

        </div>

        {/* Minimal Footer */}
        <div className="pt-1 pb-1 sm:pt-4 text-center relative z-10">
          <p className="text-[10px] sm:text-[11px] font-medium text-neutral-400">
            VITidy • Vellore Institute of Technology
          </p>
        </div>

        {/* Smoothed architectural curves at the bottom */}
        <div className="absolute -bottom-1 left-0 right-0 pointer-events-none overflow-hidden h-28 sm:h-40 z-0">
          <svg viewBox="0 0 420 145" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bottomGreyShade" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#525252" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#525252" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M-20 145 L-20 90 C 110 40, 250 100, 440 45 L440 145 Z" fill="url(#bottomGreyShade)" />
            <path d="M-20 70 C 110 40, 250 100, 440 45" stroke="#525252" strokeWidth="1.4" strokeOpacity="0.22" strokeLinecap="round" />
            <path d="M-20 92 C 120 62, 265 118, 440 68" stroke="#525252" strokeWidth="1.1" strokeOpacity="0.14" strokeLinecap="round" />
            <path d="M-20 114 C 130 84, 280 134, 440 90" stroke="#525252" strokeWidth="0.8" strokeOpacity="0.08" strokeLinecap="round" />
          </svg>
        </div>

        {/* Sign Out Confirmation Modal */}
        {showSignOutConfirm && (
          <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
            <div className="w-full max-w-[380px] bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.28)] border border-neutral-300 text-center flex flex-col items-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-neutral-100 border border-neutral-200/90 flex items-center justify-center text-neutral-900 mb-3.5">
                <LogOut className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight">Sign Out?</h3>
              <p className="text-xs sm:text-[13px] text-neutral-500 mt-1.5 leading-relaxed max-w-[280px]">
                Are you sure you want to sign out of your session?
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 h-12 py-3 px-4 rounded-lg sm:rounded-xl border border-neutral-300 text-neutral-800 text-xs sm:text-sm font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex-1 h-12 py-3 px-4 rounded-lg sm:rounded-xl bg-neutral-950 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer active:scale-[0.985]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Modals with User's actual Room and Block */}
      <CreateRequestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateRequest}
        roomNumber={user.roomNumber}
        block={user.block}
      />

      <ViewRequestsModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        requests={requests}
        onVerifyCompletion={handleVerifyCompletion}
        onOpenNewRequest={() => setIsCreateOpen(true)}
        roomNumber={user.roomNumber}
        block={user.block}
      />

    </div>
  );
};
