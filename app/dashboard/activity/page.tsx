"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/utils";
import { useDashboard, type ActivityItem } from "@/components/DashboardProvider";

const AGENT_COLORS: Record<string, string> = {
  CEO: "#7c3aed",
  Marketing: "#d97706",
  Sales: "#16a34a",
  Operations: "#0ea5e9",
  Engineering: "#4f46e5",
  Content: "#ea580c",
  Analytics: "#059669",
};

const FILTERS = [
  "All",
  "CEO",
  "Marketing",
  "Sales",
  "Operations",
  "Engineering",
];

function groupByDate(
  items: ActivityItem[]
): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {};
  for (const item of items) {
    const date = new Date(item.timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  }
  return groups;
}

export default function ActivityLogPage() {
  const { activity, loading } = useDashboard();
  const [filter, setFilter] = useState("All");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#86868b] text-[15px]">Loading...</div>
      </div>
    );
  }

  const filtered =
    filter === "All"
      ? activity
      : activity.filter((a) => a.role === filter);

  const grouped = groupByDate([...filtered].reverse());

  return (
    <div className="p-8 max-w-[960px] animate-fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
          Activity Log
        </h1>
        <p className="text-[15px] text-[#86868b] mt-1">
          Everything your AI team has been doing
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn("pill", filter === f && "pill-active")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state card">
          <h3>No activity yet</h3>
          <p>Your AI team&apos;s activity will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wide mb-4">
                {date}
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="card p-4 flex items-start gap-4">
                    <div
                      className="status-dot mt-1.5"
                      style={{ background: AGENT_COLORS[item.role] || "#86868b" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-[#1d1d1f]">
                          {item.agent}
                        </span>
                        <span
                          className="badge"
                          style={{
                            background: `${AGENT_COLORS[item.role] || "#86868b"}14`,
                            color: AGENT_COLORS[item.role] || "#86868b",
                          }}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#1d1d1f] leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                    <span className="text-[12px] text-[#86868b] flex-shrink-0 mt-0.5">
                      {relativeTime(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
