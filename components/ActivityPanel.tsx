"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/utils";
import { useDashboard } from "@/components/DashboardProvider";

const AGENT_COLORS: Record<string, string> = {
  CEO: "#7c3aed",
  Marketing: "#d97706",
  Sales: "#16a34a",
  Operations: "#0ea5e9",
  Engineering: "#4f46e5",
  Content: "#ea580c",
  Analytics: "#059669",
};

function agentColor(role: string): string {
  return AGENT_COLORS[role] || "#86868b";
}

export default function ActivityPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const { activity } = useDashboard();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activity]);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-start w-[48px] min-w-[48px] h-screen bg-white border-l border-[#e5e5e7] py-4">
        <button
          onClick={() => setCollapsed(false)}
          className="btn btn-ghost p-2 rounded-lg"
          aria-label="Expand activity panel"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    );
  }

  return (
    <aside className="flex flex-col w-[320px] min-w-[320px] h-screen bg-white border-l border-[#e5e5e7] animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="status-dot status-dot-green status-dot-pulse" />
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">
            Live Activity
          </h2>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="btn btn-ghost p-2 rounded-lg"
          aria-label="Collapse activity panel"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="divider mx-5" />

      {/* Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {activity.length === 0 ? (
          <div className="empty-state">
            <p>No activity yet</p>
          </div>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="flex gap-3 animate-fade-in">
              <div
                className="status-dot mt-1.5 flex-shrink-0"
                style={{ background: agentColor(item.role) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
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
          ))
        )}
      </div>
    </aside>
  );
}
