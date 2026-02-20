export default function Button({
  className = "",
  disabled,
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 focus:ring-offset-paper";

  const variants = {
    primary:
      "bg-ink text-white hover:opacity-90 disabled:bg-slate-300 disabled:text-slate-600",
    ghost:
      "bg-transparent text-ink hover:bg-slate-100 disabled:text-slate-400 disabled:hover:bg-transparent",
    neon:
      "bg-brand-500 text-ink hover:bg-brand-400 disabled:bg-slate-300 disabled:text-slate-600",
  };

  return (
    <button
      disabled={disabled}
      className={[base, variants[variant], className].join(" ")}
      {...props}
    />
  );
}
