import { useMemo, useRef, useState } from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { analyzeRequest } from "../../services/analyzeService.js";
import { isSuccess } from "../../utils/success.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import ResultsPanel from "./ResultsPanel.jsx";
import { motion, AnimatePresence } from "framer-motion";

function LoadingBar({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="loadingbar"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-700">
                Analyzing your resume…
              </div>
              <div className="text-xs text-slate-500">Please wait</div>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-electric-500"
                initial={{ x: "-60%" }}
                animate={{ x: "120%" }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ width: "40%" }}
              />
            </div>

            <div className="mt-2 text-xs text-slate-500">
              This may take a few seconds depending on file size.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AnalyzeCard() {
  const { pushToast } = useToast();
  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [busy, setBusy] = useState(false);

  // “disable analyze forever until reset”
  const [locked, setLocked] = useState(false);

  const [result, setResult] = useState(null);

  const canAnalyze = useMemo(() => {
    return !!resumeFile && jobDescription.trim().length > 0 && !locked && !busy;
  }, [resumeFile, jobDescription, locked, busy]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setResumeFile(f);
  };

  const resetAll = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setBusy(false);
    setLocked(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) return;

    setBusy(true);
    setLocked(true);

    try {
      const res = await analyzeRequest({
        file: resumeFile,
        jobDescription: jobDescription.trim(),
      });

      if (!isSuccess(res?.success)) {
        pushToast(res?.message || "Analyze failed");
        return;
      }

      setResult(res?.data || null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Network error during analyze";
      pushToast(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Card className="p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            JD-Resume Matcher
          </h2>
          <p className="mt-2 text-slate-600">
            Upload your resume, paste the job description, and get actionable
            improvements.
          </p>
        </div>

        {/* Main two-column card */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Left: File upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-700">
              Upload your resume
            </div>
            <div className="mt-2 text-xs text-slate-500">
              PDF/DOC/DOCX/TXT
            </div>

            <label className="mt-4 block cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={onPickFile}
                className="hidden"
                disabled={locked}
              />
              <div
                className={[
                  "rounded-2xl border border-dashed p-6 text-center transition",
                  locked
                    ? "border-slate-200 bg-slate-50 text-slate-400"
                    : "border-brand-200 bg-brand-50 hover:bg-brand-100",
                ].join(" ")}
              >
                <div className="text-sm font-semibold">
                  {resumeFile ? resumeFile.name : "Click to upload resume"}
                </div>
                <div className="mt-1 text-xs">
                  {locked
                    ? "Reset to change file"
                    : "We only read this for matching"}
                </div>
              </div>
            </label>
          </div>

          {/* Right: JD textarea */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-700">
              Paste the job description here
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full JD…"
              disabled={locked}
              className="mt-4 h-44 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-300 disabled:bg-slate-50 disabled:text-slate-400"
            />
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="neon"
                disabled={!canAnalyze}
                onClick={runAnalyze}
                className="flex-1 py-3 rounded-xl"
              >
                {busy ? "Analyzing..." : "Analyze"}
              </Button>

              <Button
                variant="ghost"
                onClick={resetAll}
                className="py-3 rounded-xl"
                disabled={busy && !locked}
              >
                Reset
              </Button>
            </div>

            {locked && !result && !busy && (
              <div className="mt-3 text-xs text-slate-500">
                Analyze is locked. Use Reset to run again.
              </div>
            )}
          </div>
        </div>

        {/* Loading bar while waiting for results */}
        <LoadingBar active={busy && locked && !result} />

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.28 }}
              className="mt-8"
            >
              <ResultsPanel result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
