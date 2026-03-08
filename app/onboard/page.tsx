"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Design tokens (Apple light theme) ─────────────────────────────
const T = {
  pageBg: "#fbfbfd",
  cardBg: "#fff",
  subtleBg: "#f5f5f7",
  text: "#1d1d1f",
  secondary: "#86868b",
  tertiary: "#aeaeb2",
  accent: "#0071e3",
  border: "rgba(0,0,0,0.08)",
  cardRadius: 20,
  cardShadow: "0 1px 8px rgba(0,0,0,0.06)",
  pillRadius: 980,
  inputRadius: 12,
  selectedPillBg: "rgba(0,113,227,0.08)",
  selectedPillBorder: "rgba(0,113,227,0.3)",
} as const;

const STORAGE_KEY = "runmybiz_onboard_v2";

// ── Types ──────────────────────────────────────────────────────────
type Path = "existing" | "new" | null;

interface GoalQuestion {
  question: string;
  type: "text" | "pills";
  choices?: string[];
  placeholder?: string;
}

interface WizardState {
  path: Path;
  // Existing business fields
  website: string;
  whatSell: string;
  primaryCustomer: string;
  biggestChallenge: string;
  monthlyRevenue: string;
  customerCount: string;
  // New business fields
  businessIdea: string;
  ideaCategory: string;
  industry: string;
  stage: string;
  companyName: string;
  companyDescription: string;
  problemSolves: string;
  revenueModel: string;
  hasCustomers: string;
  biggestConcern: string;
  ninetyDayVision: string;
  // Shared
  aiGoalQuestions: GoalQuestion[];
  goalAnswers: string[];
  plan: string | null;
  currentStep: number;
}

const initialState: WizardState = {
  path: null,
  website: "",
  whatSell: "",
  primaryCustomer: "",
  biggestChallenge: "",
  monthlyRevenue: "",
  customerCount: "",
  businessIdea: "",
  ideaCategory: "",
  industry: "",
  stage: "",
  companyName: "",
  companyDescription: "",
  problemSolves: "",
  revenueModel: "",
  hasCustomers: "",
  biggestConcern: "",
  ninetyDayVision: "",
  aiGoalQuestions: [],
  goalAnswers: [],
  plan: null,
  currentStep: 0,
};

// ── Pill option sets ───────────────────────────────────────────────
const CHALLENGES = ["Growth", "Operations", "Marketing", "Product", "Funding", "Team"];
const REVENUES = ["Pre-revenue", "<$1K", "$1K–$10K", "$10K–$100K", "$100K+"];
const CUSTOMER_COUNTS = ["0", "1–10", "11–100", "100–1K", "1K+"];
const IDEA_CATEGORIES = ["SaaS", "E-commerce", "Consulting", "Agency", "Marketplace", "Creator", "Services", "Other"];
const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Retail", "Food & Bev", "Real Estate", "Media", "Fitness", "Other"];
const STAGES = ["Idea", "MVP", "Early Traction", "Growth", "Scale"];
const REVENUE_MODELS = ["Subscriptions", "One-time sales", "Services", "Ads", "Marketplace %", "Other"];
const HAS_CUSTOMERS_OPTIONS = ["Yes", "No", "In talks"];

// ── Styles ─────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    background: T.pageBg,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  card: {
    background: T.cardBg,
    borderRadius: T.cardRadius,
    boxShadow: T.cardShadow,
    border: `1px solid ${T.border}`,
    padding: "40px 36px",
    maxWidth: 520,
    width: "100%",
    position: "relative" as const,
    overflow: "hidden",
  } as React.CSSProperties,
  progress: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    height: 3,
    background: T.accent,
    borderRadius: "0 3px 3px 0",
    transition: "width 0.4s ease",
  } as React.CSSProperties,
  heading: {
    fontSize: 28,
    fontWeight: 700,
    color: T.text,
    marginBottom: 8,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  } as React.CSSProperties,
  subheading: {
    fontSize: 15,
    color: T.secondary,
    marginBottom: 28,
    lineHeight: 1.5,
  } as React.CSSProperties,
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: T.secondary,
    marginBottom: 6,
    display: "block",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    background: T.subtleBg,
    border: `1px solid ${T.border}`,
    borderRadius: T.inputRadius,
    color: T.text,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    background: T.subtleBg,
    border: `1px solid ${T.border}`,
    borderRadius: T.inputRadius,
    color: T.text,
    outline: "none",
    resize: "none" as const,
    minHeight: 100,
    lineHeight: 1.5,
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  primaryBtn: {
    width: "100%",
    padding: "14px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    background: T.accent,
    border: "none",
    borderRadius: T.pillRadius,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    marginTop: 24,
  } as React.CSSProperties,
  backLink: {
    fontSize: 14,
    color: T.accent,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 4,
  } as React.CSSProperties,
  pill: (selected: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: T.pillRadius,
    border: `1px solid ${selected ? T.selectedPillBorder : T.border}`,
    background: selected ? T.selectedPillBg : T.cardBg,
    color: selected ? T.accent : T.text,
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties),
  pathCard: (selected: boolean) => ({
    flex: 1,
    padding: "28px 20px",
    borderRadius: 16,
    border: `2px solid ${selected ? T.accent : T.border}`,
    background: selected ? T.selectedPillBg : T.cardBg,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center" as const,
  } as React.CSSProperties),
  slugPreview: {
    fontSize: 12,
    color: T.tertiary,
    marginTop: 4,
  } as React.CSSProperties,
  charCount: {
    fontSize: 12,
    color: T.tertiary,
    textAlign: "right" as const,
    marginTop: 4,
  } as React.CSSProperties,
  stepContainer: (direction: number) => ({
    animation: `slideIn 0.35s ease forwards`,
  } as React.CSSProperties),
  spinner: {
    width: 40,
    height: 40,
    border: `3px solid ${T.subtleBg}`,
    borderTopColor: T.accent,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 16px",
  } as React.CSSProperties,
  planStep: {
    padding: "14px 16px",
    background: T.subtleBg,
    borderRadius: 12,
    marginBottom: 8,
    fontSize: 14,
    color: T.text,
    lineHeight: 1.5,
  } as React.CSSProperties,
} as const;

// ── Inline keyframes ───────────────────────────────────────────────
const KEYFRAMES = `
@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
`;

// ── Helper components ──────────────────────────────────────────────
function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={styles.pill(value === opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function StageSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 0, borderRadius: T.pillRadius, overflow: "hidden", border: `1px solid ${T.border}` }}>
      {STAGES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s.toLowerCase().replace(" ", "-"))}
          style={{
            flex: 1,
            padding: "10px 6px",
            fontSize: 13,
            fontWeight: 500,
            border: "none",
            background: value === s.toLowerCase().replace(" ", "-") ? T.accent : T.cardBg,
            color: value === s.toLowerCase().replace(" ", "-") ? "#fff" : T.secondary,
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function AnalyzingSpinner() {
  const messages = [
    "Analyzing your business profile...",
    "Understanding your industry...",
    "Crafting personalized questions...",
    "Almost ready...",
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i < messages.length - 1 ? i + 1 : i));
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={styles.spinner} />
      <p style={{ color: T.secondary, fontSize: 15, animation: "fadeIn 0.3s ease" }} key={msgIdx}>
        {messages[msgIdx]}
      </p>
    </div>
  );
}

// ── Main wizard ────────────────────────────────────────────────────
export default function OnboardingWizard() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>(initialState);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resuming, setResuming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const triedResume = useRef(false);

  // Focus input on step change
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, [state.currentStep]);

  // Resume from sessionStorage
  useEffect(() => {
    if (triedResume.current) return;
    triedResume.current = true;

    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If we have a complete wizard state with plan, try to create company
        if (parsed.plan) {
          createCompanyAndRedirect(parsed);
          return;
        }
        setState(parsed);
      } catch {
        // Corrupt data, ignore
      }
    }
    setResuming(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback((partial: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...partial }));
    setError(null);
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  }, []);

  // Compute total steps and progress
  const totalSteps = state.path === "existing" ? 7 : state.path === "new" ? 8 : 1;
  const progressPct = ((state.currentStep + 1) / totalSteps) * 100;

  // Persist to sessionStorage on state change
  useEffect(() => {
    if (!resuming) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, resuming]);

  // ── AI Goal Generation ─────────────────────────────────────────
  const generateGoals = useCallback(async () => {
    setLoading(true);
    try {
      const body = state.path === "existing"
        ? {
            path: "existing",
            website: state.website,
            whatSell: state.whatSell,
            primaryCustomer: state.primaryCustomer,
            biggestChallenge: state.biggestChallenge,
            monthlyRevenue: state.monthlyRevenue,
            customerCount: state.customerCount,
          }
        : {
            path: "new",
            businessIdea: state.businessIdea,
            ideaCategory: state.ideaCategory,
            industry: state.industry,
            stage: state.stage,
            companyName: state.companyName,
            problemSolves: state.problemSolves,
            revenueModel: state.revenueModel,
            hasCustomers: state.hasCustomers,
            biggestConcern: state.biggestConcern,
            ninetyDayVision: state.ninetyDayVision,
          };

      const res = await fetch("/api/onboard/generate-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.success && json.data?.questions) {
        update({
          aiGoalQuestions: json.data.questions,
          goalAnswers: new Array(json.data.questions.length).fill(""),
        });
        goNext();
      } else {
        setError("Failed to generate questions. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [state, update, goNext]);

  // ── Plan Generation ────────────────────────────────────────────
  const generatePlan = useCallback(async () => {
    setLoading(true);
    try {
      const body = {
        path: state.path,
        website: state.website,
        whatSell: state.whatSell,
        primaryCustomer: state.primaryCustomer,
        biggestChallenge: state.biggestChallenge,
        monthlyRevenue: state.monthlyRevenue,
        customerCount: state.customerCount,
        businessIdea: state.businessIdea,
        ideaCategory: state.ideaCategory,
        industry: state.industry,
        stage: state.stage,
        companyName: state.companyName,
        companyDescription: state.companyDescription,
        problemSolves: state.problemSolves,
        revenueModel: state.revenueModel,
        hasCustomers: state.hasCustomers,
        biggestConcern: state.biggestConcern,
        ninetyDayVision: state.ninetyDayVision,
        goalAnswers: state.goalAnswers,
        aiGoalQuestions: state.aiGoalQuestions.map((q) => q.question),
      };

      const res = await fetch("/api/onboard/generate-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, generatePlan: true }),
      });
      const json = await res.json();

      if (json.success && json.data?.plan) {
        update({ plan: json.data.plan });
        goNext();
      } else {
        // Still advance with a placeholder
        update({ plan: "Your personalized 7-day plan will be generated after account creation." });
        goNext();
      }
    } catch {
      update({ plan: "Your personalized 7-day plan will be generated after account creation." });
      goNext();
    } finally {
      setLoading(false);
    }
  }, [state, update, goNext]);

  // ── Company creation and redirect to dashboard ──────────────────
  const createCompanyAndRedirect = async (wizardState: WizardState) => {
    setLoading(true);
    try {
      const isExisting = wizardState.path === "existing";
      const name = isExisting
        ? (wizardState.website.replace(/^https?:\/\//, "").replace(/\/$/, "").split(".")[0] || "My Company")
        : wizardState.companyName;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const description = isExisting
        ? wizardState.whatSell
        : wizardState.companyDescription || wizardState.businessIdea;

      const body = {
        name,
        slug,
        description,
        industry: wizardState.industry || wizardState.ideaCategory || "",
        stage: wizardState.stage || "idea",
        website: wizardState.website,
        path: wizardState.path,
        questionnaire: {
          whatSell: wizardState.whatSell,
          primaryCustomer: wizardState.primaryCustomer,
          biggestChallenge: wizardState.biggestChallenge,
          monthlyRevenue: wizardState.monthlyRevenue,
          customerCount: wizardState.customerCount,
          businessIdea: wizardState.businessIdea,
          ideaCategory: wizardState.ideaCategory,
          companyDescription: wizardState.companyDescription,
          problemSolves: wizardState.problemSolves,
          revenueModel: wizardState.revenueModel,
          hasCustomers: wizardState.hasCustomers,
          biggestConcern: wizardState.biggestConcern,
          ninetyDayVision: wizardState.ninetyDayVision,
          goalQuestions: wizardState.aiGoalQuestions.map((q, i) => ({
            question: q.question,
            answer: wizardState.goalAnswers[i] || "",
          })),
        },
        plan: wizardState.plan,
      };

      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.success) {
        sessionStorage.removeItem(STORAGE_KEY);
        router.push("/dashboard");
      } else {
        setError(json.error || "Something went wrong. Please try again.");
        setResuming(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setResuming(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = () => {
    // Save full state and create company, then redirect to dashboard
    const fullState = { ...state };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fullState));
    createCompanyAndRedirect(fullState);
  };

  // ── Step Renderers ─────────────────────────────────────────────

  // Step 0: Path selector (shared)
  const renderPathSelector = () => (
    <div style={styles.stepContainer(direction)}>
      <h1 style={styles.heading}>Let&apos;s get started</h1>
      <p style={styles.subheading}>Tell us where you are on your business journey.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={styles.pathCard(state.path === "existing")}
          onClick={() => { update({ path: "existing" }); goNext(); }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>&#x1F3E2;</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4 }}>I have a business</div>
          <div style={{ fontSize: 13, color: T.secondary }}>Import and optimize</div>
        </div>
        <div
          style={styles.pathCard(state.path === "new")}
          onClick={() => { update({ path: "new" }); goNext(); }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>&#x1F680;</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4 }}>I&apos;m starting one</div>
          <div style={{ fontSize: 13, color: T.secondary }}>Build from scratch</div>
        </div>
      </div>
    </div>
  );

  // ── Existing Business Steps ────────────────────────────────────

  const renderWebsite = () => (
    <div style={styles.stepContainer(direction)}>
      <button type="button" onClick={goBack} style={styles.backLink}>
        &#x2190; Back
      </button>
      <h1 style={styles.heading}>What&apos;s your website?</h1>
      <p style={styles.subheading}>We&apos;ll use this to learn about your business.</p>
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="url"
        value={state.website}
        onChange={(e) => update({ website: e.target.value })}
        placeholder="https://yourbusiness.com"
        style={styles.input}
        onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
        onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
        onKeyDown={(e) => { if (e.key === "Enter" && state.website.trim()) goNext(); }}
      />
      <button
        style={{ ...styles.primaryBtn, opacity: state.website.trim() ? 1 : 0.5 }}
        disabled={!state.website.trim()}
        onClick={goNext}
      >
        Continue
      </button>
    </div>
  );

  const renderExistingQuestion = (
    questionNum: number,
    question: string,
    field: keyof WizardState,
    type: "text" | "textarea" | "pills",
    options?: string[],
    placeholder?: string
  ) => {
    const val = state[field] as string;
    const canContinue = val.trim().length > 0;
    const isLastQuestion = questionNum === 5;

    return (
      <div style={styles.stepContainer(direction)}>
        <button type="button" onClick={goBack} style={styles.backLink}>
          &#x2190; Back
        </button>
        <p style={{ fontSize: 12, color: T.tertiary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Question {questionNum} of 5
        </p>
        <h1 style={{ ...styles.heading, fontSize: 24 }}>{question}</h1>
        {type === "pills" && options ? (
          <div style={{ marginTop: 16 }}>
            <PillGroup options={options} value={val} onChange={(v) => update({ [field]: v })} />
          </div>
        ) : type === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={val}
            onChange={(e) => update({ [field]: e.target.value })}
            placeholder={placeholder}
            style={styles.textarea}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={val}
            onChange={(e) => update({ [field]: e.target.value })}
            placeholder={placeholder}
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
            onKeyDown={(e) => { if (e.key === "Enter" && canContinue) { isLastQuestion ? generateGoals() : goNext(); } }}
          />
        )}
        <button
          style={{ ...styles.primaryBtn, opacity: canContinue ? 1 : 0.5 }}
          disabled={!canContinue}
          onClick={isLastQuestion ? generateGoals : goNext}
        >
          {isLastQuestion ? "Generate My Goals" : "Continue"}
        </button>
      </div>
    );
  };

  // ── New Business Steps ─────────────────────────────────────────

  const renderBusinessIdea = () => (
    <div style={styles.stepContainer(direction)}>
      <button type="button" onClick={goBack} style={styles.backLink}>
        &#x2190; Back
      </button>
      <h1 style={styles.heading}>What are you building?</h1>
      <p style={styles.subheading}>Describe your business idea in a few sentences.</p>
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={state.businessIdea}
        onChange={(e) => update({ businessIdea: e.target.value })}
        placeholder="e.g., An AI-powered meal planning app for busy professionals..."
        style={styles.textarea}
        onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
        onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
      />
      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 12, color: T.tertiary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Or pick a category
        </p>
        <PillGroup options={IDEA_CATEGORIES} value={state.ideaCategory} onChange={(v) => update({ ideaCategory: v })} />
      </div>
      <button
        style={{ ...styles.primaryBtn, opacity: state.businessIdea.trim() ? 1 : 0.5 }}
        disabled={!state.businessIdea.trim()}
        onClick={goNext}
      >
        Continue
      </button>
    </div>
  );

  const renderIndustryStage = () => (
    <div style={styles.stepContainer(direction)}>
      <button type="button" onClick={goBack} style={styles.backLink}>
        &#x2190; Back
      </button>
      <h1 style={styles.heading}>Industry &amp; Stage</h1>
      <p style={styles.subheading}>Help us understand your market and where you are.</p>
      <div style={{ marginBottom: 24 }}>
        <label style={styles.label}>Industry</label>
        <PillGroup options={INDUSTRIES} value={state.industry} onChange={(v) => update({ industry: v })} />
      </div>
      <div>
        <label style={styles.label}>Stage</label>
        <StageSelector value={state.stage} onChange={(v) => update({ stage: v })} />
      </div>
      <button
        style={{ ...styles.primaryBtn, opacity: state.industry && state.stage ? 1 : 0.5 }}
        disabled={!state.industry || !state.stage}
        onClick={goNext}
      >
        Continue
      </button>
    </div>
  );

  const renderCompanyIdentity = () => {
    const slug = state.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return (
      <div style={styles.stepContainer(direction)}>
        <button type="button" onClick={goBack} style={styles.backLink}>
          &#x2190; Back
        </button>
        <h1 style={styles.heading}>Company Identity</h1>
        <p style={styles.subheading}>What should we call it?</p>
        <div style={{ marginBottom: 20 }}>
          <label style={styles.label}>Company Name</label>
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={state.companyName}
            onChange={(e) => update({ companyName: e.target.value })}
            placeholder="My Awesome Company"
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
          {slug && <p style={styles.slugPreview}>{slug}.runmybiz.app</p>}
        </div>
        <div>
          <label style={styles.label}>Short Description</label>
          <textarea
            value={state.companyDescription}
            onChange={(e) => { if (e.target.value.length <= 280) update({ companyDescription: e.target.value }); }}
            placeholder="A one-liner about what your company does..."
            style={{ ...styles.textarea, minHeight: 80 }}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
          <p style={styles.charCount}>{state.companyDescription.length}/280</p>
        </div>
        <button
          style={{ ...styles.primaryBtn, opacity: state.companyName.trim() ? 1 : 0.5 }}
          disabled={!state.companyName.trim()}
          onClick={goNext}
        >
          Continue
        </button>
      </div>
    );
  };

  const renderNewQuestion = (
    questionNum: number,
    question: string,
    field: keyof WizardState,
    type: "text" | "textarea" | "pills",
    options?: string[],
    placeholder?: string
  ) => {
    const val = state[field] as string;
    const canContinue = val.trim().length > 0;
    const isLastQuestion = questionNum === 5;

    return (
      <div style={styles.stepContainer(direction)}>
        <button type="button" onClick={goBack} style={styles.backLink}>
          &#x2190; Back
        </button>
        <p style={{ fontSize: 12, color: T.tertiary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Question {questionNum} of 5
        </p>
        <h1 style={{ ...styles.heading, fontSize: 24 }}>{question}</h1>
        {type === "pills" && options ? (
          <div style={{ marginTop: 16 }}>
            <PillGroup options={options} value={val} onChange={(v) => update({ [field]: v })} />
          </div>
        ) : type === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={val}
            onChange={(e) => update({ [field]: e.target.value })}
            placeholder={placeholder}
            style={styles.textarea}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={val}
            onChange={(e) => update({ [field]: e.target.value })}
            placeholder={placeholder}
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
            onKeyDown={(e) => { if (e.key === "Enter" && canContinue) { isLastQuestion ? generateGoals() : goNext(); } }}
          />
        )}
        <button
          style={{ ...styles.primaryBtn, opacity: canContinue ? 1 : 0.5 }}
          disabled={!canContinue}
          onClick={isLastQuestion ? generateGoals : goNext}
        >
          {isLastQuestion ? "Generate My Goals" : "Continue"}
        </button>
      </div>
    );
  };

  // ── AI Goal Questions (shared) ─────────────────────────────────
  const [goalSubStep, setGoalSubStep] = useState(0);

  const renderGoalQuestion = () => {
    const q = state.aiGoalQuestions[goalSubStep];
    if (!q) return null;
    const answer = state.goalAnswers[goalSubStep] || "";
    const canContinue = answer.trim().length > 0;
    const isLast = goalSubStep === state.aiGoalQuestions.length - 1;

    const updateAnswer = (val: string) => {
      const updated = [...state.goalAnswers];
      updated[goalSubStep] = val;
      update({ goalAnswers: updated });
    };

    return (
      <div style={styles.stepContainer(direction)}>
        <button
          type="button"
          onClick={() => { if (goalSubStep > 0) setGoalSubStep(goalSubStep - 1); else goBack(); }}
          style={styles.backLink}
        >
          &#x2190; Back
        </button>
        <p style={{ fontSize: 12, color: T.tertiary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Goal {goalSubStep + 1} of {state.aiGoalQuestions.length}
        </p>
        <h1 style={{ ...styles.heading, fontSize: 24 }}>{q.question}</h1>
        {q.type === "pills" && q.choices ? (
          <div style={{ marginTop: 16 }}>
            <PillGroup options={q.choices} value={answer} onChange={updateAnswer} />
          </div>
        ) : (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={answer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder={q.placeholder || "Your answer..."}
            style={styles.textarea}
            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.selectedPillBg}`; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
        )}
        <button
          style={{ ...styles.primaryBtn, opacity: canContinue ? 1 : 0.5 }}
          disabled={!canContinue}
          onClick={() => {
            if (isLast) {
              generatePlan();
            } else {
              setGoalSubStep(goalSubStep + 1);
            }
          }}
        >
          {isLast ? "See My Plan" : "Continue"}
        </button>
      </div>
    );
  };

  // ── Plan Preview (shared) ──────────────────────────────────────
  const renderPlanPreview = () => {
    const planSteps = state.plan
      ? state.plan.split("\n").filter((l) => l.trim())
      : ["Your plan will be generated after account creation."];

    return (
      <div style={styles.stepContainer(direction)}>
        <button type="button" onClick={goBack} style={styles.backLink}>
          &#x2190; Back
        </button>
        <h1 style={styles.heading}>Your 7-Day Plan</h1>
        <p style={styles.subheading}>Here&apos;s what your AI agent will focus on first.</p>
        <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 8 }}>
          {planSteps.map((step, i) => (
            <div key={i} style={styles.planStep}>{step}</div>
          ))}
        </div>
        <button style={styles.primaryBtn} onClick={goNext}>
          Launch My Business
        </button>
      </div>
    );
  };

  // ── Launch (redirects to dashboard) ────────────────────────────
  const renderLaunch = () => (
    <div style={styles.stepContainer(direction)}>
      <button type="button" onClick={goBack} style={styles.backLink}>
        &#x2190; Back
      </button>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#x2728;</div>
        <h1 style={styles.heading}>Ready to launch!</h1>
        <p style={styles.subheading}>
          Everything is set up. Let&apos;s activate your AI agent and get to work.
        </p>
        <button style={styles.primaryBtn} onClick={handleLaunch}>
          {loading ? "Creating..." : "Launch My Business"}
        </button>
        {error && (
          <p style={{ color: "#ff3b30", fontSize: 14, marginTop: 12 }}>{error}</p>
        )}
      </div>
    </div>
  );

  // ── Step Router ────────────────────────────────────────────────
  const renderStep = () => {
    // Loading states
    if (resuming || (loading && state.currentStep === 0)) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={styles.spinner} />
          <p style={{ color: T.secondary, fontSize: 15 }}>Setting up...</p>
        </div>
      );
    }

    if (loading) return <AnalyzingSpinner />;

    const step = state.currentStep;

    // Step 0: Path selector (both paths)
    if (step === 0) return renderPathSelector();

    // ── Path A: Existing Business ────────────────────────────────
    if (state.path === "existing") {
      switch (step) {
        case 1: return renderWebsite();
        case 2: return renderExistingQuestion(1, "What does your business sell or offer?", "whatSell", "textarea", undefined, "e.g., We sell handmade candles online...");
        case 3: return renderExistingQuestion(2, "Who is your primary customer?", "primaryCustomer", "text", undefined, "e.g., Health-conscious millennials in urban areas...");
        case 4: return renderExistingQuestion(3, "Biggest challenge right now?", "biggestChallenge", "pills", CHALLENGES);
        case 5: return renderExistingQuestion(4, "Approximate monthly revenue?", "monthlyRevenue", "pills", REVENUES);
        case 6: return renderExistingQuestion(5, "How many customers/users today?", "customerCount", "pills", CUSTOMER_COUNTS);
        // After question 5, generateGoals() fires -> step 7
        case 7: return renderGoalQuestion();
        // After all goals answered, generatePlan() fires -> step 8
        case 8: return renderPlanPreview();
        case 9: return renderLaunch();
        default: return renderPathSelector();
      }
    }

    // ── Path B: New Business ─────────────────────────────────────
    if (state.path === "new") {
      switch (step) {
        case 1: return renderBusinessIdea();
        case 2: return renderIndustryStage();
        case 3: return renderCompanyIdentity();
        case 4: return renderNewQuestion(1, "What problem does this solve, and for whom?", "problemSolves", "textarea", undefined, "e.g., Busy parents who can't find healthy meal options...");
        case 5: return renderNewQuestion(2, "How do you plan to make money?", "revenueModel", "pills", REVENUE_MODELS);
        case 6: return renderNewQuestion(3, "Do you have paying customers yet?", "hasCustomers", "pills", HAS_CUSTOMERS_OPTIONS);
        case 7: return renderNewQuestion(4, "Biggest concern about building this?", "biggestConcern", "textarea", undefined, "e.g., Not sure how to find my first customers...");
        case 8: return renderNewQuestion(5, "What would success look like in 90 days?", "ninetyDayVision", "textarea", undefined, "e.g., 100 paying subscribers and $5K MRR...");
        // After question 5, generateGoals() fires -> step 9
        case 9: return renderGoalQuestion();
        // After all goals answered, generatePlan() fires -> step 10
        case 10: return renderPlanPreview();
        case 11: return renderLaunch();
        default: return renderPathSelector();
      }
    }

    return renderPathSelector();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ ...styles.progress, width: `${progressPct}%` }} />
          {renderStep()}
        </div>
      </div>
    </>
  );
}
