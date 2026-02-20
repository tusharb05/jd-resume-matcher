import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../ui/Card.jsx";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AuthCard() {
  const [mode, setMode] = useState("login"); // login | signup
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed) navigate("/", { replace: true });
  }, [isAuthed, navigate]);

  const headline = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create your account"),
    [mode]
  );

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            <span className="text-sm font-semibold text-slate-700">
              JD Resume matcher + helper
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
            {headline}
          </h1>
          <p className="mt-2 text-slate-600">
            Match smarter. Fix gaps. Ship a better resume in minutes.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left “brand” panel */}
            <div className="relative p-8 bg-gradient-to-br from-brand-50 to-white border-b md:border-b-0 md:border-r border-slate-200">
              <div className="text-sm font-semibold text-slate-700">
                One workflow
              </div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                Resume ↔ JD Alignment
              </div>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  Extract matched skills and missing skills
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-electric-500" />
                  Practical suggestions: projects, lines, sections
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-ink" />
                  Results formatted for quick edits
                </li>
              </ul>

              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setMode("login")}
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-semibold border transition",
                    mode === "login"
                      ? "bg-ink text-white border-ink"
                      : "bg-white hover:bg-slate-50 border-slate-200",
                  ].join(" ")}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-semibold border transition",
                    mode === "signup"
                      ? "bg-ink text-white border-ink"
                      : "bg-white hover:bg-slate-50 border-slate-200",
                  ].join(" ")}
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Right form panel (animated) */}
            <div className="p-8">
              <AnimatePresence mode="wait" initial={false}>
                {mode === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LoginForm onSwitch={() => setMode("signup")} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SignupForm onSwitch={() => setMode("login")} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>

        <div className="mt-5 text-center text-xs text-slate-500">
          JWT + user stored in localStorage • Protected routes enabled
        </div>
      </div>
    </div>
  );
}
