"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";

/* ============================================================
   HOOKS
   ============================================================ */

/** Fade-up on scroll (one-shot) */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/** Animated count-up when element enters viewport */
function CountUp({ target, duration = 1200, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setCount(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ============================================================
   DATA
   ============================================================ */

const timelineItems = [
  { time: "11:00 PM", task: "Reviewed your goals and planned tonight's work", detail: "Analyzed 3 active goals, checked pending approvals, and reviewed yesterday's metrics. Prioritized: pricing page redesign, outreach campaign, and Safari checkout bug.", highlight: false },
  { time: "11:30 PM", task: "Wrote and deployed a new blog post for SEO", detail: 'Published "5 Ways to Reduce SaaS Churn" — 1,400 words, optimized for 3 target keywords, added internal links, deployed to /blog.', highlight: false },
  { time: "1:00 AM", task: "Sent 47 personalized outreach emails", detail: "Pulled leads from your Airtable list, wrote unique intros for each based on their LinkedIn activity. Open rate from last batch: 38%.", highlight: false },
  { time: "3:00 AM", task: "Fixed 2 bugs reported by customers", detail: "Safari checkout issue: payment form wasn't submitting due to a missing polyfill. Mobile nav: hamburger menu was hidden behind hero on small screens. Both patched, tested, deployed.", highlight: false },
  { time: "5:00 AM", task: "Analyzed results and prepared your briefing", detail: "Compiled metrics: +12 new signups, 3 bug reports closed, blog post indexed within 2 hours. Drafted morning briefing with recommendations.", highlight: false },
  { time: "7:00 AM", task: "Briefing delivered to your inbox", detail: "Sent to your email and Slack. Includes: 3 tasks completed, 1 pending approval (Google Ads campaign), revenue impact estimate, and tonight's planned priorities.", highlight: true },
];

const capDepartments: Record<string, string | null> = {
  "All": null, "Engineering": "⚡", "Marketing": "📈", "Ads": "🎯", "Video": "🎬",
  "Email": "✉️", "Sales": "💰", "Support": "💬", "Content": "✍️", "Operations": "⚙️",
  "Analytics": "📊", "Product": "🎨", "Legal": "📋", "Finance": "🏦", "HR": "👥", "AI Agents": "🤖",
};

const capabilities = [
  // Engineering (30)
  { task: "Ship new features from a text prompt", dept: "Engineering" },
  { task: "Fix bugs from error logs overnight", dept: "Engineering" },
  { task: "Run automated test suites before deploy", dept: "Engineering" },
  { task: "Deploy to Vercel, AWS, or Railway", dept: "Engineering" },
  { task: "Monitor uptime and auto-restart services", dept: "Engineering" },
  { task: "Run database migrations safely", dept: "Engineering" },
  { task: "Manage nightly automated backups", dept: "Engineering" },
  { task: "Review and merge pull requests", dept: "Engineering" },
  { task: "Refactor legacy code for performance", dept: "Engineering" },
  { task: "Build and document REST APIs", dept: "Engineering" },
  { task: "Set up CI/CD pipelines", dept: "Engineering" },
  { task: "Manage SSL certificates and renewals", dept: "Engineering" },
  { task: "Spin up and manage Docker containers", dept: "Engineering" },
  { task: "Auto-scale server infrastructure", dept: "Engineering" },
  { task: "Update dependencies and patch packages", dept: "Engineering" },
  { task: "Apply critical security patches", dept: "Engineering" },
  { task: "Configure API rate limiting", dept: "Engineering" },
  { task: "Set up webhook integrations", dept: "Engineering" },
  { task: "Manage cron jobs and scheduled tasks", dept: "Engineering" },
  { task: "Aggregate and analyze server logs", dept: "Engineering" },
  { task: "Optimize page load speed", dept: "Engineering" },
  { task: "Set up CDN and edge caching", dept: "Engineering" },
  { task: "Implement responsive mobile layouts", dept: "Engineering" },
  { task: "Set up staging and preview environments", dept: "Engineering" },
  { task: "Write inline code documentation", dept: "Engineering" },
  { task: "Build GraphQL endpoints", dept: "Engineering" },
  { task: "Configure error tracking (Sentry, etc.)", dept: "Engineering" },
  { task: "Set up feature flags and rollouts", dept: "Engineering" },
  { task: "Implement authentication and auth flows", dept: "Engineering" },
  { task: "Build admin dashboards and internal tools", dept: "Engineering" },
  // Marketing (28)
  { task: "A/B test landing pages automatically", dept: "Marketing" },
  { task: "Schedule social media posts across platforms", dept: "Marketing" },
  { task: "Build and manage content calendars", dept: "Marketing" },
  { task: "Track marketing KPIs in real time", dept: "Marketing" },
  { task: "Optimize your sales funnel end to end", dept: "Marketing" },
  { task: "Conduct deep keyword research", dept: "Marketing" },
  { task: "Run full SEO site audits", dept: "Marketing" },
  { task: "Create lead magnets and gated downloads", dept: "Marketing" },
  { task: "Monitor competitor positioning weekly", dept: "Marketing" },
  { task: "Manage influencer outreach and deals", dept: "Marketing" },
  { task: "Set up and manage affiliate programs", dept: "Marketing" },
  { task: "Configure retargeting campaigns", dept: "Marketing" },
  { task: "Track conversions and attribution", dept: "Marketing" },
  { task: "Design viral referral loops", dept: "Marketing" },
  { task: "Coordinate Product Hunt launches", dept: "Marketing" },
  { task: "Draft and distribute press releases", dept: "Marketing" },
  { task: "Manage UTM parameters and tracking", dept: "Marketing" },
  { task: "Run structured growth experiments", dept: "Marketing" },
  { task: "Write LinkedIn thought leadership posts", dept: "Marketing" },
  { task: "Create Twitter/X thread campaigns", dept: "Marketing" },
  { task: "Optimize YouTube SEO and metadata", dept: "Marketing" },
  { task: "Run Pinterest marketing campaigns", dept: "Marketing" },
  { task: "Build and engage Reddit communities", dept: "Marketing" },
  { task: "Pitch podcast guest appearances", dept: "Marketing" },
  { task: "Manage Google Business Profile", dept: "Marketing" },
  { task: "Set up local SEO for physical locations", dept: "Marketing" },
  { task: "Plan and launch seasonal campaigns", dept: "Marketing" },
  { task: "Monitor brand mentions across the web", dept: "Marketing" },
  // Ads (26)
  { task: "Run Google Search Ads with budget optimization", dept: "Ads" },
  { task: "Create and manage Meta ad campaigns", dept: "Ads" },
  { task: "Launch TikTok ad campaigns", dept: "Ads" },
  { task: "Write dozens of ad copy variations", dept: "Ads" },
  { task: "Design carousel ad creatives", dept: "Ads" },
  { task: "Build Instagram Story and Reel ads", dept: "Ads" },
  { task: "Create display banner ads in all sizes", dept: "Ads" },
  { task: "Set up Google Shopping product feeds", dept: "Ads" },
  { task: "Configure dynamic product ads", dept: "Ads" },
  { task: "Build lookalike and custom audiences", dept: "Ads" },
  { task: "A/B test ad creatives automatically", dept: "Ads" },
  { task: "Optimize bidding strategies daily", dept: "Ads" },
  { task: "Manage audience segmentation", dept: "Ads" },
  { task: "Maintain negative keyword lists", dept: "Ads" },
  { task: "Schedule ads by time and region", dept: "Ads" },
  { task: "Set up geo-targeted campaigns", dept: "Ads" },
  { task: "Build remarketing lists and flows", dept: "Ads" },
  { task: "Configure ad extensions and sitelinks", dept: "Ads" },
  { task: "Run Performance Max campaigns", dept: "Ads" },
  { task: "Monitor creative fatigue and rotate assets", dept: "Ads" },
  { task: "Run YouTube pre-roll and discovery ads", dept: "Ads" },
  { task: "Launch LinkedIn sponsored content ads", dept: "Ads" },
  { task: "Set up Reddit and Quora ads", dept: "Ads" },
  { task: "Track ROAS and CPA across all channels", dept: "Ads" },
  { task: "Generate ad performance reports weekly", dept: "Ads" },
  { task: "Pause underperforming ads automatically", dept: "Ads" },
  // Video & Creative (24)
  { task: "Create promotional product videos", dept: "Video" },
  { task: "Produce short-form ad videos for Meta", dept: "Video" },
  { task: "Generate TikTok-style vertical video ads", dept: "Video" },
  { task: "Build animated explainer videos", dept: "Video" },
  { task: "Create product demo walkthroughs", dept: "Video" },
  { task: "Produce Instagram Reels content", dept: "Video" },
  { task: "Edit raw footage into polished videos", dept: "Video" },
  { task: "Auto-generate captions and subtitles", dept: "Video" },
  { task: "Repurpose long videos into short clips", dept: "Video" },
  { task: "Create YouTube Shorts from content", dept: "Video" },
  { task: "Design animated logo intros", dept: "Video" },
  { task: "Produce motion graphic social posts", dept: "Video" },
  { task: "Generate AI spokesperson videos", dept: "Video" },
  { task: "Create before/after comparison videos", dept: "Video" },
  { task: "Produce customer testimonial compilations", dept: "Video" },
  { task: "Build product unboxing content", dept: "Video" },
  { task: "Create tutorial and how-to videos", dept: "Video" },
  { task: "Generate podcast video clips for socials", dept: "Video" },
  { task: "Produce webinar recordings and highlights", dept: "Video" },
  { task: "Create slideshow videos from images", dept: "Video" },
  { task: "Design video thumbnails that convert", dept: "Video" },
  { task: "Add background music and sound design", dept: "Video" },
  { task: "Create UGC-style ad content", dept: "Video" },
  { task: "Produce app store preview videos", dept: "Video" },
  // Email (18)
  { task: "Send personalized cold outreach at scale", dept: "Email" },
  { task: "Build automated follow-up sequences", dept: "Email" },
  { task: "Design drip nurture campaigns", dept: "Email" },
  { task: "Manage and triage your inbox daily", dept: "Email" },
  { task: "Write and send weekly newsletters", dept: "Email" },
  { task: "Warm up new email domains", dept: "Email" },
  { task: "Segment and clean email lists", dept: "Email" },
  { task: "Optimize email deliverability scores", dept: "Email" },
  { task: "A/B test subject lines and CTAs", dept: "Email" },
  { task: "Design branded email templates", dept: "Email" },
  { task: "Configure transactional email flows", dept: "Email" },
  { task: "Build welcome and onboarding sequences", dept: "Email" },
  { task: "Run win-back re-engagement campaigns", dept: "Email" },
  { task: "Set up cart abandonment recovery flows", dept: "Email" },
  { task: "Handle unsubscribes and compliance", dept: "Email" },
  { task: "Trigger behavioral emails from events", dept: "Email" },
  { task: "Personalize emails with dynamic content", dept: "Email" },
  { task: "Monitor open rates and optimize send times", dept: "Email" },
  // Sales (22)
  { task: "Qualify inbound leads automatically", dept: "Sales" },
  { task: "Generate and send proposals", dept: "Sales" },
  { task: "Set up Stripe billing and checkout", dept: "Sales" },
  { task: "Track MRR, ARR, and growth rate", dept: "Sales" },
  { task: "Predict and prevent customer churn", dept: "Sales" },
  { task: "Upsell and cross-sell via targeted emails", dept: "Sales" },
  { task: "Process refunds and credits automatically", dept: "Sales" },
  { task: "Optimize pricing pages for conversion", dept: "Sales" },
  { task: "Generate quotes and estimates on demand", dept: "Sales" },
  { task: "Draft and negotiate contracts", dept: "Sales" },
  { task: "Forecast revenue with scenario modeling", dept: "Sales" },
  { task: "Send automated payment reminders", dept: "Sales" },
  { task: "Handle dunning for failed payments", dept: "Sales" },
  { task: "Manage subscriptions and plan changes", dept: "Sales" },
  { task: "Optimize free trial to paid conversion", dept: "Sales" },
  { task: "Build pricing pages and paywalls", dept: "Sales" },
  { task: "Score and prioritize deals in pipeline", dept: "Sales" },
  { task: "Update CRM records after every interaction", dept: "Sales" },
  { task: "Prepare sales call briefs and talking points", dept: "Sales" },
  { task: "Generate objection handling scripts", dept: "Sales" },
  { task: "Build ROI calculators for prospects", dept: "Sales" },
  { task: "Create customer case studies from data", dept: "Sales" },
  // Support (20)
  { task: "Draft responses to support tickets", dept: "Support" },
  { task: "Escalate complex issues with full context", dept: "Support" },
  { task: "Build and maintain a knowledge base", dept: "Support" },
  { task: "Run live chat support on your site", dept: "Support" },
  { task: "Collect and analyze customer feedback", dept: "Support" },
  { task: "Send and track NPS surveys", dept: "Support" },
  { task: "Onboard new customers automatically", dept: "Support" },
  { task: "Monitor and improve CSAT scores", dept: "Support" },
  { task: "Triage and route incoming bug reports", dept: "Support" },
  { task: "Track feature requests by popularity", dept: "Support" },
  { task: "Monitor SLA compliance across tickets", dept: "Support" },
  { task: "Manage a library of canned responses", dept: "Support" },
  { task: "Provide multilingual customer support", dept: "Support" },
  { task: "Run sentiment analysis on conversations", dept: "Support" },
  { task: "Flag churn-risk customers in real time", dept: "Support" },
  { task: "Route VIP customers to priority queues", dept: "Support" },
  { task: "Write and update help center articles", dept: "Support" },
  { task: "Create guided troubleshooting flows", dept: "Support" },
  { task: "Moderate community forum discussions", dept: "Support" },
  { task: "Monitor and respond to app store reviews", dept: "Support" },
  // Content (24)
  { task: "Write SEO-optimized blog posts", dept: "Content" },
  { task: "Create high-converting landing page copy", dept: "Content" },
  { task: "Write in-depth whitepapers and reports", dept: "Content" },
  { task: "Produce detailed customer case studies", dept: "Content" },
  { task: "Write and design downloadable ebooks", dept: "Content" },
  { task: "Create infographics from your data", dept: "Content" },
  { task: "Write podcast episode scripts", dept: "Content" },
  { task: "Script webinars and presentations", dept: "Content" },
  { task: "Write social media captions at scale", dept: "Content" },
  { task: "Craft product descriptions that sell", dept: "Content" },
  { task: "Build comprehensive FAQ pages", dept: "Content" },
  { task: "Write comparison and alternatives pages", dept: "Content" },
  { task: "Create industry glossaries for SEO", dept: "Content" },
  { task: "Produce step-by-step how-to guides", dept: "Content" },
  { task: "Design downloadable checklists and tools", dept: "Content" },
  { task: "Write email marketing scripts", dept: "Content" },
  { task: "Create video scripts for any platform", dept: "Content" },
  { task: "Draft press kits and media pages", dept: "Content" },
  { task: "Write changelog and release notes", dept: "Content" },
  { task: "Publish company blog updates", dept: "Content" },
  { task: "Write internal memos and announcements", dept: "Content" },
  { task: "Create onboarding documentation", dept: "Content" },
  { task: "Localize content into multiple languages", dept: "Content" },
  { task: "Repurpose existing content across formats", dept: "Content" },
  // Operations (22)
  { task: "Send daily CEO briefing emails", dept: "Operations" },
  { task: "Track and categorize expenses", dept: "Operations" },
  { task: "Generate and send invoices", dept: "Operations" },
  { task: "Manage your calendar and scheduling", dept: "Operations" },
  { task: "Hire and manage Upwork / Fiverr freelancers", dept: "Operations" },
  { task: "Organize and file documents", dept: "Operations" },
  { task: "Negotiate pricing with vendors", dept: "Operations" },
  { task: "Summarize meeting notes and action items", dept: "Operations" },
  { task: "Set and track quarterly OKRs", dept: "Operations" },
  { task: "Write standard operating procedures", dept: "Operations" },
  { task: "Automate repetitive manual processes", dept: "Operations" },
  { task: "Monitor inventory levels and reorder", dept: "Operations" },
  { task: "Build Zapier and Make automations", dept: "Operations" },
  { task: "Maintain and organize Notion workspace", dept: "Operations" },
  { task: "Manage CRM pipeline and deal stages", dept: "Operations" },
  { task: "Coordinate async team standups", dept: "Operations" },
  { task: "Book travel and accommodations", dept: "Operations" },
  { task: "Manage software subscriptions and renewals", dept: "Operations" },
  { task: "Track passwords and access management", dept: "Operations" },
  { task: "Create business continuity plans", dept: "Operations" },
  { task: "Manage project timelines and deadlines", dept: "Operations" },
  { task: "Coordinate cross-department workflows", dept: "Operations" },
  // Analytics (18)
  { task: "Build custom real-time dashboards", dept: "Analytics" },
  { task: "Monitor competitive intelligence weekly", dept: "Analytics" },
  { task: "Generate weekly performance reports", dept: "Analytics" },
  { task: "Run cohort and retention analysis", dept: "Analytics" },
  { task: "Track user behavior and engagement", dept: "Analytics" },
  { task: "Visualize funnel drop-off points", dept: "Analytics" },
  { task: "Model multi-touch attribution", dept: "Analytics" },
  { task: "Run predictive analytics on your data", dept: "Analytics" },
  { task: "Set up real-time metric alerts", dept: "Analytics" },
  { task: "Calculate CAC, LTV, and payback period", dept: "Analytics" },
  { task: "Conduct market and industry research", dept: "Analytics" },
  { task: "Identify emerging market trends", dept: "Analytics" },
  { task: "Benchmark performance against competitors", dept: "Analytics" },
  { task: "Analyze A/B test results with confidence", dept: "Analytics" },
  { task: "Analyze heatmaps and session recordings", dept: "Analytics" },
  { task: "Segment revenue by channel and product", dept: "Analytics" },
  { task: "Track unit economics over time", dept: "Analytics" },
  { task: "Create investor-ready metrics dashboards", dept: "Analytics" },
  // Product & Design (18)
  { task: "Generate UI mockups and wireframes", dept: "Product" },
  { task: "Create logos and brand identity systems", dept: "Product" },
  { task: "Design complete brand asset packages", dept: "Product" },
  { task: "Build investor pitch decks", dept: "Product" },
  { task: "Run user research surveys", dept: "Product" },
  { task: "Prioritize feature backlog from user data", dept: "Product" },
  { task: "Create interactive prototypes", dept: "Product" },
  { task: "Build design system components", dept: "Product" },
  { task: "Design social media template packs", dept: "Product" },
  { task: "Create presentation slide decks", dept: "Product" },
  { task: "Design banner ad creative sets", dept: "Product" },
  { task: "Write and format product documentation", dept: "Product" },
  { task: "Run usability testing sessions", dept: "Product" },
  { task: "Conduct accessibility compliance audits", dept: "Product" },
  { task: "Map user personas and journeys", dept: "Product" },
  { task: "Generate color palettes and style guides", dept: "Product" },
  { task: "Create icon sets and illustrations", dept: "Product" },
  { task: "Design email and notification templates", dept: "Product" },
  // Legal (12)
  { task: "Generate Terms of Service pages", dept: "Legal" },
  { task: "Draft Privacy Policy documents", dept: "Legal" },
  { task: "Monitor GDPR compliance requirements", dept: "Legal" },
  { task: "Research trademarks and domain names", dept: "Legal" },
  { task: "Implement cookie consent banners", dept: "Legal" },
  { task: "Draft data processing agreements", dept: "Legal" },
  { task: "Generate NDA templates", dept: "Legal" },
  { task: "Track regulatory changes in your industry", dept: "Legal" },
  { task: "Audit ADA / accessibility compliance", dept: "Legal" },
  { task: "Monitor CCPA and state privacy laws", dept: "Legal" },
  { task: "Review contracts for red flags", dept: "Legal" },
  { task: "Maintain a compliance documentation vault", dept: "Legal" },
  // Finance (16)
  { task: "Respond to investor inquiries promptly", dept: "Finance" },
  { task: "Build financial models and forecasts", dept: "Finance" },
  { task: "Prepare board meeting materials", dept: "Finance" },
  { task: "Manage fundraising outreach campaigns", dept: "Finance" },
  { task: "Set up data rooms for due diligence", dept: "Finance" },
  { task: "Run bank reconciliation monthly", dept: "Finance" },
  { task: "Generate profit and loss statements", dept: "Finance" },
  { task: "Forecast cash flow 6–12 months out", dept: "Finance" },
  { task: "Prepare tax documents and filings", dept: "Finance" },
  { task: "Track cap table and equity changes", dept: "Finance" },
  { task: "Manage budget planning and tracking", dept: "Finance" },
  { task: "Process accounts receivable and payable", dept: "Finance" },
  { task: "Run break-even and unit economics analysis", dept: "Finance" },
  { task: "Generate expense reports automatically", dept: "Finance" },
  { task: "Create financial projections for fundraising", dept: "Finance" },
  { task: "Monitor burn rate and runway", dept: "Finance" },
  // HR (14)
  { task: "Write and post job listings", dept: "HR" },
  { task: "Screen applicants and rank resumes", dept: "HR" },
  { task: "Onboard new hires with docs and access", dept: "HR" },
  { task: "Integrate with payroll platforms", dept: "HR" },
  { task: "Run performance review cycles", dept: "HR" },
  { task: "Coordinate team standups and retros", dept: "HR" },
  { task: "Write and maintain culture documentation", dept: "HR" },
  { task: "Manage employee benefits enrollment", dept: "HR" },
  { task: "Create and update employee handbook", dept: "HR" },
  { task: "Schedule and coordinate interviews", dept: "HR" },
  { task: "Generate offer letters and agreements", dept: "HR" },
  { task: "Build training materials and courses", dept: "HR" },
  { task: "Maintain org chart and team directory", dept: "HR" },
  { task: "Track PTO and time-off requests", dept: "HR" },
  // AI Agents (20)
  { task: "Deploy an AI phone receptionist", dept: "AI Agents" },
  { task: "Build custom chatbots for your website", dept: "AI Agents" },
  { task: "Create AI voice agents for outbound calls", dept: "AI Agents" },
  { task: "Automate data entry from documents", dept: "AI Agents" },
  { task: "Extract text from images and PDFs via OCR", dept: "AI Agents" },
  { task: "Generate marketing images with AI", dept: "AI Agents" },
  { task: "Run AI-powered personalization engines", dept: "AI Agents" },
  { task: "Build product recommendation systems", dept: "AI Agents" },
  { task: "Deploy dynamic pricing algorithms", dept: "AI Agents" },
  { task: "Score leads predictively with ML", dept: "AI Agents" },
  { task: "Set up automated social listening", dept: "AI Agents" },
  { task: "Monitor online reputation and reviews", dept: "AI Agents" },
  { task: "Auto-translate content into 50+ languages", dept: "AI Agents" },
  { task: "Classify and route incoming requests", dept: "AI Agents" },
  { task: "Summarize long documents instantly", dept: "AI Agents" },
  { task: "Extract structured data from emails", dept: "AI Agents" },
  { task: "Generate AI avatars for brand content", dept: "AI Agents" },
  { task: "Build custom AI workflows for your niche", dept: "AI Agents" },
  { task: "Train AI on your company knowledge base", dept: "AI Agents" },
  { task: "Deploy autonomous agents that run 24/7", dept: "AI Agents" },
];

function interleaveCapabilities(items: typeof capabilities) {
  const byDept: Record<string, typeof capabilities> = {};
  items.forEach((item) => {
    if (!byDept[item.dept]) byDept[item.dept] = [];
    byDept[item.dept].push(item);
  });
  const deptKeys = Object.keys(byDept);
  const result: typeof capabilities = [];
  const maxLen = Math.max(...deptKeys.map((k) => byDept[k].length));
  for (let i = 0; i < maxLen; i++) {
    for (const dept of deptKeys) {
      if (byDept[dept][i]) result.push(byDept[dept][i]);
    }
  }
  return result;
}

const interleavedAll = interleaveCapabilities(capabilities);

const capDeptColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Engineering": { bg: "#EFF6FF", text: "#2563EB", dot: "#2563EB" },
  "Marketing": { bg: "#F0FDF4", text: "#16A34A", dot: "#16A34A" },
  "Ads": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  "Video": { bg: "#F5F3FF", text: "#7C3AED", dot: "#7C3AED" },
  "Email": { bg: "#FFF7ED", text: "#EA580C", dot: "#EA580C" },
  "Sales": { bg: "#FFFBEB", text: "#B45309", dot: "#B45309" },
  "Support": { bg: "#F5F3FF", text: "#6D28D9", dot: "#6D28D9" },
  "Content": { bg: "#FFF1F2", text: "#E11D48", dot: "#E11D48" },
  "Operations": { bg: "#FEF2F2", text: "#DC2626", dot: "#DC2626" },
  "Analytics": { bg: "#ECFEFF", text: "#0891B2", dot: "#0891B2" },
  "Product": { bg: "#FDF2F8", text: "#DB2777", dot: "#DB2777" },
  "Legal": { bg: "#F1F5F9", text: "#475569", dot: "#475569" },
  "Finance": { bg: "#F0FDF4", text: "#059669", dot: "#059669" },
  "HR": { bg: "#EFF6FF", text: "#4F46E5", dot: "#4F46E5" },
  "AI Agents": { bg: "#FAF5FF", text: "#9333EA", dot: "#9333EA" },
};

const capDeptCounts: Record<string, number> = {};
capabilities.forEach((c) => { capDeptCounts[c.dept] = (capDeptCounts[c.dept] || 0) + 1; });

function TaskRow({ task, dept }: { task: string; dept: string }) {
  const colors = capDeptColors[dept] || { bg: "#f1f5f9", text: "#475569", dot: "#475569" };
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-[11px] border-b border-[#f1f5f9] bg-white hover:bg-[#f8fafc] transition-colors cursor-default">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colors.dot }} />
        <span className="text-sm font-[450] truncate" style={{ color: "#1e293b" }}>{task}</span>
      </div>
      <span className="text-[10.5px] font-semibold tracking-wider px-2.5 py-[3px] rounded-full whitespace-nowrap shrink-0 uppercase" style={{ background: colors.bg, color: colors.text }}>{dept}</span>
    </div>
  );
}

const faqs = [
  { q: "What can RunMyBiz actually do?", a: "It can write and deploy code, send personalized emails, create and run ad campaigns, write blog posts and landing pages, fix bugs, respond to customer support tickets, and more. Think of it as a full team that works overnight — developer, marketer, and support rep." },
  { q: "Is it safe? What if something goes wrong?", a: "Every action is assigned a risk tier. Low-risk tasks (research, drafting content) happen automatically. High-risk actions (spending money, sending emails to customers, deploying to production) always require your explicit approval before executing. There's also a circuit breaker that pauses automatically after repeated failures." },
  { q: "How much work does my AI do each night?", a: "Your AI works every single night — no nights off. The difference between plans is how much it does per night. On Starter, it tackles up to 3 tasks per cycle (like writing a blog post and sending some outreach emails). On Growth, it handles up to 10 tasks with longer, deeper cycles. On Scale, there's no task limit — it works as long as there's work to do." },
  { q: "Can it really write production code?", a: "Yes. It uses the same AI models that professional developers use daily. It writes code, runs tests, and handles deployment. For critical changes, it requests your approval before pushing to production. You maintain full access to the codebase and can review every commit." },
  { q: "Do I need technical skills?", a: "No. You describe your business and goals in plain English during onboarding. The AI handles everything technical. If you are technical, you get full visibility into code, logs, and decision-making — but it's entirely optional." },
  { q: "What happens to my data?", a: "Each company gets an isolated environment — its own database, repository, and credentials. Your data is encrypted at rest and in transit. The AI only accesses what it needs for the current task, and you can revoke any integration at any time." },
  { q: "Why not just run your own AI bot instead of paying for RunMyBiz?", a: "For the average person, spinning up a bot is not even close to accessible, let alone setting it up with the optimal tools, skills, MCP and API connections for 300+ specific tasks. Then you need to stay on top of all the new deployments in AI and constantly ensure your system is cycling each tool towards the most effective model. It's a full time job just to keep it running. RunMyBiz is also powered by a network of connected Mac Minis, providing services at a fraction of the cost compared to traditional cloud infrastructure. If you're a tech wiz, you can maybe make something that works. But you could also just pay $30/mo and have everything run on autopilot." },
];


/* #4 — Cost comparison data */
const comparisonDepts = [
  { name: "Engineering", tasks: 30, role: "Software Developer", salary: 110000 },
  { name: "Marketing", tasks: 28, role: "Marketing Manager", salary: 122000 },
  { name: "Ads", tasks: 26, role: "Media Buyer", salary: 75000 },
  { name: "Video & Creative", tasks: 24, role: "Video Producer", salary: 70000 },
  { name: "Email", tasks: 18, role: "Email Specialist", salary: 65000 },
  { name: "Sales", tasks: 22, role: "Sales Rep", salary: 70000 },
  { name: "Customer Support", tasks: 20, role: "Support Rep", salary: 45000 },
  { name: "Content Creation", tasks: 24, role: "Content Writer", salary: 60000 },
  { name: "Operations", tasks: 22, role: "Ops Manager", salary: 85000 },
  { name: "Analytics", tasks: 18, role: "Data Analyst", salary: 80000 },
  { name: "Product & Design", tasks: 18, role: "Product Designer", salary: 110000 },
  { name: "Legal & Compliance", tasks: 12, role: "In-House Counsel", salary: 150000 },
  { name: "Finance", tasks: 16, role: "Finance Lead", salary: 110000 },
  { name: "HR & People", tasks: 14, role: "HR Manager", salary: 90000 },
  { name: "AI Agents", tasks: 20, role: "AI Engineer", salary: 150000 },
];
const comparisonTotalTasks = comparisonDepts.reduce((s, d) => s + d.tasks, 0);
const comparisonTotalAnnual = comparisonDepts.reduce((s, d) => s + d.salary, 0);
const comparisonTotalMonthly = Math.round(comparisonTotalAnnual / 12);
const comparisonSources = [
  { role: "Software Developer", amount: "$110,140/yr", source: "Bureau of Labor Statistics, 2024" },
  { role: "Marketing Manager", amount: "$121,658/yr", source: "Salary.com, March 2026" },
  { role: "Media Buyer", amount: "$75,000/yr", source: "Glassdoor median, 2025" },
  { role: "Video Producer", amount: "$70,000/yr", source: "Glassdoor median, 2025" },
  { role: "Email Specialist", amount: "$65,000/yr", source: "Glassdoor median, 2025" },
  { role: "Sales Rep", amount: "$70,000/yr", source: "BLS median, 2024" },
  { role: "Support Rep", amount: "$45,000/yr", source: "BLS median, 2024" },
  { role: "Content Writer", amount: "$60,000/yr", source: "Glassdoor median, 2025" },
  { role: "Ops Manager", amount: "$85,000/yr", source: "BLS median, 2024" },
  { role: "Data Analyst", amount: "$80,000/yr", source: "BLS median, 2024" },
  { role: "Product Designer", amount: "$110,000/yr", source: "Glassdoor median, 2025" },
  { role: "In-House Counsel", amount: "$150,000/yr", source: "Glassdoor median, 2025" },
  { role: "Finance Lead", amount: "$110,000/yr", source: "BLS / Glassdoor, 2024-25" },
  { role: "HR Manager", amount: "$90,000/yr", source: "BLS median, 2024" },
  { role: "AI Engineer", amount: "$150,000/yr", source: "Glassdoor / Motion Recruitment, 2025" },
];



/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function LandingPage() {
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSources, setShowSources] = useState(false);

  const [activeDept, setActiveDept] = useState("All");
  const capListRef = useRef<HTMLDivElement>(null);

  const filteredCaps = activeDept === "All" ? interleavedAll : capabilities.filter((c) => c.dept === activeDept);

  useEffect(() => {
    if (capListRef.current) capListRef.current.scrollTop = 0;
  }, [activeDept]);

  /* #6 — Sticky nav scroll detection */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);



  return (
    <div style={{ background: "#fff" }}>

      {/* ===== #6 — STICKY NAV ===== */}
      <nav style={{
        background: scrolled ? "rgba(251,251,253,0.95)" : "rgba(251,251,253,0.8)",
        backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
        transition: "background 0.3s, box-shadow 0.3s",
      }}>
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold" style={{ color: "#1d1d1f" }}>RunMyBiz</Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xs" style={{ color: "#1d1d1f", opacity: 0.8 }}>Sign In</Link>
            <Link href="/onboard" className="text-xs font-medium px-4 py-1.5 rounded-full transition-shadow duration-300" style={{
              background: "#0071e3", color: "#fff",
              boxShadow: scrolled ? "0 0 0 3px rgba(0,113,227,0.25)" : "none",
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO — #1 animated briefing + #9 counter ===== */}
      <section className="text-center pt-20 pb-6" style={{ background: "#fbfbfd" }}>
        <h1 className="font-semibold" style={{ fontSize: "clamp(40px, 5.5vw, 56px)", letterSpacing: "-0.015em", lineHeight: 1.07, color: "#1d1d1f" }}>
          Your business, on autopilot.
        </h1>
        <p className="mt-4" style={{ fontSize: "clamp(17px, 2vw, 21px)", color: "#86868b", lineHeight: 1.38 }}>
          Set it up once. AI handles the rest — every single night.
        </p>
        <div className="flex items-center justify-center mt-5">
          <Link href="/onboard" className="text-sm font-medium px-6 py-2.5 rounded-full" style={{ background: "#0071e3", color: "#fff" }}>
            Get started
          </Link>
        </div>

        <AnimatedBriefing />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-24" style={{ background: "#fff" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <Reveal>
            <h2 className="text-center font-semibold mb-4" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.015em", color: "#1d1d1f", lineHeight: 1.08 }}>How it works.</h2>
            <p className="text-center mb-20" style={{ fontSize: 19, color: "#86868b" }}>Three steps. That&apos;s all it takes.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: "1", title: "Answer a few questions", desc: "Two minutes of context gives your AI agent everything it needs to start making real progress on your business." },
              { num: "2", title: "Get a personalized plan", desc: "Your AI builds a strategy around your goals — not a template. Every action is specific to where you are right now." },
              { num: "3", title: "Wake up to results", desc: "While you sleep, your agent executes — sending emails, building pages, running campaigns. Morning brings a progress report." },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "#f5f5f7" }}>
                    <span className="text-2xl font-bold" style={{ color: "#1d1d1f" }}>{step.num}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#1d1d1f" }}>{step.title}</h3>
                  <p style={{ color: "#86868b", fontSize: 15, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE NIGHTLY TIMELINE ===== */}
      <section className="py-24" style={{ background: "#fff" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-semibold mb-3" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.015em", color: "#1d1d1f", lineHeight: 1.08 }}>
                It works while you sleep.
              </h2>
              <p style={{ fontSize: 21, color: "#86868b", lineHeight: 1.38 }}>
                Every night, your AI agent runs a full work cycle.
                <span className="block text-[14px] mt-2" style={{ color: "#aeaeb2" }}>Tap any step to see details.</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="max-w-[560px] mx-auto">
              <div className="relative pl-10">
                <div className="absolute left-[11px] top-2 bottom-2 w-px" style={{ background: "#d2d2d7" }} />
                {timelineItems.map((item, i) => {
                  const isExp = expandedTimeline === i;
                  return (
                    <div key={i} className="flex items-start gap-4 mb-6 last:mb-0 relative cursor-pointer group" onClick={() => setExpandedTimeline(isExp ? null : i)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedTimeline(isExp ? null : i); } }}>
                      <div className="absolute left-[-33px] w-[7px] h-[7px] rounded-full mt-[7px] transition-transform duration-200 group-hover:scale-150" style={{ background: item.highlight ? "#0071e3" : "#86868b" }} />
                      <span className="text-[13px] shrink-0 w-[72px] tabular-nums" style={{ color: "#86868b" }}>{item.time}</span>
                      <div className="flex-1">
                        <p className="text-[15px] transition-colors duration-200" style={{ color: item.highlight ? "#0071e3" : isExp ? "#1d1d1f" : "#6e6e73" }}>{item.task}</p>
                        <div style={{ display: "grid", gridTemplateRows: isExp ? "1fr" : "0fr", transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
                          <div style={{ overflow: "hidden" }}>
                            <p className="text-[13px] pt-2 pb-1" style={{ color: "#86868b", lineHeight: 1.5 }}>{item.detail}</p>
                          </div>
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-1 transition-transform duration-200" style={{ transform: isExp ? "rotate(180deg)" : "rotate(0deg)" }}>
                        <path d="M4 6l4 4 4-4" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="py-24" style={{ background: "#f8fafc" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-[640px] mx-auto mb-10">
              <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(32px, 5vw, 48px)", color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                What it can do.
              </h2>
              <p className="text-lg" style={{ color: "#64748b", lineHeight: 1.5 }}>
                One AI agent.{" "}
                <span className="font-bold" style={{ color: "#0f172a" }}><CountUp target={capabilities.length} /></span>{" "}
                autonomous tasks across{" "}
                <span className="font-bold" style={{ color: "#0f172a" }}>{Object.keys(capDeptColors).length} departments</span>
                . And counting.
              </p>
            </div>
          </Reveal>

          {/* Department filter pills */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-[860px] mx-auto mb-8">
              {Object.entries(capDepartments).map(([dept, emoji]) => {
                const isActive = activeDept === dept;
                const count = dept === "All" ? capabilities.length : capDeptCounts[dept] || 0;
                return (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className="inline-flex items-center gap-[5px] px-3.5 py-[7px] rounded-full text-[13px] font-medium cursor-pointer transition-all"
                    style={{
                      border: isActive ? "1.5px solid #2563EB" : "1.5px solid #e2e8f0",
                      background: isActive ? "#2563EB" : "white",
                      color: isActive ? "white" : "#475569",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {emoji && <span className="text-xs">{emoji}</span>}
                    {dept}
                    <span className="text-[11px] font-semibold" style={{ opacity: isActive ? 0.8 : 0.45 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Task list card */}
          <Reveal delay={0.15}>
            <div className="max-w-[680px] mx-auto bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden relative" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)" }}>
              {/* Card header */}
              <div className="px-5 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.4)", animation: "capPulse 2s ease-in-out infinite" }} />
                  <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>{activeDept === "All" ? "All Capabilities" : activeDept}</span>
                </div>
                <span className="text-[13px] font-medium" style={{ color: "#94a3b8" }}>{filteredCaps.length} tasks</span>
              </div>

              {/* Scrollable list */}
              <div ref={capListRef} className="max-h-[540px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
                {filteredCaps.map((cap, i) => (
                  <TaskRow key={`${activeDept}-${i}`} task={cap.task} dept={cap.dept} />
                ))}
              </div>

              {/* Bottom fade */}
              <div className="absolute left-0 right-0 h-12 pointer-events-none z-[2]" style={{ bottom: "46px", background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))" }} />

              {/* Card footer */}
              <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#fafbfc] flex items-center justify-between relative z-[3]">
                <span className="text-[13px] italic" style={{ color: "#94a3b8" }}>New capabilities added every week</span>
                <span className="text-[13px] font-semibold" style={{ color: "#2563EB" }}>Keep scrolling ↓</span>
              </div>
            </div>
          </Reveal>

          <style>{`@keyframes capPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
        </div>
      </section>

      {/* ===== YOU'RE IN CONTROL (approval card) ===== */}
      <section className="py-24" style={{ background: "#f5f5f7" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-semibold mb-3" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.015em", color: "#1d1d1f", lineHeight: 1.08 }}>You&apos;re always in control.</h2>
              <p style={{ fontSize: 21, color: "#86868b", lineHeight: 1.38 }}>Nothing risky happens without your approval.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="max-w-[520px] mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #e8e8ed", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div className="px-7 pt-6 pb-4" style={{ borderBottom: "1px solid #f0f0f5" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
                    <span className="text-[13px] font-semibold" style={{ color: "#1d1d1f" }}>Approval Required</span>
                  </div>
                  <span className="text-[12px]" style={{ color: "#86868b" }}>Your AI wants to take a high-risk action</span>
                </div>
                <div className="px-7 py-5">
                  <h4 className="text-[16px] font-semibold mb-3" style={{ color: "#1d1d1f" }}>Launch Google Ads campaign</h4>
                  <div className="space-y-2 mb-5">
                    {[["Budget", "$50/day for 14 days"], ["Targeting", "SaaS founders, age 25-45"], ["Expected", "~$3.20 cost per acquisition"]].map(([label, val]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-[12px] font-medium w-[72px]" style={{ color: "#86868b" }}>{label}</span>
                        <span className="text-[13px]" style={{ color: "#1d1d1f" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl px-5 py-4 mb-5" style={{ background: "#f5f5f7", border: "1px solid #e8e8ed" }}>
                    <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: "#86868b" }}>AI reasoning</p>
                    <p className="text-[13px]" style={{ color: "#6e6e73", lineHeight: 1.5 }}>&ldquo;Based on last week&apos;s organic traffic data, paid ads targeting SaaS founders should yield ~$3.20 CPA. Your current organic CPA is $8.50, so this campaign would reduce acquisition cost by 62%.&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-[13px] font-medium px-5 py-2 rounded-full cursor-default" style={{ background: "#34a853", color: "#fff" }}>Approve</div>
                    <div className="text-[13px] font-medium px-5 py-2 rounded-full cursor-default" style={{ border: "1px solid #d2d2d7", color: "#6e6e73" }}>Deny</div>
                    <div className="text-[13px] font-medium px-5 py-2 rounded-full cursor-default" style={{ border: "1px solid #d2d2d7", color: "#6e6e73" }}>Ask a question</div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-6 text-[14px]" style={{ color: "#86868b", lineHeight: 1.5 }}>
                Spending money, emailing customers, deploying to production — your AI asks first.<br />Low-risk tasks run automatically so you only see what matters.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== #4 — COST COMPARISON ===== */}
      <section className="py-24" style={{ background: "#f5f5f4" }}>
        <div className="max-w-[880px] mx-auto px-5">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="font-bold mb-3" style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "#1a1a1a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                $<CountUp target={Math.round(comparisonTotalMonthly / 1000)} suffix="k" />/mo of talent, for $29.
              </h2>
              <p style={{ color: "#888", fontSize: 18 }}>{comparisonTotalTasks} tasks across 15 departments — starting at $29/mo.</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: Hire a team */}
              <div className="rounded-2xl bg-white p-7" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-5" style={{ color: "#aaa", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>Hire a Team</p>
                <div className="flex flex-col">
                  {comparisonDepts.map((d, i) => (
                    <div key={i} className="flex justify-between items-center py-[7px]" style={{ borderBottom: i < comparisonDepts.length - 1 ? "1px solid #f3f3f3" : "none" }}>
                      <span className="text-[13px] font-medium" style={{ color: "#333" }}>{d.role}</span>
                      <span className="text-[13px] tabular-nums" style={{ color: "#999", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>${Math.round(d.salary / 12).toLocaleString()}/mo</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-baseline mt-3.5 pt-3.5" style={{ borderTop: "2px solid #e8e8e8" }}>
                  <span className="text-sm font-bold" style={{ color: "#1a1a1a" }}>Total</span>
                  <span className="text-[26px] font-extrabold tabular-nums" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono, 'SF Mono', monospace)", letterSpacing: "-0.02em" }}>
                    ${comparisonTotalMonthly.toLocaleString()}<span className="text-sm font-normal" style={{ color: "#aaa" }}>/mo</span>
                  </span>
                </div>
                <p className="text-xs mt-2 italic" style={{ color: "#bbb" }}>Salary only. Add 25-30% for benefits, taxes, and overhead.</p>
              </div>

              {/* RIGHT: RunMyBiz */}
              <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: "#1a1a1a" }}>
                <div className="absolute -top-px right-6 rounded-b-lg px-3.5 py-[5px]" style={{ background: "#22c55e" }}>
                  <span className="text-[11px] font-bold text-white" style={{ fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>99.9% less</span>
                </div>
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-5" style={{ color: "#666", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>RunMyBiz</p>
                <div className="flex flex-col">
                  {comparisonDepts.map((d, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-[7px]" style={{ borderBottom: i < comparisonDepts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-[13px] font-medium flex-1" style={{ color: "#d4d4d4" }}>{d.name}</span>
                      <span className="text-[11px] font-semibold px-[7px] py-0.5 rounded" style={{ color: "#22c55e", background: "rgba(34,197,94,0.1)", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{d.tasks} tasks</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-baseline mt-3.5 pt-3.5" style={{ borderTop: "2px solid rgba(34,197,94,0.2)" }}>
                  <span className="text-sm font-bold" style={{ color: "#fafafa" }}>Starting at</span>
                  <span className="text-[26px] font-extrabold tabular-nums" style={{ color: "#22c55e", fontFamily: "var(--font-mono, 'SF Mono', monospace)", letterSpacing: "-0.02em" }}>
                    $29<span className="text-sm font-normal" style={{ color: "#555" }}>/mo</span>
                  </span>
                </div>
                <p className="text-xs mt-2 italic" style={{ color: "#555" }}>Works every night. Never calls in sick.</p>
              </div>
            </div>
          </Reveal>

          {/* Sources toggle */}
          <Reveal delay={0.3}>
            <div className="mt-12">
              <button onClick={() => setShowSources(!showSources)} className="flex items-center gap-1.5 p-2 bg-transparent border-none cursor-pointer" style={{ fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>
                <span className="text-xs font-medium" style={{ color: "#999" }}>{showSources ? "▾" : "▸"} Where do these numbers come from?</span>
              </button>
              {showSources && (
                <div className="bg-white rounded-xl p-6 mt-2" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <p className="text-xs mb-4" style={{ color: "#666", lineHeight: 1.6 }}>
                    All salaries are U.S. national averages based on Bureau of Labor Statistics (BLS),
                    Salary.com, and Glassdoor data from 2024-2026. These are base salary only —
                    actual employer cost is typically 25-30% higher when you include benefits,
                    payroll taxes, equipment, recruiting, and management overhead.
                  </p>
                  <div className="grid grid-cols-2">
                    <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase" style={{ background: "#f8f8f7", borderBottom: "1px solid #eee", color: "#999", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>Role / Salary</div>
                    <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase" style={{ background: "#f8f8f7", borderBottom: "1px solid #eee", color: "#999", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>Source</div>
                    {comparisonSources.map((s, i) => (
                      <div key={i} className="contents">
                        <div className="px-3 py-2 text-xs font-medium" style={{ borderBottom: "1px solid #f3f3f3", color: "#444" }}>
                          {s.role} <span className="text-[11px]" style={{ color: "#aaa", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>— {s.amount}</span>
                        </div>
                        <div className="px-3 py-2 text-[11px]" style={{ borderBottom: "1px solid #f3f3f3", color: "#999", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{s.source}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-lg flex justify-between items-center" style={{ background: "#f8f8f7" }}>
                    <div><span className="text-xs" style={{ color: "#666" }}>Total annual (15 roles): </span><span className="text-sm font-bold tabular-nums" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>${comparisonTotalAnnual.toLocaleString()}</span></div>
                    <div><span className="text-xs" style={{ color: "#666" }}>Monthly: </span><span className="text-sm font-bold tabular-nums" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>${comparisonTotalMonthly.toLocaleString()}</span></div>
                    <div><span className="text-xs" style={{ color: "#666" }}>Fully loaded (est.): </span><span className="text-sm font-bold tabular-nums" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>~${Math.round(comparisonTotalMonthly * 1.28).toLocaleString()}</span></div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24" style={{ background: "#fff" }}>
        <div className="max-w-[980px] mx-auto px-6">
          <Reveal>
            <h2 className="text-center font-semibold mb-3" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.015em", color: "#1d1d1f", lineHeight: 1.08 }}>Pick your plan.</h2>
            <p className="text-center mb-16" style={{ fontSize: 19, color: "#86868b" }}>Start for free. Upgrade when you&apos;re ready.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[880px] mx-auto">
            <Reveal delay={0}>
              <div className="rounded-2xl p-8 flex flex-col h-full" style={{ background: "#fbfbfd", border: "1px solid #e8e8ed" }}>
                <h3 className="text-lg font-semibold" style={{ color: "#1d1d1f" }}>Starter</h3>
                <p className="text-sm mt-0.5 mb-5" style={{ color: "#86868b" }}>For side projects</p>
                <div className="mb-6"><span className="text-4xl font-bold tracking-tight" style={{ color: "#1d1d1f" }}>$29</span><span className="text-sm ml-0.5" style={{ color: "#86868b" }}>/mo</span></div>
                <ul className="space-y-3 text-sm flex-1 mb-8" style={{ color: "#1d1d1f" }}>
                  <PricingCheck>Works every night</PricingCheck>
                  <PricingCheck>Up to 3 tasks per cycle</PricingCheck>
                  <PricingCheck>Daily briefings</PricingCheck>
                </ul>
                <Link href="/onboard" className="text-center text-sm font-medium py-2.5 rounded-full block" style={{ border: "1px solid #0071e3", color: "#0071e3" }}>Get Started</Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl p-8 flex flex-col relative h-full" style={{ background: "#1d1d1f", color: "#fff" }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ background: "#0071e3", color: "#fff" }}>Most Popular</span></div>
                <h3 className="text-lg font-semibold">Growth</h3>
                <p className="text-sm mt-0.5 mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>For growing businesses</p>
                <div className="mb-6"><span className="text-4xl font-bold tracking-tight">$99</span><span className="text-sm ml-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>/mo</span></div>
                <ul className="space-y-3 text-sm flex-1 mb-8">
                  <PricingCheckDark>Works every night</PricingCheckDark>
                  <PricingCheckDark>Up to 10 tasks per cycle</PricingCheckDark>
                  <PricingCheckDark>Longer cycles, deeper work</PricingCheckDark>
                  <PricingCheckDark>Smartest AI for strategy</PricingCheckDark>
                </ul>
                <Link href="/onboard" className="text-center text-sm font-medium py-2.5 rounded-full block" style={{ background: "#0071e3", color: "#fff" }}>Get Started</Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="rounded-2xl p-8 flex flex-col h-full" style={{ background: "#fbfbfd", border: "1px solid #e8e8ed" }}>
                <h3 className="text-lg font-semibold" style={{ color: "#1d1d1f" }}>Scale</h3>
                <p className="text-sm mt-0.5 mb-5" style={{ color: "#86868b" }}>For serious operators</p>
                <div className="mb-6"><span className="text-4xl font-bold tracking-tight" style={{ color: "#1d1d1f" }}>$299</span><span className="text-sm ml-0.5" style={{ color: "#86868b" }}>/mo</span></div>
                <ul className="space-y-3 text-sm flex-1 mb-8" style={{ color: "#1d1d1f" }}>
                  <PricingCheck>Works every night</PricingCheck>
                  <PricingCheck>Unlimited tasks per cycle</PricingCheck>
                  <PricingCheck>Longest cycles, deepest work</PricingCheck>
                  <PricingCheck>Priority AI processing</PricingCheck>
                </ul>
                <Link href="/onboard" className="text-center text-sm font-medium py-2.5 rounded-full block" style={{ border: "1px solid #0071e3", color: "#0071e3" }}>Get Started</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24" style={{ background: "#f5f5f7" }}>
        <div className="max-w-[680px] mx-auto px-6">
          <Reveal>
            <h2 className="text-center font-semibold mb-16" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.015em", color: "#1d1d1f", lineHeight: 1.08 }}>Questions? Answers.</h2>
          </Reveal>
          <div>
            {faqs.map((faq, i) => {
              const isOpen = expandedFaq === i;
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div style={{ borderTop: i === 0 ? "1px solid #d2d2d7" : undefined }}>
                    <button className="w-full flex items-center justify-between py-5 text-left cursor-pointer" style={{ borderBottom: "1px solid #d2d2d7" }} onClick={() => setExpandedFaq(isOpen ? null : i)} aria-expanded={isOpen}>
                      <span className="text-[16px] font-semibold pr-4" style={{ color: "#1d1d1f" }}>{faq.q}</span>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 transition-transform duration-300" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                        <line x1="10" y1="4" x2="10" y2="16" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="4" y1="10" x2="16" y2="10" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                    <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
                      <div style={{ overflow: "hidden" }}>
                        <p className="py-4 text-[15px]" style={{ color: "#6e6e73", lineHeight: 1.6 }}>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <Reveal>
        <section className="py-24" style={{ background: "#fff" }}>
          <div className="max-w-[980px] mx-auto px-6 text-center">
            <h2 className="font-semibold mb-3" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.015em", color: "#1d1d1f", lineHeight: 1.08 }}>Try RunMyBiz free.</h2>
            <p className="mb-6" style={{ fontSize: 21, color: "#86868b", lineHeight: 1.38 }}>Describe your business. Your AI agent starts tonight.</p>
            <Link href="/onboard" className="text-sm font-medium px-6 py-2.5 rounded-full" style={{ background: "#0071e3", color: "#fff" }}>Get started</Link>
          </div>
        </section>
      </Reveal>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: "1px solid #d2d2d7" }}>
        <div className="max-w-[980px] mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-xs" style={{ color: "#86868b" }}>Copyright &copy; {new Date().getFullYear()} RunMyBiz. All rights reserved.</span>
          <Link href="/dashboard" className="text-xs" style={{ color: "#424245" }}>Sign In</Link>
        </div>
      </footer>

      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes briefing-check {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   HERO — Animated Morning Briefing (#1 + #9)
   ============================================================ */
function AnimatedBriefing() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = [
    { done: true, title: "Redesigned the pricing page", sub: "Updated copy, added testimonial section, deployed to production" },
    { done: true, title: "Sent 47 outreach emails", sub: "Personalized cold emails to leads from your target list" },
    { done: true, title: "Fixed checkout bug", sub: "Users on Safari can now complete purchases — 3 were stuck yesterday" },
    { done: false, title: "Waiting for your approval", sub: "Ready to launch a Google Ads campaign — $50/day budget" },
  ];

  return (
    <Reveal delay={0.2}>
      <div ref={ref} className="max-w-[620px] mx-auto mt-16 px-6">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "#86868b", letterSpacing: "0.12em" }}>What your morning looks like</p>
        <div className="rounded-2xl text-left overflow-hidden" style={{ background: "#fff", border: "1px solid #e8e8ed", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div className="px-7 pt-6 pb-4" style={{ borderBottom: "1px solid #f0f0f5" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-semibold" style={{ color: "#1d1d1f" }}>Morning Briefing</span>
              <span className="text-[12px]" style={{ color: "#86868b" }}>Today, 7:00 AM</span>
            </div>
            <span className="text-[12px]" style={{ color: "#86868b" }}>
              Your AI worked <CountUp target={6} /> hours overnight
            </span>
          </div>
          <div className="px-7 py-5 space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3" style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.5s cubic-bezier(0.4,0,0.2,1) ${0.3 + i * 0.25}s, transform 0.5s cubic-bezier(0.4,0,0.2,1) ${0.3 + i * 0.25}s`,
              }}>
                <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center" style={{ background: item.done ? "#e8f5e9" : "#fff3e0" }}>
                  {item.done ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6.5l2 2 4-4.5" stroke="#34a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="1.5" fill="#f59e0b" /></svg>}
                </div>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "#1d1d1f" }}>{item.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "#86868b" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-7 py-4 flex items-center justify-between" style={{ background: "#f5f5f7", opacity: active ? 1 : 0, transition: "opacity 0.5s 1.5s" }}>
            <div className="flex items-center gap-5">
              <span className="text-[12px]" style={{ color: "#1d1d1f" }}><strong>3</strong> completed</span>
              <span className="text-[12px]" style={{ color: "#f59e0b" }}><strong>1</strong> needs approval</span>
            </div>
            <span className="text-[12px] font-medium" style={{ color: "#0071e3" }}>View details</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ============================================================
   Pricing helpers
   ============================================================ */
function PricingCheck({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0"><circle cx="9" cy="9" r="9" fill="#e8e8ed" /><path d="M5.5 9.5l2.5 2.5L12.5 6.5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>{children}</span>
    </li>
  );
}

function PricingCheckDark({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0"><circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.1)" /><path d="M5.5 9.5l2.5 2.5L12.5 6.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>{children}</span>
    </li>
  );
}
