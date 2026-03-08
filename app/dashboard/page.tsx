"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Pencil, X } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const STATUS_DOT: Record<string, string> = {
  completed: "status-dot-green",
  in_progress: "status-dot-blue",
  planned: "status-dot-gray",
  pending: "status-dot-yellow",
};

const AGENT_COLORS: Record<string, string> = {
  CEO: "#7c3aed",
  Marketing: "#d97706",
  Sales: "#16a34a",
  Operations: "#0ea5e9",
  Engineering: "#4f46e5",
  Content: "#ea580c",
  Analytics: "#059669",
};

function CircularProgress({ value, size = 64 }: { value: number; size?: number }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f5f5f7"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0071e3"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[15px] font-semibold text-[#1d1d1f]">{value}</span>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { company, tasks, activity, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#86868b] text-[15px]">Loading...</div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;

  // Determine current week (find the highest week with in_progress tasks, default to 1)
  const currentWeek =
    tasks
      .filter((t) => t.status === "in_progress")
      .reduce((max, t) => Math.max(max, t.week), 0) || 1;

  const thisWeekTasks = tasks.filter((t) => t.week === currentWeek);
  const recentActivity = activity.slice(-5).reverse();

  return (
    <div className="p-8 max-w-[960px] animate-fade-in-up">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
          {getGreeting()}, {company?.name || "there"}
        </h1>
        <p className="text-[15px] text-[#86868b] mt-1">{formatDate()}</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* Tasks Completed */}
        <div className="card p-5">
          <p className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-3">
            Tasks Completed
          </p>
          <p className="text-[24px] font-semibold text-[#1d1d1f]">
            {completedTasks}
            <span className="text-[16px] text-[#86868b] font-normal">
              /{totalTasks}
            </span>
          </p>
          <div className="progress-bar mt-3">
            <div
              className="progress-bar-fill"
              style={{
                width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* Active Agents */}
        <div className="card p-5">
          <p className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-3">
            Active Agents
          </p>
          <p className="text-[24px] font-semibold text-[#1d1d1f]">7</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="status-dot status-dot-green status-dot-pulse" />
            <span className="text-[12px] text-[#86868b]">All systems go</span>
          </div>
        </div>

        {/* This Week's Focus */}
        <div className="card p-5">
          <p className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-3">
            This Week&apos;s Focus
          </p>
          <p className="text-[16px] font-semibold text-[#1d1d1f] leading-snug">
            Week {currentWeek}: Content &amp; Email
          </p>
        </div>

        {/* Health Score */}
        <div className="card p-5 flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-3">
              Health Score
            </p>
            <p className="text-[12px] text-[#86868b]">out of 100</p>
          </div>
          <CircularProgress value={85} />
        </div>
      </div>

      {/* This Week's Plan */}
      <section className="mb-8">
        <h2 className="text-[18px] font-semibold text-[#1d1d1f] mb-4">
          This Week&apos;s Plan
        </h2>
        {thisWeekTasks.length === 0 ? (
          <div className="empty-state card">
            <h3>No tasks this week</h3>
            <p>Your AI team is planning the next steps.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {thisWeekTasks.map((task) => (
              <div key={task.id} className="card card-hover p-4 flex items-center gap-4">
                <span className={cn("status-dot", STATUS_DOT[task.status])} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1d1d1f]">
                    {task.title}
                  </p>
                  {task.status === "completed" && task.outcome && (
                    <p className="text-[12px] text-[#86868b] mt-0.5 truncate">
                      {task.outcome}
                    </p>
                  )}
                </div>
                <span
                  className="badge"
                  style={{
                    background: `${AGENT_COLORS[task.assigneeRole] || "#86868b"}14`,
                    color: AGENT_COLORS[task.assigneeRole] || "#86868b",
                  }}
                >
                  <span
                    className="status-dot"
                    style={{
                      width: 6,
                      height: 6,
                      background: AGENT_COLORS[task.assigneeRole] || "#86868b",
                    }}
                  />
                  {task.assignee}
                </span>
                {(task.status === "planned" || task.status === "in_progress") && (
                  <div className="flex items-center gap-1">
                    <button className="btn btn-ghost p-1.5" aria-label="Edit task">
                      <Pencil size={14} />
                    </button>
                    <button className="btn btn-ghost p-1.5" aria-label="Cancel task">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-[18px] font-semibold text-[#1d1d1f] mb-4">
          Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <div className="empty-state card">
            <h3>No recent activity</h3>
            <p>Your AI team will start reporting here soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-1">
                <div
                  className="status-dot mt-1.5"
                  style={{ background: AGENT_COLORS[item.role] || "#86868b" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#1d1d1f]">
                      {item.agent}
                    </span>
                    <span className="text-[11px] text-[#86868b]">
                      {relativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#86868b] leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
