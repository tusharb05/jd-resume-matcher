export default function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-neon",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
