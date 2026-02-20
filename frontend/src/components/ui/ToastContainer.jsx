import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../contexts/ToastContext.jsx";
import Button from "./Button.jsx";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-sm space-y-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 12, x: 10 }}
            transition={{ duration: 0.22 }}
            className={[
              "rounded-2xl border p-4 shadow-lg bg-white",
              t.type === "success"
                ? "border-brand-200"
                : t.type === "info"
                ? "border-blue-200"
                : "border-red-200",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-1 h-2.5 w-2.5 rounded-full",
                  t.type === "success"
                    ? "bg-brand-500"
                    : t.type === "info"
                    ? "bg-blue-500"
                    : "bg-red-500",
                ].join(" ")}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  {t.type === "success"
                    ? "Success"
                    : t.type === "info"
                    ? "Info"
                    : "Error"}
                </div>
                <div className="text-sm text-slate-700 mt-0.5">{t.message}</div>
              </div>
              <Button
                variant="ghost"
                className="px-2 py-1 rounded-lg"
                onClick={() => removeToast(t.id)}
              >
                ✕
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
