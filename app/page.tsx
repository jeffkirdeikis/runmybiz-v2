"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Megaphone,
  ShoppingCart,
  Code2,
  Settings,
  PenTool,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Bot,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ───────────────────────────── data ───────────────────────────── */

const STEPS = [
  {
    num: "1",
    title: "Tell us about your business",
    desc: "Answer 5 quick questions about what you do, who you serve, and where you want to go.",
    icon: Target,
  },
  {
    num: "2",
    title: "AI builds your plan",
    desc: "A 30-day action plan is generated instantly, tailored to your business and goals.",
    icon: Zap,
  },
  {
    num: "3",
    title: "Watch it execute",
    desc: "Your AI team handles the rest -- marketing, content, analytics, and more.",
    icon: BarChart3,
  },
];

type Department =
  | "All"
  | "Marketing"
  | "Sales"
  | "Engineering"
  | "Operations"
  | "Content"
  | "Analytics";

const DEPARTMENTS: Department[] = [
  "All",
  "Marketing",
  "Sales",
  "Engineering",
  "Operations",
  "Content",
  "Analytics",
];

const DEPT_ICONS: Record<Exclude<Department, "All">, React.ElementType> = {
  Marketing: Megaphone,
  Sales: ShoppingCart,
  Engineering: Code2,
  Operations: Settings,
  Content: PenTool,
  Analytics: TrendingUp,
};

interface Task {
  dept: Exclude<Department, "All">;
  task: string;
}

const TASKS: Task[] = [
  { dept: "Marketing", task: "Write and schedule social media posts" },
  { dept: "Marketing", task: "Create Facebook & Google ad campaigns" },
  { dept: "Marketing", task: "Build email drip sequences" },
  { dept: "Marketing", task: "Optimize landing pages for conversions" },
  { dept: "Marketing", task: "Run A/B tests on headlines" },
  { dept: "Sales", task: "Qualify and score inbound leads" },
  { dept: "Sales", task: "Draft personalized outreach emails" },
  { dept: "Sales", task: "Follow up with cold prospects" },
  { dept: "Sales", task: "Generate weekly pipeline reports" },
  { dept: "Sales", task: "Create proposal templates" },
  { dept: "Engineering", task: "Build landing pages and microsites" },
  { dept: "Engineering", task: "Set up analytics tracking pixels" },
  { dept: "Engineering", task: "Integrate CRM and email tools" },
  { dept: "Engineering", task: "Fix website performance issues" },
  { dept: "Engineering", task: "Deploy chatbots for support" },
  { dept: "Operations", task: "Create SOPs and process docs" },
  { dept: "Operations", task: "Automate invoice generation" },
  { dept: "Operations", task: "Set up project management workflows" },
  { dept: "Operations", task: "Monitor uptime and system health" },
  { dept: "Operations", task: "Manage vendor communications" },
  { dept: "Content", task: "Write blog posts and articles" },
  { dept: "Content", task: "Create newsletter content" },
  { dept: "Content", task: "Design social media graphics" },
  { dept: "Content", task: "Produce video scripts" },
  { dept: "Content", task: "Write product descriptions" },
  { dept: "Analytics", task: "Track key business metrics" },
  { dept: "Analytics", task: "Generate weekly performance reports" },
  { dept: "Analytics", task: "Monitor competitor activity" },
  { dept: "Analytics", task: "Analyze customer behavior patterns" },
  { dept: "Analytics", task: "Forecast revenue trends" },
];

const DEMO_EVENTS = [
  {
    agent: "Marketing Agent",
    action: 'Published blog post: "5 Growth Hacks for Q1"',
    time: "2 min ago",
    color: "#0071e3",
  },
  {
    agent: "Sales Agent",
    action: "Qualified 3 new leads from website form",
    time: "5 min ago",
    color: "#34c759",
  },
  {
    agent: "Content Agent",
    action: "Scheduled 7 social media posts for next week",
    time: "8 min ago",
    color: "#ff9500",
  },
  {
    agent: "Analytics Agent",
    action: "Weekly report ready: Revenue up 12%",
    time: "12 min ago",
    color: "#af52de",
  },
  {
    agent: "Operations Agent",
    action: "Sent 14 invoice reminders to overdue accounts",
    time: "18 min ago",
    color: "#ff3b30",
  },
  {
    agent: "Engineering Agent",
    action: "Landing page speed improved by 34%",
    time: "24 min ago",
    color: "#5ac8fa",
  },
  {
    agent: "Marketing Agent",
    action: "A/B test winner found: Headline B (+22% CTR)",
    time: "30 min ago",
    color: "#0071e3",
  },
  {
    agent: "Sales Agent",
    action: "Sent 8 personalized follow-up emails",
    time: "35 min ago",
    color: "#34c759",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    desc: "For solo founders getting started",
    features: [
      "1 business",
      "3 agent cycles/day",
      "Morning briefing email",
      "Basic analytics dashboard",
      "Email support",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$99",
    period: "/mo",
    desc: "For growing businesses ready to scale",
    features: [
      "3 businesses",
      "Unlimited agent cycles",
      "Real-time dashboard",
      "Advanced analytics",
      "Priority support",
      "Custom agent instructions",
    ],
    cta: "Start Free",
    featured: true,
  },
  {
    name: "Scale",
    price: "$299",
    period: "/mo",
    desc: "For agencies and multi-business operators",
    features: [
      "10 businesses",
      "Unlimited agent cycles",
      "White-label reports",
      "API access",
      "Dedicated success manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const FAQS = [
  {
    q: "What exactly do the AI agents do?",
    a: "Our AI agents handle real business tasks across marketing, sales, content, analytics, operations, and engineering. They write blog posts, schedule social media, qualify leads, generate reports, and much more -- all autonomously.",
  },
  {
    q: "Do I need any technical skills?",
    a: "Not at all. You answer a few questions about your business, and the AI handles everything. The interface is as simple as checking your email.",
  },
  {
    q: "Can I control what the AI does?",
    a: "Absolutely. You set the priorities and approve key actions. The AI suggests and executes, but you always have final say. You can also adjust agent instructions at any time.",
  },
  {
    q: "How is this different from ChatGPT or other AI tools?",
    a: "ChatGPT answers questions. RunMyBiz takes action. Our agents don't just suggest what to do -- they actually do it. They write the content, send the emails, generate the reports, and track the results.",
  },
  {
    q: "Is my business data secure?",
    a: "Yes. We use enterprise-grade encryption, and your data is never shared with other customers or used to train models. You can delete your data at any time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, no contracts and no commitments. Cancel anytime from your dashboard and you won't be charged again.",
  },
];

/* ───────────────────────── helpers ─────────────────────────── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </section>
  );
}

/* ───────────────────── components ──────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#e5e5e7]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0071e3]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-[#1d1d1f]">
            RunMyBiz
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-[#86868b] no-underline hover:text-[#1d1d1f] transition-colors"
          >
            How it Works
          </a>
          <a
            href="#capabilities"
            className="text-sm text-[#86868b] no-underline hover:text-[#1d1d1f] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            className="text-sm text-[#86868b] no-underline hover:text-[#1d1d1f] transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm text-[#86868b] no-underline hover:text-[#1d1d1f] transition-colors"
          >
            FAQ
          </a>
        </div>

        <a href="/onboard" className="btn btn-primary text-sm no-underline">
          Get Started
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Subtle gradient orb */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-b from-[#0071e3]/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e7] bg-[#fbfbfd] px-4 py-1.5 text-xs font-medium text-[#86868b]">
          <div className="status-dot status-dot-green status-dot-pulse" />
          AI agents working right now
        </div>

        <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#1d1d1f] md:text-7xl">
          Your business,
          <br />
          <span className="text-[#0071e3]">on autopilot.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#86868b] md:text-xl">
          Your AI team works around the clock -- planning, executing, and
          optimizing. Wake up to real progress.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/onboard"
            className="btn btn-primary px-8 py-3 text-base no-underline"
          >
            Start Free
            <ArrowRight size={18} />
          </a>
          <a
            href="/dashboard"
            className="btn btn-secondary px-8 py-3 text-base no-underline"
          >
            See Demo
          </a>
        </div>

        {/* Morning briefing mock */}
        <MorningBriefing />
      </div>
    </section>
  );
}

function MorningBriefing() {
  return (
    <div className="mx-auto mt-16 max-w-md animate-fade-in-up">
      <div className="card p-6 text-left shadow-lg shadow-black/[0.03]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0071e3]/10">
            <Sparkles size={18} className="text-[#0071e3]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1d1d1f]">
              Morning Briefing
            </p>
            <p className="text-xs text-[#86868b]">Today at 8:00 AM</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              icon: CheckCircle2,
              text: "3 blog posts published",
              color: "#34c759",
            },
            {
              icon: TrendingUp,
              text: "Revenue up 12% this week",
              color: "#0071e3",
            },
            {
              icon: Megaphone,
              text: "14 social posts scheduled",
              color: "#ff9500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-[#f5f5f7] px-3 py-2.5"
            >
              <item.icon size={16} style={{ color: item.color }} />
              <span className="text-sm text-[#1d1d1f]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      className="mx-auto max-w-5xl px-6 py-24 md:py-32"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl">
          Up and running in minutes
        </h2>
        <p className="mt-3 text-[#86868b] text-lg">
          Three steps. No technical skills required.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.num} className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f7]">
              <step.icon size={24} className="text-[#0071e3]" />
            </div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0071e3]">
              Step {step.num}
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#86868b]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Capabilities() {
  const [filter, setFilter] = useState<Department>("All");

  const filtered =
    filter === "All" ? TASKS : TASKS.filter((t) => t.dept === filter);

  return (
    <Section
      id="capabilities"
      className="bg-[#fbfbfd] py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl">
            One AI team. Every department.
          </h2>
          <p className="mt-3 text-lg text-[#86868b]">
            Explore what your agents can do.
          </p>
        </div>

        {/* Pill filter bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={cn("pill", filter === dept && "pill-active")}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Task grid */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => {
            const Icon = DEPT_ICONS[t.dept];
            return (
              <div
                key={`${t.dept}-${i}`}
                className="card card-hover flex items-start gap-3 p-4"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f7]">
                  <Icon size={16} className="text-[#86868b]" />
                </div>
                <div>
                  <span className="badge badge-gray mb-1">{t.dept}</span>
                  <p className="text-sm text-[#1d1d1f]">{t.task}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function LiveDemoFeed() {
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (visibleCount >= DEMO_EVENTS.length) return;
    const timer = setTimeout(
      () => setVisibleCount((c) => Math.min(c + 1, DEMO_EVENTS.length)),
      2500
    );
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <Section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl">
          Your agents, always working
        </h2>
        <p className="mt-3 text-lg text-[#86868b]">
          A live look at what an AI team does in a single day.
        </p>
      </div>

      <div className="mt-12 space-y-3">
        {DEMO_EVENTS.slice(0, visibleCount).map((event, i) => (
          <div
            key={i}
            className={cn(
              "card flex items-center gap-4 p-4",
              i === visibleCount - 1 && "animate-fade-in-up"
            )}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: event.color + "14" }}
            >
              <Bot size={18} style={{ color: event.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1d1d1f]">
                {event.agent}
              </p>
              <p className="truncate text-sm text-[#86868b]">{event.action}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-xs text-[#86868b]">
              <Clock size={12} />
              {event.time}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Pricing() {
  return (
    <Section id="pricing" className="bg-[#fbfbfd] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-lg text-[#86868b]">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "card flex flex-col p-8",
                plan.featured &&
                  "border-[#0071e3] shadow-lg shadow-[#0071e3]/10 relative"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-blue px-3 py-1 text-xs">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#1d1d1f]">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-[#86868b]">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#1d1d1f]">
                  {plan.price}
                </span>
                <span className="text-sm text-[#86868b]">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-[#1d1d1f]"
                  >
                    <Check size={16} className="shrink-0 text-[#34c759]" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/onboard"
                className={cn(
                  "btn mt-8 w-full py-3 text-sm no-underline",
                  plan.featured ? "btn-primary" : "btn-secondary"
                )}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback(
    (i: number) => setOpen((prev) => (prev === i ? null : i)),
    []
  );

  return (
    <Section id="faq" className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-12 space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-[15px] font-medium text-[#1d1d1f] pr-4">
                {faq.q}
              </span>
              {open === i ? (
                <ChevronUp size={18} className="shrink-0 text-[#86868b]" />
              ) : (
                <ChevronDown size={18} className="shrink-0 text-[#86868b]" />
              )}
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                open === i ? "max-h-60 pb-5" : "max-h-0"
              )}
            >
              <p className="px-6 text-sm leading-relaxed text-[#86868b]">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section className="bg-[#fbfbfd] py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1d1d1f] md:text-4xl">
          Ready to put your business
          <br />
          on autopilot?
        </h2>
        <p className="mt-4 text-lg text-[#86868b]">
          Join thousands of businesses that wake up to real progress every
          morning.
        </p>
        <a
          href="/onboard"
          className="btn btn-primary mt-8 px-10 py-3.5 text-base no-underline"
        >
          Start Free
          <ArrowRight size={18} />
        </a>
        <p className="mt-4 text-xs text-[#86868b]">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#e5e5e7] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0071e3]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#1d1d1f]">
            RunMyBiz
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#86868b]">
          <a
            href="#how-it-works"
            className="no-underline hover:text-[#1d1d1f] transition-colors"
          >
            How it Works
          </a>
          <a
            href="#capabilities"
            className="no-underline hover:text-[#1d1d1f] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            className="no-underline hover:text-[#1d1d1f] transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="no-underline hover:text-[#1d1d1f] transition-colors"
          >
            FAQ
          </a>
        </div>

        <p className="text-xs text-[#86868b]">
          &copy; {new Date().getFullYear()} RunMyBiz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ──────────────────────── page ─────────────────────────────── */

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Capabilities />
      <LiveDemoFeed />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
