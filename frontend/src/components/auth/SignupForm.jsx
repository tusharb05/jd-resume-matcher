import { useState } from "react";
import Button from "../ui/Button.jsx";
import { signupRequest } from "../../services/authService.js";
import { isSuccess } from "../../utils/success.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await signupRequest({ email, password });
      if (!isSuccess(res?.success)) {
        pushToast(res?.message || "Signup failed");
        return;
      }
      login({ token: res.token, user: res.user });
      pushToast("Account created", "success");
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Network error during signup";
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
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl"
        variant="neon"
      >
        {busy ? "Creating..." : "Sign up"}
      </Button>

      <div className="text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-ink hover:underline"
        >
          Login
        </button>
      </div>
    </form>
  );
}
