import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Demo Mode Middleware
// ---------------------------------------------------------------------------
// When DEMO_MODE=true **or** running on Vercel (VERCEL=1) this middleware
// intercepts every /api/* request and returns realistic mock data so the
// front-end can be demonstrated without a live backend or database.
// ---------------------------------------------------------------------------

const DEMO =
  process.env.DEMO_MODE === "true" || process.env.VERCEL === "1";

// ── Helpers ────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** ISO date string offset from "now" by `days` (negative = past). */
function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** Short human-readable timestamp for activity entries. */
function timeAgo(minutesAgo: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

// ── Mock Data ──────────────────────────────────────────────────────────────

// -- Agents ------------------------------------------------------------------

const AGENTS = [
  {
    id: "agent-ceo",
    role: "ceo",
    title: "CEO",
    name: "The Strategist",
    model: "opus",
    department: "executive",
    description:
      "Oversees all departments, sets company vision, makes high-level decisions, and coordinates cross-functional initiatives. Acts as the primary point of contact for the business owner.",
    capabilities: [
      "strategic planning",
      "resource allocation",
      "cross-department coordination",
      "decision making",
      "stakeholder communication",
    ],
    status: "active",
    avatar: "/avatars/ceo.png",
    tasksCompleted: 12,
    tasksInProgress: 3,
    trustScore: 94,
    lastActive: timeAgo(2),
  },
  {
    id: "agent-marketing",
    role: "marketing",
    title: "Marketing Director",
    name: "The Growth Engine",
    model: "sonnet",
    department: "marketing",
    description:
      "Drives brand awareness, manages paid and organic acquisition channels, plans campaigns, and optimizes marketing spend for maximum ROI.",
    capabilities: [
      "campaign management",
      "brand strategy",
      "paid advertising",
      "market research",
      "growth hacking",
    ],
    status: "active",
    avatar: "/avatars/marketing.png",
    tasksCompleted: 18,
    tasksInProgress: 4,
    trustScore: 91,
    lastActive: timeAgo(5),
  },
  {
    id: "agent-sales",
    role: "sales",
    title: "Sales Manager",
    name: "The Closer",
    model: "sonnet",
    department: "sales",
    description:
      "Manages the sales pipeline, handles B2B outreach, negotiates partnerships, and optimizes conversion funnels from lead to paying customer.",
    capabilities: [
      "lead generation",
      "pipeline management",
      "negotiation",
      "CRM management",
      "conversion optimization",
    ],
    status: "active",
    avatar: "/avatars/sales.png",
    tasksCompleted: 9,
    tasksInProgress: 2,
    trustScore: 88,
    lastActive: timeAgo(12),
  },
  {
    id: "agent-operations",
    role: "operations",
    title: "Operations Lead",
    name: "The Optimizer",
    model: "sonnet",
    department: "operations",
    description:
      "Streamlines supply chain, manages vendor relationships, ensures quality control, and builds repeatable processes that scale.",
    capabilities: [
      "process optimization",
      "supply chain management",
      "vendor negotiation",
      "quality assurance",
      "logistics planning",
    ],
    status: "active",
    avatar: "/avatars/operations.png",
    tasksCompleted: 14,
    tasksInProgress: 2,
    trustScore: 92,
    lastActive: timeAgo(8),
  },
  {
    id: "agent-engineering",
    role: "engineering",
    title: "Engineer",
    name: "The Builder",
    model: "sonnet",
    department: "engineering",
    description:
      "Builds and maintains the technical infrastructure — website, checkout flow, integrations, analytics pipelines, and automation tooling.",
    capabilities: [
      "web development",
      "API integrations",
      "automation",
      "analytics setup",
      "performance optimization",
    ],
    status: "active",
    avatar: "/avatars/engineering.png",
    tasksCompleted: 11,
    tasksInProgress: 3,
    trustScore: 95,
    lastActive: timeAgo(3),
  },
  {
    id: "agent-content",
    role: "content",
    title: "Content Creator",
    name: "The Storyteller",
    model: "haiku",
    department: "marketing",
    description:
      "Produces blog posts, social media content, email copy, product descriptions, and brand storytelling that resonates with the target audience.",
    capabilities: [
      "copywriting",
      "social media content",
      "email marketing",
      "SEO writing",
      "brand voice",
    ],
    status: "active",
    avatar: "/avatars/content.png",
    tasksCompleted: 22,
    tasksInProgress: 5,
    trustScore: 89,
    lastActive: timeAgo(1),
  },
  {
    id: "agent-analytics",
    role: "analytics",
    title: "Data Analyst",
    name: "The Numbers",
    model: "haiku",
    department: "operations",
    description:
      "Tracks KPIs, builds dashboards, runs A/B tests, and provides data-driven recommendations to every department.",
    capabilities: [
      "data analysis",
      "KPI tracking",
      "A/B testing",
      "reporting",
      "forecasting",
    ],
    status: "active",
    avatar: "/avatars/analytics.png",
    tasksCompleted: 16,
    tasksInProgress: 2,
    trustScore: 93,
    lastActive: timeAgo(6),
  },
];

// -- Tasks (30-day plan) -----------------------------------------------------

const TASKS = [
  // ── Week 1 ──────────────────────────────────────────────────────────────
  {
    id: "task-001",
    title: "Market Research & Industry Analysis",
    description:
      "Conduct comprehensive research on the D2C coffee subscription market including TAM, key trends, consumer preferences, and growth projections for 2026.",
    status: "completed",
    assignee: "marketing",
    week: 1,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-27),
    endDate: dateOffset(-25),
    outcome:
      "Identified $48B specialty coffee market growing at 12% CAGR. Key insight: 67% of subscribers value origin transparency. Top opportunity: single-origin subscriptions with roast-date guarantees.",
  },
  {
    id: "task-002",
    title: "Competitor Deep Dive",
    description:
      "Analyze top 10 D2C coffee competitors (Trade, Atlas, Blue Bottle, Driftaway, etc.) — pricing, positioning, subscription models, retention strategies, and customer reviews.",
    status: "completed",
    assignee: "analytics",
    week: 1,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-27),
    endDate: dateOffset(-24),
    outcome:
      "Mapped 10 competitors across price/quality matrix. Gap identified: no competitor offers AI-personalized roast profiles with weekly freshness guarantees under $18/bag. Average churn: 22% at month 3.",
  },
  {
    id: "task-003",
    title: "Brand Identity & Positioning",
    description:
      "Define brand pillars, voice, visual identity direction, and unique value proposition for FreshRoast Coffee. Create brand guidelines document.",
    status: "completed",
    assignee: "content",
    week: 1,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-26),
    endDate: dateOffset(-23),
    outcome:
      'Brand positioning: "Absurdly Fresh Coffee, Personally Yours." Three pillars: Freshness (roasted-to-order), Personalization (AI taste profiling), Transparency (farm-to-cup traceability). Color palette and type system finalized.',
  },
  {
    id: "task-004",
    title: "Website Architecture & Shopify Setup",
    description:
      "Design information architecture, select and customize Shopify theme, configure subscription app (Recharge), set up product catalog with 6 initial SKUs.",
    status: "completed",
    assignee: "engineering",
    week: 1,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-25),
    endDate: dateOffset(-21),
    outcome:
      "Shopify store live at freshroast.coffee with Dawn theme customized to brand. Recharge configured for weekly/biweekly/monthly cadences. 6 single-origin SKUs loaded with descriptions, images, and tasting notes.",
  },
  {
    id: "task-005",
    title: "Supply Chain & Roaster Partnership",
    description:
      "Identify and negotiate terms with 3 small-batch roasters for white-label roast-to-order fulfillment. Establish quality standards and SLA for 48-hour roast-to-ship.",
    status: "completed",
    assignee: "operations",
    week: 1,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-26),
    endDate: dateOffset(-21),
    outcome:
      "Signed LOI with Basecamp Roasters (Portland) as primary partner — $9.20/bag COGS at 500+ units/mo, 48hr roast-to-ship SLA. Two backup roasters identified for scale.",
  },

  // ── Week 2 ──────────────────────────────────────────────────────────────
  {
    id: "task-006",
    title: "Content Strategy & Editorial Calendar",
    description:
      "Build a 90-day content calendar spanning blog, Instagram, TikTok, and email. Define content pillars, posting cadence, and production workflow.",
    status: "completed",
    assignee: "content",
    week: 2,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-20),
    endDate: dateOffset(-18),
    outcome:
      '90-day calendar complete: 3 blog posts/week, daily Instagram, 4 TikToks/week, 2 emails/week. Content pillars: "Behind the Bean" (origin stories), "Brew Better" (tutorials), "Fresh Drops" (new releases).',
  },
  {
    id: "task-007",
    title: "Email Welcome & Nurture Sequences",
    description:
      "Write and configure a 7-email welcome series for new subscribers and a 5-email win-back sequence for churned customers in Klaviyo.",
    status: "completed",
    assignee: "content",
    week: 2,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-19),
    endDate: dateOffset(-16),
    outcome:
      "Welcome series (7 emails) deployed in Klaviyo with 52% average open rate in test sends. Win-back sequence includes 15% discount at email 3 and free bag upgrade at email 5. All flows A/B tested on subject lines.",
  },
  {
    id: "task-008",
    title: "Social Media Account Setup & Branding",
    description:
      "Create and brand Instagram, TikTok, Twitter/X, and Facebook accounts. Write bios, upload profile/banner images, and post initial 5 pieces of content on each.",
    status: "completed",
    assignee: "marketing",
    week: 2,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-20),
    endDate: dateOffset(-17),
    outcome:
      "All 4 social accounts live and branded. Instagram seeded with 12 posts (grid aesthetic established). TikTok has 5 short-form videos ready. Combined initial following: 340 (organic from personal networks).",
  },
  {
    id: "task-009",
    title: "Technical SEO Audit & On-Page Optimization",
    description:
      "Run full technical SEO audit (Core Web Vitals, schema markup, sitemap, robots.txt). Optimize all product and collection pages for target keywords.",
    status: "completed",
    assignee: "engineering",
    week: 2,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-18),
    endDate: dateOffset(-15),
    outcome:
      "All Core Web Vitals green. Schema markup added for Product, Organization, and FAQ. Sitemap submitted to GSC. 23 pages optimized for target keywords — primary: 'coffee subscription', 'fresh roasted coffee delivered'.",
  },
  {
    id: "task-010",
    title: "Analytics & Tracking Infrastructure",
    description:
      "Set up GA4, Meta Pixel, TikTok Pixel, server-side tracking via Shopify, and a unified KPI dashboard in Looker Studio.",
    status: "completed",
    assignee: "analytics",
    week: 2,
    canEdit: false,
    canCancel: false,
    startDate: dateOffset(-19),
    endDate: dateOffset(-15),
    outcome:
      "Full tracking stack deployed: GA4 + enhanced ecommerce, Meta CAPI, TikTok Events API, Klaviyo integration. Looker Studio dashboard live with real-time revenue, CAC, LTV, churn, and funnel metrics.",
  },

  // ── Week 3 ──────────────────────────────────────────────────────────────
  {
    id: "task-011",
    title: "Launch Meta & Google Ads Campaigns",
    description:
      "Create and launch initial paid acquisition campaigns: Meta (prospecting + retargeting), Google (brand + non-brand search, Shopping). Set daily budget at $75.",
    status: "in_progress",
    assignee: "marketing",
    week: 3,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-13),
    endDate: dateOffset(-8),
    outcome: null,
  },
  {
    id: "task-012",
    title: "Influencer Outreach Campaign",
    description:
      "Identify 50 micro-influencers (10K–100K followers) in coffee, lifestyle, and WFH niches. Send personalized outreach with free product offer in exchange for honest review.",
    status: "in_progress",
    assignee: "sales",
    week: 3,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-12),
    endDate: dateOffset(-7),
    outcome: null,
  },
  {
    id: "task-013",
    title: "B2B Partnership Proposals",
    description:
      "Draft and send partnership proposals to 10 complementary brands (ceramic mug makers, pastry shops, co-working spaces) for cross-promotion and bundled offers.",
    status: "in_progress",
    assignee: "sales",
    week: 3,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-11),
    endDate: dateOffset(-6),
    outcome: null,
  },
  {
    id: "task-014",
    title: "Referral Program Implementation",
    description:
      "Build and launch a 'Give $5, Get $5' referral program using ReferralCandy. Create shareable landing pages and email triggers.",
    status: "planned",
    assignee: "engineering",
    week: 3,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-10),
    endDate: dateOffset(-6),
    outcome: null,
  },
  {
    id: "task-015",
    title: "First Blog Posts & SEO Content Push",
    description:
      "Publish 6 long-form blog posts targeting high-intent keywords: 'best coffee subscription 2026', 'single origin vs blend', 'how to brew pour over at home', etc.",
    status: "in_progress",
    assignee: "content",
    week: 3,
    canEdit: true,
    canCancel: false,
    startDate: dateOffset(-13),
    endDate: dateOffset(-7),
    outcome: null,
  },

  // ── Week 4 ──────────────────────────────────────────────────────────────
  {
    id: "task-016",
    title: "Performance Review & Channel Analysis",
    description:
      "Compile 30-day performance report: revenue, CAC by channel, LTV projections, funnel conversion rates, and top-performing content. Present findings and recommendations.",
    status: "planned",
    assignee: "analytics",
    week: 4,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-4),
    endDate: dateOffset(-2),
    outcome: null,
  },
  {
    id: "task-017",
    title: "Ad Creative & Audience Optimization",
    description:
      "Based on Week 3 data, kill underperforming ad sets, scale winners, test 5 new creatives, and refine lookalike audiences for Meta. Adjust Google bids.",
    status: "planned",
    assignee: "marketing",
    week: 4,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-4),
    endDate: dateOffset(-1),
    outcome: null,
  },
  {
    id: "task-018",
    title: "Customer Feedback Loop & NPS Survey",
    description:
      "Send NPS survey to first 100 subscribers. Aggregate feedback themes, identify top 3 improvement areas, and create action items for each department.",
    status: "planned",
    assignee: "operations",
    week: 4,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-3),
    endDate: dateOffset(-1),
    outcome: null,
  },
  {
    id: "task-019",
    title: "Scaling Prep & Month 2 Planning",
    description:
      "Based on Month 1 learnings, draft Month 2 plan: new SKUs, expanded ad budget, wholesale channel exploration, and hiring roadmap for first human team members.",
    status: "pending",
    assignee: "ceo",
    week: 4,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-2),
    endDate: dateOffset(0),
    outcome: null,
  },
  {
    id: "task-020",
    title: "Subscription Box Upsell Feature",
    description:
      "Design and implement a 'Build Your Box' upgrade flow where subscribers can add pastries, mugs, or brewing gear to their next shipment. Integrate with Recharge.",
    status: "pending",
    assignee: "engineering",
    week: 4,
    canEdit: true,
    canCancel: true,
    startDate: dateOffset(-1),
    endDate: dateOffset(3),
    outcome: null,
  },
];

// -- Activity Log ------------------------------------------------------------

const ACTIVITY = [
  {
    id: "act-001",
    type: "delegation",
    from: "ceo",
    to: "marketing",
    message:
      "Kicking off the 30-day launch plan. Your first priority is a full market research report on the D2C coffee subscription space. Focus on TAM, consumer trends, and pricing benchmarks.",
    timestamp: timeAgo(1440),
    taskId: "task-001",
  },
  {
    id: "act-002",
    type: "delegation",
    from: "ceo",
    to: "analytics",
    message:
      "Run a competitor deep-dive on the top 10 D2C coffee brands. I need a pricing matrix, subscription model comparison, and retention data if available.",
    timestamp: timeAgo(1430),
    taskId: "task-002",
  },
  {
    id: "act-003",
    type: "task_started",
    from: "marketing",
    to: "ceo",
    message:
      "Starting market research now. I'll cover Statista, IBISWorld, and recent Specialty Coffee Association reports. ETA: 48 hours.",
    timestamp: timeAgo(1420),
    taskId: "task-001",
  },
  {
    id: "act-004",
    type: "research_complete",
    from: "analytics",
    to: "ceo",
    message:
      "Competitor analysis complete. Key finding: there's a clear gap in the $14–18/bag range for single-origin, roast-to-order subscriptions with AI personalization. No competitor owns this positioning.",
    timestamp: timeAgo(1100),
    taskId: "task-002",
  },
  {
    id: "act-005",
    type: "decision",
    from: "ceo",
    to: "content",
    message:
      'Great intel from analytics. Let\'s build our brand around "Absurdly Fresh Coffee, Personally Yours." Start on brand identity — pillars, voice, and visual direction.',
    timestamp: timeAgo(1080),
    taskId: "task-003",
  },
  {
    id: "act-006",
    type: "delegation",
    from: "ceo",
    to: "operations",
    message:
      "We need a roast-to-order fulfillment partner. Find 3 small-batch roasters who can guarantee 48-hour roast-to-ship. Target COGS under $10/bag at 500+ units.",
    timestamp: timeAgo(1070),
    taskId: "task-005",
  },
  {
    id: "act-007",
    type: "task_completed",
    from: "marketing",
    to: "ceo",
    message:
      "Market research report delivered. The $48B specialty coffee market is growing at 12% CAGR. 67% of subscribers say origin transparency is their #1 factor. Full report attached.",
    timestamp: timeAgo(960),
    taskId: "task-001",
  },
  {
    id: "act-008",
    type: "status_update",
    from: "operations",
    to: "ceo",
    message:
      "Narrowed roaster shortlist to 5 candidates. Basecamp Roasters (Portland) looks strongest — great quality scores, capacity for 2K bags/mo, and they already do white-label. Setting up calls.",
    timestamp: timeAgo(900),
    taskId: "task-005",
  },
  {
    id: "act-009",
    type: "task_completed",
    from: "content",
    to: "ceo",
    message:
      "Brand identity package ready for review. Three pillars: Freshness, Personalization, Transparency. I've defined our voice as knowledgeable-but-approachable, never pretentious. Color palette and type system included.",
    timestamp: timeAgo(780),
    taskId: "task-003",
  },
  {
    id: "act-010",
    type: "delegation",
    from: "ceo",
    to: "engineering",
    message:
      "Brand identity is approved. Start building the Shopify store — Dawn theme, customized to brand. Configure Recharge for weekly/biweekly/monthly subscription options. Load 6 initial SKUs.",
    timestamp: timeAgo(770),
    taskId: "task-004",
  },
  {
    id: "act-011",
    type: "question",
    from: "engineering",
    to: "ceo",
    message:
      "Should we offer a one-time purchase option alongside subscriptions, or go subscription-only at launch? Subscription-only simplifies the funnel but limits impulse buys.",
    timestamp: timeAgo(750),
  },
  {
    id: "act-012",
    type: "answer",
    from: "ceo",
    to: "engineering",
    message:
      "Offer both. One-time purchase at $19.99, subscription at $15.99 (20% off). Show the savings prominently. Subscription-first in the UI, but don't block one-time buyers.",
    timestamp: timeAgo(745),
  },
  {
    id: "act-013",
    type: "task_completed",
    from: "operations",
    to: "ceo",
    message:
      "Signed LOI with Basecamp Roasters. Terms: $9.20/bag at 500+ units, 48hr roast-to-ship SLA, quality audit every 30 days. Two backup roasters on standby.",
    timestamp: timeAgo(600),
    taskId: "task-005",
  },
  {
    id: "act-014",
    type: "task_completed",
    from: "engineering",
    to: "ceo",
    message:
      "Shopify store is live at freshroast.coffee. All 6 SKUs loaded with descriptions, images, tasting notes, and origin maps. Recharge configured. Checkout flow tested end-to-end.",
    timestamp: timeAgo(480),
    taskId: "task-004",
  },
  {
    id: "act-015",
    type: "delegation",
    from: "ceo",
    to: "content",
    message:
      "Store is live. Now build out the 90-day content calendar and start on the email welcome series. Coordinate with marketing on social account setup.",
    timestamp: timeAgo(470),
    taskId: "task-006",
  },
  {
    id: "act-016",
    type: "status_update",
    from: "content",
    to: "marketing",
    message:
      "Content calendar drafted — 3 blog posts/week, daily IG, 4 TikToks/week, 2 emails/week. Can you review the social posting cadence and confirm it aligns with ad scheduling?",
    timestamp: timeAgo(380),
    taskId: "task-006",
  },
  {
    id: "act-017",
    type: "task_completed",
    from: "analytics",
    to: "ceo",
    message:
      "Tracking infrastructure fully deployed. GA4 with enhanced ecommerce, Meta CAPI, TikTok Events API, Klaviyo integration. Looker Studio dashboard is live — real-time revenue, CAC, LTV, churn, and funnel metrics all working.",
    timestamp: timeAgo(280),
    taskId: "task-010",
  },
  {
    id: "act-018",
    type: "task_started",
    from: "marketing",
    to: "ceo",
    message:
      "Launching Meta and Google campaigns now. Starting with $75/day split: $45 Meta (prospecting + retargeting), $30 Google (brand + non-brand + Shopping). First results in 72 hours.",
    timestamp: timeAgo(180),
    taskId: "task-011",
  },
  {
    id: "act-019",
    type: "status_update",
    from: "sales",
    to: "ceo",
    message:
      "Influencer outreach in progress. Sent personalized pitches to 28 of 50 targets so far. 6 have already responded positively — sending product this week. Most excited: @coffeewithlena (82K followers).",
    timestamp: timeAgo(90),
    taskId: "task-012",
  },
  {
    id: "act-020",
    type: "status_update",
    from: "marketing",
    to: "ceo",
    message:
      "48-hour ad update: Meta CPM at $11.20 (below benchmark), CTR at 2.4%. Google brand search CPC at $0.85. Early ROAS: 1.8x. Scaling the top 2 ad sets by 20% tomorrow.",
    timestamp: timeAgo(45),
    taskId: "task-011",
  },
  {
    id: "act-021",
    type: "decision",
    from: "ceo",
    to: "sales",
    message:
      "Good traction on influencer outreach. Prioritize the 6 confirmed creators — get product shipped today. For the partnership proposals, focus on co-working spaces first; the WFH-coffee angle is our strongest play.",
    timestamp: timeAgo(30),
    taskId: "task-012",
  },
  {
    id: "act-022",
    type: "status_update",
    from: "content",
    to: "ceo",
    message:
      "4 of 6 blog posts published. 'Best Coffee Subscription 2026' already indexed and ranking position 18 for target keyword. Internal linking structure in place. Remaining 2 posts go live tomorrow.",
    timestamp: timeAgo(15),
    taskId: "task-015",
  },
  {
    id: "act-023",
    type: "status_update",
    from: "engineering",
    to: "ceo",
    message:
      "Referral program spec is ready. Using ReferralCandy — 'Give $5, Get $5' with custom landing page. Need design review before I start building. ETA once approved: 2 days.",
    timestamp: timeAgo(8),
    taskId: "task-014",
  },
];

// -- Chat History ------------------------------------------------------------

const CHAT_MESSAGES = [
  {
    id: "msg-001",
    role: "user" as const,
    content: "How's the launch going? Give me a quick status update.",
    timestamp: timeAgo(200),
  },
  {
    id: "msg-002",
    role: "assistant" as const,
    agentRole: "ceo",
    content:
      "Great timing — here's where we stand at Day 18 of the 30-day plan.\n\n**Completed (10 of 20 tasks):**\n- Market research and competitor analysis are done. We've validated a clear gap in the $14–18 range for roast-to-order subscriptions.\n- Brand identity is locked: \"Absurdly Fresh Coffee, Personally Yours.\"\n- Shopify store is live with 6 SKUs, Recharge configured.\n- Basecamp Roasters signed as our fulfillment partner ($9.20/bag, 48hr SLA).\n- All social accounts branded and seeded. Email sequences deployed in Klaviyo.\n- Full analytics stack is up — Looker Studio dashboard is live.\n\n**In Progress (5 tasks):**\n- Paid ads launched 2 days ago. Early ROAS at 1.8x, CPM below benchmark.\n- Influencer outreach: 6 of 50 confirmed, product shipping this week.\n- Blog content push: 4 of 6 posts published, already seeing organic traction.\n\nOverall: we're on track. The biggest variable right now is ad performance — we'll know more in 5 days.",
    timestamp: timeAgo(195),
  },
  {
    id: "msg-003",
    role: "user" as const,
    content: "What's our biggest risk right now?",
    timestamp: timeAgo(190),
  },
  {
    id: "msg-004",
    role: "assistant" as const,
    agentRole: "ceo",
    content:
      "Our biggest risk is **customer acquisition cost (CAC) at scale**. Right now we're seeing a 1.8x ROAS on a $75/day budget, which is promising but too early to be conclusive.\n\nHere's why it matters: at our current $15.99 subscription price with $9.20 COGS, our margin per order is ~$6.79. If CAC goes above $25, we need subscribers to stay for 4+ months just to break even. Industry average churn at month 3 is 22%.\n\n**My mitigation plan:**\n1. Diversify channels early — don't rely solely on paid. The influencer program and SEO content are our organic hedges.\n2. Nail the welcome sequence. If we can get 60%+ retention at month 3, the unit economics work even at $30 CAC.\n3. Launch the referral program next week. Referred customers historically have 37% higher LTV.\n\nI've already asked Analytics to set up a CAC-by-channel dashboard so we can kill underperformers fast.",
    timestamp: timeAgo(185),
  },
  {
    id: "msg-005",
    role: "user" as const,
    content: "Can we increase the ad budget?",
    timestamp: timeAgo(120),
  },
  {
    id: "msg-006",
    role: "assistant" as const,
    agentRole: "ceo",
    content:
      "I'd recommend waiting 5 more days before scaling the budget. Here's my reasoning:\n\n**Why not now:**\n- We only have 48 hours of data. Meta's learning phase typically needs 50 conversions per ad set to optimize, and we're at ~12.\n- Scaling too early locks in a higher CPA because the algorithm hasn't found the best audience segments yet.\n\n**The plan:**\n- **Day 21 (3 days from now):** If ROAS holds above 1.5x, I'll increase budget by 30% to $97.50/day and add 2 new creatives.\n- **Day 25:** Full review. If we're above 2x ROAS, I'll propose scaling to $150/day and testing TikTok Ads as a new channel.\n\nI've set this as a conditional decision — Marketing knows to scale at Day 21 if the numbers hold. You don't need to do anything unless you want to override.",
    timestamp: timeAgo(115),
  },
  {
    id: "msg-007",
    role: "user" as const,
    content: "What about the influencer results? Anyone post yet?",
    timestamp: timeAgo(60),
  },
  {
    id: "msg-008",
    role: "assistant" as const,
    agentRole: "ceo",
    content:
      "Product just shipped to the first 6 confirmed influencers yesterday, so no posts yet. Here's the breakdown:\n\n**Confirmed & Product Shipped:**\n1. @coffeewithlena (82K, lifestyle) — most engaged, already DM'd asking about our origin story\n2. @wfh.brews (45K, WFH niche) — perfect audience match\n3. @thecuppingreport (38K, specialty coffee) — credibility play\n4. @morningpages_ (67K, creative/journaling) — lifestyle angle\n5. @desksetup.daily (55K, productivity) — great for the \"fuel your morning\" narrative\n6. @beanscene.pdx (22K, Portland local) — hyper-engaged community\n\n**Expected timeline:** Product arrives in 2-3 days. Most influencers post within 5-7 days of receiving. We should see the first posts by Day 23-25.\n\nSales is continuing outreach to the remaining 22 targets this week. I've asked them to prioritize the WFH and productivity niches — that's where our messaging resonates most based on early ad data.",
    timestamp: timeAgo(55),
  },
  {
    id: "msg-009",
    role: "user" as const,
    content: "This is great. Keep me posted on ad performance.",
    timestamp: timeAgo(50),
  },
  {
    id: "msg-010",
    role: "assistant" as const,
    agentRole: "ceo",
    content:
      "Will do. I'll send you a summary at Day 21 with the ad scaling decision, and a full Week 3 performance report on Day 25. In the meantime, you'll see all agent activity in the live feed.\n\nOne thing to flag: Engineering has the referral program spec ready and is waiting on design approval. I think the proposed 'Give $5, Get $5' model is solid — mind giving it a thumbs up so they can start building? It's a 2-day build once approved.",
    timestamp: timeAgo(48),
  },
];

// -- Company -----------------------------------------------------------------

const COMPANY = {
  id: "company-freshroast",
  name: "FreshRoast Coffee",
  tagline: "Absurdly Fresh Coffee, Personally Yours.",
  industry: "D2C / Food & Beverage",
  stage: "launch",
  tier: "growth",
  credits: 8420,
  creditsUsed: 1580,
  autonomyLevel: "high",
  trustScore: 92,
  status: "active",
  createdAt: dateOffset(-30),
  currentDay: 18,
  totalDays: 30,
  tasksCompleted: 10,
  tasksTotal: 20,
  agentCount: 7,
  owner: {
    name: "Demo User",
    email: "demo@freshroast.coffee",
  },
};

// -- Company Plan ------------------------------------------------------------

const COMPANY_PLAN = {
  id: "plan-001",
  companyId: "company-freshroast",
  title: "30-Day Launch Plan: FreshRoast Coffee",
  description:
    "A comprehensive launch plan to take FreshRoast Coffee from concept to first paying subscribers in 30 days. Covers market research, brand development, store setup, content marketing, paid acquisition, and optimization.",
  status: "in_progress",
  startDate: dateOffset(-30),
  endDate: dateOffset(0),
  currentWeek: 3,
  progress: 50,
  weeks: [
    {
      week: 1,
      title: "Foundation & Research",
      description:
        "Market research, competitor analysis, brand identity, supply chain setup, and website launch.",
      status: "completed",
      tasks: TASKS.filter((t) => t.week === 1).map((t) => t.id),
    },
    {
      week: 2,
      title: "Content & Infrastructure",
      description:
        "Content strategy, email sequences, social media setup, SEO optimization, and analytics infrastructure.",
      status: "completed",
      tasks: TASKS.filter((t) => t.week === 2).map((t) => t.id),
    },
    {
      week: 3,
      title: "Acquisition & Growth",
      description:
        "Paid advertising launch, influencer outreach, B2B partnerships, referral program, and SEO content push.",
      status: "in_progress",
      tasks: TASKS.filter((t) => t.week === 3).map((t) => t.id),
    },
    {
      week: 4,
      title: "Optimization & Scale",
      description:
        "Performance review, ad optimization, customer feedback, and Month 2 planning.",
      status: "planned",
      tasks: TASKS.filter((t) => t.week === 4).map((t) => t.id),
    },
  ],
  tasks: TASKS,
};

// -- Settings ----------------------------------------------------------------

const SETTINGS = {
  companyId: "company-freshroast",
  notifications: {
    email: true,
    push: true,
    dailyDigest: true,
    taskCompleted: true,
    budgetAlerts: true,
    weeklyReport: true,
  },
  autonomy: {
    level: "high",
    requireApprovalAbove: 500,
    autoApproveTaskTypes: [
      "research",
      "content_creation",
      "social_media",
      "seo",
    ],
    requireApprovalFor: [
      "budget_increase",
      "new_vendor",
      "pricing_change",
      "hiring",
    ],
  },
  budget: {
    monthlyLimit: 10000,
    spent: 1580,
    adSpend: 1050,
    toolsAndServices: 380,
    vendorPayments: 150,
    currency: "USD",
  },
  integrations: {
    shopify: { connected: true, store: "freshroast.coffee" },
    klaviyo: { connected: true },
    google_analytics: { connected: true, propertyId: "G-XXXXXXXXXX" },
    meta_ads: { connected: true },
    google_ads: { connected: true },
    slack: { connected: false },
  },
};

// -- Onboarding Responses ----------------------------------------------------

const ONBOARD_SUCCESS = {
  success: true,
  message: "Onboarding data received. Your AI team is being assembled.",
  companyId: "company-freshroast",
};

const GENERATED_GOALS = {
  success: true,
  goals: [
    {
      id: "goal-1",
      title: "Acquire First 100 Subscribers",
      description:
        "Reach 100 active subscription customers within 30 days of launch through a combination of paid ads, influencer marketing, and organic content.",
      metric: "active_subscribers",
      target: 100,
      timeframe: "30 days",
    },
    {
      id: "goal-2",
      title: "Achieve $5,000 MRR",
      description:
        "Generate $5,000 in monthly recurring revenue from subscriptions by end of Month 1.",
      metric: "mrr",
      target: 5000,
      timeframe: "30 days",
    },
    {
      id: "goal-3",
      title: "Build Brand Presence",
      description:
        "Establish FreshRoast Coffee as a recognized brand in the specialty coffee subscription space with 2,000+ social followers and 500+ email subscribers.",
      metric: "brand_awareness",
      target: 2000,
      timeframe: "30 days",
    },
    {
      id: "goal-4",
      title: "Optimize Unit Economics",
      description:
        "Achieve a blended CAC under $25 and projected 6-month LTV above $90, ensuring sustainable growth.",
      metric: "cac_ltv_ratio",
      target: 3.6,
      timeframe: "30 days",
    },
  ],
  plan: COMPANY_PLAN,
};

const GENERATED_PLAN = {
  success: true,
  plan: COMPANY_PLAN,
};

// ── Route Handlers ─────────────────────────────────────────────────────────

type RouteHandler = (req: NextRequest, params?: RegExpMatchArray | null) => NextResponse | Response;

const routes: Array<{ pattern: RegExp; method: string; handler: RouteHandler }> = [
  // Company
  {
    pattern: /^\/api\/company\/plan\/?$/,
    method: "GET",
    handler: () => json(COMPANY_PLAN),
  },
  {
    pattern: /^\/api\/company\/?$/,
    method: "GET",
    handler: () => json(COMPANY),
  },

  // Agents
  {
    pattern: /^\/api\/agents\/([a-z_-]+)\/?$/,
    method: "GET",
    handler: (_req, match) => {
      const role = match?.[1];
      const agent = AGENTS.find((a) => a.role === role || a.id === `agent-${role}`);
      if (!agent) return json({ error: "Agent not found" }, 404);
      return json(agent);
    },
  },
  {
    pattern: /^\/api\/agents\/?$/,
    method: "GET",
    handler: () => json(AGENTS),
  },

  // Tasks
  {
    pattern: /^\/api\/tasks\/?$/,
    method: "GET",
    handler: () => json(TASKS),
  },

  // Chat
  {
    pattern: /^\/api\/chat\/?$/,
    method: "GET",
    handler: () => json({ messages: CHAT_MESSAGES }),
  },
  {
    pattern: /^\/api\/chat\/?$/,
    method: "POST",
    handler: () =>
      json({
        success: true,
        message: {
          id: `msg-demo-${Date.now()}`,
          role: "assistant",
          agentRole: "ceo",
          content:
            "Thanks for the message! In demo mode, the CEO agent can't generate live responses — but in production, I'd analyze your request and coordinate with the team to act on it.",
          timestamp: new Date().toISOString(),
        },
      }),
  },

  // Activity
  {
    pattern: /^\/api\/activity\/?$/,
    method: "GET",
    handler: () => json(ACTIVITY),
  },

  // SSE Stream
  {
    pattern: /^\/api\/stream\/?$/,
    method: "GET",
    handler: () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send a connected event, then hold the stream open.
          const event = `event: connected\ndata: ${JSON.stringify({
            status: "connected",
            mode: "demo",
            timestamp: new Date().toISOString(),
          })}\n\n`;
          controller.enqueue(encoder.encode(event));

          // Send a heartbeat comment every 30 s to keep the connection alive.
          // In the edge runtime setInterval is available.
          const heartbeat = setInterval(() => {
            try {
              controller.enqueue(encoder.encode(": heartbeat\n\n"));
            } catch {
              clearInterval(heartbeat);
            }
          }, 30_000);
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    },
  },

  // Settings
  {
    pattern: /^\/api\/settings\/?$/,
    method: "GET",
    handler: () => json(SETTINGS),
  },

  // Onboarding
  {
    pattern: /^\/api\/onboard\/generate-goals\/?$/,
    method: "POST",
    handler: () => json(GENERATED_GOALS),
  },
  {
    pattern: /^\/api\/onboard\/generate-plan\/?$/,
    method: "POST",
    handler: () => json(GENERATED_PLAN),
  },
  {
    pattern: /^\/api\/onboard\/?$/,
    method: "POST",
    handler: () => json(ONBOARD_SUCCESS),
  },
];

// ── Middleware Entry Point ──────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  // Only intercept API routes, and only in demo mode.
  if (!DEMO || !request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const method = request.method;

  for (const route of routes) {
    if (route.method !== method) continue;
    const match = pathname.match(route.pattern);
    if (match) {
      return route.handler(request, match);
    }
  }

  // Fallback: any unmatched POST returns generic success.
  if (method === "POST") {
    return json({ success: true, message: "OK (demo mode)" });
  }

  // Fallback: any unmatched GET returns 404.
  return json(
    { error: "Not found", demo: true, path: pathname },
    404,
  );
}

export const config = {
  matcher: "/api/:path*",
};
