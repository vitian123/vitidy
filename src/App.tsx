import { useState } from "react";
import { AuthScreen } from "./components/auth/AuthScreen";
import { StudentDashboard } from "./components/dashboard/StudentDashboard";
import { StudentUser } from "./types/cleaning";

export default function App() {
  const [user, setUser] = useState<StudentUser | null>(null);

  return (
    <main className="w-full min-h-screen">
      {user ? (
        <StudentDashboard user={user} onSignOut={() => setUser(null)} />
      ) : (
        <AuthScreen onSuccess={setUser} />
      )}
    </main>
  );
}

