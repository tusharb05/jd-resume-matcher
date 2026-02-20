import { motion } from "framer-motion";
import Card from "../ui/Card.jsx";
import Chip from "../ui/Chip.jsx";

function pct(n) {
  if (typeof n !== "number") return "—";
  return `${n.toFixed(2)}%`;
}

export default function ResultsPanel({ result }) {
  const summary = result?.match_summary;
  const suggestions = result?.improvement_suggestions;

  const matchPercent = summary?.match_percent ?? null;
  const matched = summary?.matched_skills || [];
  const missing = summary?.missing_skills || [];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-600">
                Match summary
              </div>
              <div className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
                {pct(matchPercent)} match
              </div>
              <div className="mt-3 h-2.5 w-full md:w-[420px] rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-electric-500"
                  style={{
                    width:
                      typeof matchPercent === "number"
                        ? `${Math.max(0, Math.min(100, matchPercent))}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">
                Interpretation
              </div>
              <div className="mt-1 text-sm text-slate-700">
                Focus first on missing skills + resume line fixes to lift the score.
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-700">
              Matched skills
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {matched.length ? (
                matched.map((s) => (
                  <Chip key={s} tone="good">
                    {s}
                  </Chip>
                ))
              ) : (
                <div className="text-sm text-slate-500">None detected</div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-700">
              Missing skills
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {missing.length ? (
                missing.map((s) => (
                  <Chip key={s} tone="bad">
                    {s}
                  </Chip>
                ))
              ) : (
                <div className="text-sm text-slate-500">None — great fit</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
      >
        <Card className="p-6">
          <div className="text-sm font-semibold text-slate-700">
            Improvement suggestions
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Section title="Skills to learn">
              <List items={suggestions?.skills_to_learn || []} />
            </Section>

            <Section title="Recommended certifications">
              <List
                items={suggestions?.recommended_certifications || []}
                emptyText="No certifications suggested"
              />
            </Section>

            <div className="md:col-span-2">
              <Section title="Suggested projects">
                <List items={suggestions?.suggested_projects || []} />
              </Section>
            </div>

            <Section title="Resume line improvements">
              <List items={suggestions?.resume_line_improvements || []} />
            </Section>

            <Section title="Section-level feedback">
              <List items={suggestions?.section_level_feedback || []} />
            </Section>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-semibold text-slate-500">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function List({ items, emptyText = "No items" }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-slate-500">{emptyText}</div>;
  }
  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {items.map((it, idx) => (
        <li key={`${idx}-${String(it).slice(0, 16)}`} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
