import Button from "../ui/Button.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const email = user?.email || "";
  const initial = email ? email[0].toUpperCase() : "U";

  const onLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-ink text-white grid place-items-center font-extrabold shadow-sm">
            J
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight">
              JD-Resume Matcher
            </div>
            <div className="text-xs text-slate-500">
              Upload resume • Paste JD • Analyze
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 border border-brand-200 grid place-items-center font-bold text-brand-800">
              {initial}
            </div>
            <div className="text-sm font-semibold text-slate-700">{email}</div>
          </div>

          <Button variant="ghost" onClick={onLogout} className="rounded-xl">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
