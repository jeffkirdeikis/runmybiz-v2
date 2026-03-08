"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { cn } from "@/lib/utils";

const AGENT_COLORS: Record<string, string> = {
  CEO: "#7c3aed",
  Marketing: "#d97706",
  Sales: "#16a34a",
  Operations: "#0ea5e9",
  Engineering: "#4f46e5",
  Content: "#ea580c",
  Analytics: "#059669",
};

const AUTONOMY_LABELS: Record<number, string> = {
  1: "Ask before everything",
  2: "Ask for big decisions",
  3: "Execute, report after",
  4: "Full autonomy",
};

export default function SettingsPage() {
  const { company, agents, loading } = useDashboard();
  const [notifications, setNotifications] = useState(true);
  const [autonomy, setAutonomy] = useState(3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#86868b] text-[15px]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[720px] animate-fade-in-up">
      <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] mb-8">
        Settings
      </h1>

      {/* Company Info */}
      <section className="mb-8">
        <h2 className="text-[16px] font-semibold text-[#1d1d1f] mb-4">
          Company Info
        </h2>
        <div className="card p-5 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-1">
              Company Name
            </label>
            <p className="text-[15px] text-[#1d1d1f] font-medium">
              {company?.name || "---"}
            </p>
          </div>
          <div className="divider" />
          <div>
            <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-wide mb-1">
              Industry
            </label>
            <p className="text-[15px] text-[#1d1d1f] font-medium">
              {company?.industry || "---"}
            </p>
          </div>
        </div>
      </section>

      {/* Agent Team */}
      <section className="mb-8">
        <h2 className="text-[16px] font-semibold text-[#1d1d1f] mb-4">
          Agent Team
        </h2>
        <div className="card divide-y divide-[#e5e5e7]">
          {agents.length === 0 ? (
            <div className="empty-state">
              <p>No agents configured</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-4 p-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
                  style={{
                    background: AGENT_COLORS[agent.role] || "#86868b",
                  }}
                >
                  {agent.role.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#1d1d1f]">
                    {agent.name}
                  </p>
                  <p className="text-[12px] text-[#86868b]">{agent.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-gray text-[10px]">
                    {agent.model}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "status-dot",
                        agent.status === "active" && "status-dot-green",
                        agent.status === "idle" && "status-dot-yellow",
                        agent.status === "paused" && "status-dot-gray"
                      )}
                    />
                    <span className="text-[12px] text-[#86868b] capitalize">
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-8">
        <h2 className="text-[16px] font-semibold text-[#1d1d1f] mb-4">
          Preferences
        </h2>
        <div className="card p-5 space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#1d1d1f]">
                Notifications
              </p>
              <p className="text-[13px] text-[#86868b]">
                Get notified when agents complete tasks
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "relative w-[44px] h-[24px] rounded-full transition-colors duration-200",
                notifications ? "bg-[#0071e3]" : "bg-[#e5e5e7]"
              )}
              aria-label="Toggle notifications"
            >
              <span
                className={cn(
                  "absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-200",
                  notifications ? "translate-x-[22px]" : "translate-x-[2px]"
                )}
              />
            </button>
          </div>

          <div className="divider" />

          {/* Autonomy */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[14px] font-medium text-[#1d1d1f]">
                  Autonomy Level
                </p>
                <p className="text-[13px] text-[#86868b]">
                  How much freedom your AI team has
                </p>
              </div>
              <span className="badge badge-blue">{AUTONOMY_LABELS[autonomy]}</span>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={autonomy}
              onChange={(e) => setAutonomy(Number(e.target.value))}
              className="w-full accent-[#0071e3]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-[#86868b]">Conservative</span>
              <span className="text-[11px] text-[#86868b]">Autonomous</span>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-[16px] font-semibold text-[#ff3b30] mb-4">
          Danger Zone
        </h2>
        <div className="card p-5 border-[rgba(255,59,48,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-medium text-[#1d1d1f]">
                Pause AI Team
              </p>
              <p className="text-[13px] text-[#86868b]">
                Stop all agents from taking actions
              </p>
            </div>
            <button className="btn btn-danger">Pause AI Team</button>
          </div>
          <div className="divider" />
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-[14px] font-medium text-[#1d1d1f]">
                Reset Plan
              </p>
              <p className="text-[13px] text-[#86868b]">
                Delete the current 30-day plan and start over
              </p>
            </div>
            <button className="btn btn-danger">Reset Plan</button>
          </div>
        </div>
      </section>
    </div>
  );
}
