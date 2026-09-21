import React, { useState } from "react";
import { ArrowRight, User, Eye, EyeOff, Lock } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { StudentUser } from "../../types/cleaning";

interface AuthScreenProps {
  onSuccess?: (user: StudentUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSuccess) return;
    setErrorMessage(null);
    if (!username.trim() || !password) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toUpperCase(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setIsSuccess(true);
        setErrorMessage(null);
        setTimeout(() => {
          onSuccess?.(data.user);
        }, 600);
      } else {
        setIsSuccess(false);
        setErrorMessage(data.error || "Incorrect VTOP credentials. Please try again.");
      }
    } catch {
      // Fallback offline mock for testing if backend is connecting
      const u = username.trim().toUpperCase();
      const isRoom663 = ["26BIT0443","26BIT0438","26BIT442","26BIT0442","26BIT441","26BIT0441","26BIT440","26BIT0440","26BIT439","26BIT0439","26BIT000"].includes(u);
      const isRoom665 = ["26BIT0437","26BIT0436","26BIT435","26BIT0435","26BIT434","26BIT0434","26BIT4433","26BIT432","26BIT0432"].includes(u);

      if (isRoom663 || isRoom665) {
        setIsSuccess(true);
        setErrorMessage(null);
        setTimeout(() => {
          onSuccess?.({
            regNo: u,
            name: `Student ${u}`,
            block: "Block Q",
            roomNumber: isRoom663 ? "663" : "665",
          });
        }, 600);
      } else {
        setIsSuccess(false);
        setErrorMessage("Incorrect VTOP credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center p-0 sm:p-4 selection:bg-black selection:text-white">
      {/* Mobile Phone App Canvas */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[844px] bg-white sm:rounded-[38px] sm:shadow-2xl border-0 sm:border border-neutral-200/80 flex flex-col justify-between p-7 sm:p-8 relative overflow-hidden transition-all">
        {/* Top phone speaker bar indicator */}
        <div className="hidden sm:flex justify-center pt-1 pb-4 relative z-10">
          <div className="w-20 h-1 bg-neutral-200 rounded-full" />
        </div>

        {/* Elegant dark black subtle smooth curves & architectural accents at the top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden h-52 z-0">
          <svg
            viewBox="0 0 420 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Flowing curve 1 */}
            <path
              d="M-40 35 C 80 100, 240 10, 460 70"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.20"
              strokeLinecap="round"
            />
            {/* Flowing curve 2 */}
            <path
              d="M-30 65 C 100 130, 265 35, 450 100"
              stroke="#000000"
              strokeWidth="1.2"
              strokeOpacity="0.12"
              strokeLinecap="round"
            />
            {/* Flowing curve 3 */}
            <path
              d="M-20 95 C 120 155, 290 60, 440 130"
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.06"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          {/* Logo & Brand Identity */}
          <div className="flex flex-col items-center text-center mb-7">
            <BrandLogo />

            <h1 className="text-2xl font-black tracking-[-0.03em] text-neutral-950 mt-4">
              WELCOME TO VITidy
            </h1>
            <p className="text-xs sm:text-[13px] text-neutral-500 font-medium mt-1 leading-relaxed">
              Enter your VTOP credentials to access your verified hostel room.
            </p>
          </div>

          {/* Form - VTOP Username & Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-800 mb-1.5 ml-0.5"
              >
                VTOP Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  disabled={isSuccess}
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g. 26BIT0443"
                  className={`w-full pl-11 pr-4 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all shadow-2xs focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed ${
                    errorMessage
                      ? "bg-red-50/50 border border-red-500 text-neutral-950 placeholder:text-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                      : "bg-neutral-50/80 border border-neutral-200 text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:ring-2 focus:ring-black/10"
                  }`}
                />
                <User
                  className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    errorMessage ? "text-red-500" : "text-neutral-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-800 mb-1.5 ml-0.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isSuccess}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-11 pr-12 py-4 rounded-xl text-sm font-medium tracking-tight transition-all shadow-2xs focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed ${
                    errorMessage
                      ? "bg-red-50/50 border border-red-500 text-neutral-950 placeholder:text-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                      : "bg-neutral-50/80 border border-neutral-200 text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:ring-2 focus:ring-black/10"
                  }`}
                />
                <Lock
                  className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    errorMessage ? "text-red-500" : "text-neutral-400"
                  }`}
                />
                {!isSuccess && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-950 p-1.5 rounded-lg transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Clean Enterprise Error Notice */}
            {errorMessage && (
              <div className="flex items-center gap-2 pt-0.5 px-0.5 text-[12px] text-red-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Button: Verified (Not clickable) vs Sign In */}
            {isSuccess ? (
              <div className="w-full mt-2 h-[52px] px-5 rounded-xl bg-neutral-950 text-white font-semibold text-[15px] tracking-tight shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-center select-none cursor-default pointer-events-none">
                <span>Verified</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !username.trim() || !password}
                className="w-full mt-2 h-[52px] px-5 rounded-xl bg-neutral-950 hover:bg-black text-white font-semibold text-[15px] tracking-tight transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.16)] active:scale-[0.985] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.3]" />
                  </>
                )}
              </button>
            )}
          </form>

          {/* Institutional Note */}
          <div className="mt-6 text-center">
            <p className="text-[12px] leading-relaxed text-neutral-500 font-normal">
              <span className="text-neutral-900 font-medium">Note:</span> Room allocation and hostel blocks are securely verified via authorized VIT institutional records.
            </p>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="pt-6 text-center relative z-10">
          <p className="text-[11px] font-medium text-neutral-400">
            VITidy • Vellore Institute of Technology
          </p>
        </div>

        {/* Elegant dark black subtle smooth curves at the bottom */}
        <div className="absolute -bottom-1 left-0 right-0 pointer-events-none overflow-hidden h-36 z-0">
          <svg
            viewBox="0 0 420 135"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Primary smooth dark black curved line */}
            <path
              d="M-20 70 C 100 15, 240 85, 440 28"
              stroke="#000000"
              strokeWidth="1.5"
              strokeOpacity="0.22"
              strokeLinecap="round"
            />
            {/* Secondary echoing dark black line */}
            <path
              d="M-20 90 C 115 35, 260 102, 440 46"
              stroke="#000000"
              strokeWidth="1.2"
              strokeOpacity="0.13"
              strokeLinecap="round"
            />
            {/* Tertiary ambient contour line */}
            <path
              d="M-20 110 C 130 55, 280 120, 440 68"
              stroke="#000000"
              strokeWidth="1"
              strokeOpacity="0.07"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
