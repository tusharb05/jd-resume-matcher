import { useState } from "react";
import Button from "../ui/Button.jsx";
import { loginRequest } from "../../services/authService.js";
import { isSuccess } from "../../utils/success.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await loginRequest({ email, password });
      if (!isSuccess(res?.success)) {
        pushToast(res?.message || "Login failed");
        return;
      }
      login({ token: res.token, user: res.user });
      pushToast("Logged in successfully", "success");
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Network error during login";
      pushToast(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <div className="text-sm font-semibold text-slate-700">Email</div>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-700">Password</div>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl"
        variant="neon"
      >
        {busy ? "Signing in..." : "Login"}
      </Button>

      <div className="text-sm text-slate-600">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-ink hover:underline"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
