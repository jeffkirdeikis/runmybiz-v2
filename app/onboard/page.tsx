"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Lightbulb,
  Globe,
  Users,
  Target,
  Rocket,
  CheckCircle2,
  Loader2,
  Sparkles,
  Bot,
  BarChart3,
  PenTool,
  Megaphone,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────── types ──────────────────────────────── */

interface FormData {
  path: "existing" | "new" | null;
  // existing business
  companyName: string;
  website: string;
  whatYouSell: string;
  primaryCustomer: string;
  biggestChallenge: string;
  // new idea
  businessIdea: string;
  category: string;
  // goals
  goals: string[];
}

const STORAGE_KEY = "runmybiz-onboard";

const INITIAL: FormData = {
  path: null,
  companyName: "",
  website: "",
  whatYouSell: "",
  primaryCustomer: "",
  biggestChallenge: "",
  businessIdea: "",
  category: "",
  goals: [],
};

/* ────────────────────── data ───────────────────────────────── */

const CHALLENGES = [
  "Getting more customers",
  "Increasing revenue",
  "Reducing costs",
  "Building online presence",
  "Managing operations",
  "Content creation",
];

const CATEGORIES = [
  "SaaS",
  "E-commerce",
  "Services",
  "Agency",
  "Marketplace",
  "Other",
];

const GOAL_OPTIONS_EXISTING = [
  "Grow email list",
  "Launch social media",
  "Improve SEO",
  "Run paid ads",
  "Build landing page",
  "Set up analytics",
  "Create content calendar",
  "Automate customer emails",
];

const GOAL_OPTIONS_NEW = [
  "Validate business idea",
  "Build landing page",
  "Launch social media",
  "Create brand identity",
  "Set up analytics",
  "Build email waitlist",
  "Create content calendar",
  "Research competitors",
];

const AGENTS = [
  {
    name: "Marketing Agent",
    role: "Campaigns, SEO, and ads",
    icon: Megaphone,
    color: "#0071e3",
  },
  {
    name: "Content Agent",
    role: "Blog posts, social media, and email",
    icon: PenTool,
    color: "#ff9500",
  },
  {
    name: "Analytics Agent",
    role: "Reports, metrics, and forecasts",
    icon: BarChart3,
    color: "#34c759",
  },
  {
    name: "Operations Agent",
    role: "Workflows, docs, and automation",
    icon: Settings,
    color: "#af52de",
  },
];

/* ────────────────────── helpers ─────────────────────────────── */

function loadFormData(): FormData {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...INITIAL, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return INITIAL;
}

function saveFormData(data: FormData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/* ────────────────────── step indicator ──────────────────────── */

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isCompleted = step < current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                isActive && "bg-[#0071e3] text-white",
                isCompleted && "bg-[#34c759] text-white",
                !isActive && !isCompleted && "bg-[#f5f5f7] text-[#86868b]"
              )}
            >
              {isCompleted ? <CheckCircle2 size={16} /> : step}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 rounded-full transition-all duration-300",
                  step < current ? "bg-[#34c759]" : "bg-[#e5e5e7]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────── step 1: path ───────────────────────── */

function Step1({
  data,
  onUpdate,
  onNext,
}: {
  data: FormData;
  onUpdate: (d: Partial<FormData>) => void;
  onNext: () => void;
}) {
  const select = (path: "existing" | "new") => {
    onUpdate({ path });
    // Small delay so user sees the selection
    setTimeout(onNext, 200);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">
          Do you already have a business?
        </h1>
        <p className="mt-2 text-[#86868b]">
          This helps us tailor your experience.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => select("existing")}
          className={cn(
            "card card-hover flex flex-col items-center gap-4 p-8 text-center transition-all",
            data.path === "existing" && "border-[#0071e3] bg-[#f0f5ff]"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f7]">
            <Building2 size={28} className="text-[#0071e3]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              Yes, I have a business
            </h3>
            <p className="mt-1 text-sm text-[#86868b]">
              Let&apos;s optimize and grow what you&apos;ve built.
            </p>
          </div>
        </button>

        <button
          onClick={() => select("new")}
          className={cn(
            "card card-hover flex flex-col items-center gap-4 p-8 text-center transition-all",
            data.path === "new" && "border-[#0071e3] bg-[#f0f5ff]"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f7]">
            <Lightbulb size={28} className="text-[#ff9500]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              I have a new idea
            </h3>
            <p className="mt-1 text-sm text-[#86868b]">
              Let&apos;s validate and launch your concept.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── step 2: details ─────────────────────── */

function Step2Existing({
  data,
  onUpdate,
}: {
  data: FormData;
  onUpdate: (d: Partial<FormData>) => void;
}) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">
          Tell us about your business
        </h1>
        <p className="mt-2 text-[#86868b]">
          We&apos;ll use this to build your custom AI plan.
        </p>
      </div>

      <div className="space-y-5 pt-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            Company name <span className="text-[#ff3b30]">*</span>
          </label>
          <input
            className="input"
            placeholder="e.g. Acme Co"
            value={data.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            Website URL
          </label>
          <div className="relative">
            <Globe
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]"
            />
            <input
              className="input pl-9"
              placeholder="https://yoursite.com"
              value={data.website}
              onChange={(e) => onUpdate({ website: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            What do you sell? <span className="text-[#ff3b30]">*</span>
          </label>
          <textarea
            className="input"
            rows={2}
            placeholder="e.g. Online courses for small business owners"
            value={data.whatYouSell}
            onChange={(e) => onUpdate({ whatYouSell: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            Who is your primary customer?{" "}
            <span className="text-[#ff3b30]">*</span>
          </label>
          <div className="relative">
            <Users
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]"
            />
            <input
              className="input pl-9"
              placeholder="e.g. Solo entrepreneurs aged 25-45"
              value={data.primaryCustomer}
              onChange={(e) => onUpdate({ primaryCustomer: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            Biggest challenge right now{" "}
            <span className="text-[#ff3b30]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CHALLENGES.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ biggestChallenge: c })}
                className={cn(
                  "pill",
                  data.biggestChallenge === c && "pill-active"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2New({
  data,
  onUpdate,
}: {
  data: FormData;
  onUpdate: (d: Partial<FormData>) => void;
}) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">
          Tell us about your idea
        </h1>
        <p className="mt-2 text-[#86868b]">
          We&apos;ll help you validate and launch.
        </p>
      </div>

      <div className="space-y-5 pt-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            Describe your business idea{" "}
            <span className="text-[#ff3b30]">*</span>
          </label>
          <textarea
            className="input"
            rows={3}
            placeholder="e.g. An app that helps freelancers track their expenses and send invoices"
            value={data.businessIdea}
            onChange={(e) => onUpdate({ businessIdea: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1d1d1f]">
            Category <span className="text-[#ff3b30]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ category: c })}
                className={cn("pill", data.category === c && "pill-active")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── step 3: goals ──────────────────────── */

function Step3({
  data,
  onUpdate,
}: {
  data: FormData;
  onUpdate: (d: Partial<FormData>) => void;
}) {
  const options =
    data.path === "existing" ? GOAL_OPTIONS_EXISTING : GOAL_OPTIONS_NEW;

  const toggleGoal = (goal: string) => {
    const current = data.goals;
    if (current.includes(goal)) {
      onUpdate({ goals: current.filter((g) => g !== goal) });
    } else if (current.length < 5) {
      onUpdate({ goals: [...current, goal] });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">
          What are your top priorities?
        </h1>
        <p className="mt-2 text-[#86868b]">
          Select 3 to 5 goals. Your AI team will focus here first.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {options.map((goal) => {
          const selected = data.goals.includes(goal);
          return (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={cn(
                "pill px-5 py-2.5 text-sm",
                selected && "pill-active"
              )}
            >
              {selected && <CheckCircle2 size={14} className="mr-1" />}
              {goal}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-[#86868b]">
        {data.goals.length}/5 selected
        {data.goals.length < 3 && " (pick at least 3)"}
      </p>
    </div>
  );
}

/* ────────────────────── step 4: review ─────────────────────── */

function Step4({
  data,
  onLaunch,
  loading,
}: {
  data: FormData;
  onLaunch: () => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-[#f5f5f7] border-t-[#0071e3]" style={{ animation: "spin-slow 1s linear infinite" }} />
          <Sparkles
            size={20}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0071e3]"
          />
        </div>
        <h2 className="mt-6 text-xl font-bold text-[#1d1d1f]">
          AI is analyzing your business...
        </h2>
        <p className="mt-2 text-sm text-[#86868b]">
          Building your 30-day action plan. This takes just a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1d1d1f] md:text-3xl">
          Your AI team is ready.
        </h1>
        <p className="mt-2 text-[#86868b]">
          Review your setup and launch when you&apos;re ready.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-8 space-y-4">
        <div className="card p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Business Details
          </h3>
          <div className="space-y-2 text-sm">
            {data.path === "existing" ? (
              <>
                <SummaryRow label="Company" value={data.companyName} />
                {data.website && (
                  <SummaryRow label="Website" value={data.website} />
                )}
                <SummaryRow label="Product" value={data.whatYouSell} />
                <SummaryRow label="Customer" value={data.primaryCustomer} />
                <SummaryRow label="Challenge" value={data.biggestChallenge} />
              </>
            ) : (
              <>
                <SummaryRow label="Idea" value={data.businessIdea} />
                <SummaryRow label="Category" value={data.category} />
              </>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Priorities
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.goals.map((g) => (
              <span key={g} className="badge badge-blue">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Agent team */}
        <div className="card p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Your AI Team
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center gap-3 rounded-lg bg-[#f5f5f7] p-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: agent.color + "14" }}
                >
                  <agent.icon size={18} style={{ color: agent.color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1d1d1f]">
                    {agent.name}
                  </p>
                  <p className="text-xs text-[#86868b]">{agent.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onLaunch}
        className="btn btn-primary mt-8 w-full py-4 text-base"
      >
        <Rocket size={18} />
        Launch My Business
      </button>

      <p className="mt-3 text-center text-xs text-[#86868b]">
        You can change these settings anytime from your dashboard.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-20 shrink-0 text-[#86868b]">{label}</span>
      <span className="text-[#1d1d1f]">{value}</span>
    </div>
  );
}

/* ────────────────────── main wizard ────────────────────────── */

export default function OnboardPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [launching, setLaunching] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage after mount
  useEffect(() => {
    const saved = loadFormData();
    setData(saved);
    // Restore step based on data completeness
    if (saved.path && saved.goals.length >= 3) {
      setStep(4);
    } else if (saved.path && (saved.companyName || saved.businessIdea)) {
      setStep(3);
    } else if (saved.path) {
      setStep(2);
    }
    setHydrated(true);
  }, []);

  // Persist on changes
  useEffect(() => {
    if (hydrated) saveFormData(data);
  }, [data, hydrated]);

  const update = useCallback(
    (partial: Partial<FormData>) =>
      setData((prev) => ({ ...prev, ...partial })),
    []
  );

  const canAdvance = useCallback((): boolean => {
    switch (step) {
      case 1:
        return data.path !== null;
      case 2:
        if (data.path === "existing") {
          return !!(
            data.companyName.trim() &&
            data.whatYouSell.trim() &&
            data.primaryCustomer.trim() &&
            data.biggestChallenge
          );
        }
        return !!(data.businessIdea.trim() && data.category);
      case 3:
        return data.goals.length >= 3;
      default:
        return true;
    }
  }, [step, data]);

  const next = useCallback(() => {
    if (canAdvance() && step < 4) setStep((s) => s + 1);
  }, [canAdvance, step]);

  const back = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  const launch = useCallback(async () => {
    setLaunching(true);
    try {
      await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      /* API may not exist yet -- proceed anyway */
    }
    // Simulate loading
    await new Promise((r) => setTimeout(r, 2500));
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = "/dashboard";
  }, [data]);

  // Prevent flash before hydration
  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={24} className="text-[#86868b]" style={{ animation: "spin-slow 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} total={4} />

      <div className="min-h-[400px]">
        {step === 1 && <Step1 data={data} onUpdate={update} onNext={next} />}

        {step === 2 &&
          (data.path === "existing" ? (
            <Step2Existing data={data} onUpdate={update} />
          ) : (
            <Step2New data={data} onUpdate={update} />
          ))}

        {step === 3 && <Step3 data={data} onUpdate={update} />}

        {step === 4 && (
          <Step4 data={data} onLaunch={launch} loading={launching} />
        )}
      </div>

      {/* Navigation buttons (hidden on step 1 and during launch) */}
      {step > 1 && !launching && (
        <div className="mt-10 flex items-center justify-between">
          <button onClick={back} className="btn btn-ghost">
            <ArrowLeft size={16} />
            Back
          </button>

          {step < 4 && (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="btn btn-primary"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
