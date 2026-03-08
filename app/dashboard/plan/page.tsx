"use client";

import { useState } from "react";
import { Pencil, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard, type Task } from "@/components/DashboardProvider";

const STATUS_DOT: Record<string, string> = {
  completed: "status-dot-green",
  in_progress: "status-dot-blue",
  planned: "status-dot-gray",
  pending: "status-dot-yellow",
};

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
  pending: "Pending",
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

const WEEKS = [1, 2, 3, 4];

export default function PlanPage() {
  const { tasks, loading } = useDashboard();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#86868b] text-[15px]">Loading...</div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Determine current week
  const currentWeek =
    tasks
      .filter((t) => t.status === "in_progress")
      .reduce((max, t) => Math.max(max, t.week), 0) || 1;

  const weekTasks = tasks.filter((t) => t.week === selectedWeek);

  function openEdit(task: Task) {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditingTask(task);
  }

  function closeEdit() {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
  }

  function saveEdit() {
    // In a real app this would POST to the API
    closeEdit();
  }

  function formatDateRange(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}`;
  }

  return (
    <div className="p-8 max-w-[960px] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
            Your 30-Day Plan
          </h1>
          <p className="text-[15px] text-[#86868b] mt-1">
            Week {currentWeek} of 4
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-[#86868b]">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="progress-bar mb-8">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Week tabs */}
      <div className="flex items-center gap-2 mb-6">
        {WEEKS.map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={cn(
              "pill",
              selectedWeek === week && "pill-active"
            )}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {weekTasks.length === 0 ? (
        <div className="empty-state card">
          <h3>No tasks for Week {selectedWeek}</h3>
          <p>Tasks will appear here as your AI team plans them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {weekTasks.map((task) => (
            <div key={task.id} className="card card-hover p-5">
              <div className="flex items-start gap-4">
                <span
                  className={cn("status-dot mt-1.5", STATUS_DOT[task.status])}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                      {task.title}
                    </h3>
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
                  </div>
                  <p className="text-[13px] text-[#86868b] leading-relaxed line-clamp-2 mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#86868b]">
                      {formatDateRange(task.startDate, task.endDate)}
                    </span>
                    <span
                      className={cn(
                        "badge",
                        task.status === "completed" && "badge-green",
                        task.status === "in_progress" && "badge-blue",
                        task.status === "planned" && "badge-gray",
                        task.status === "pending" && "badge-yellow"
                      )}
                    >
                      {STATUS_LABEL[task.status]}
                    </span>
                  </div>
                  {task.status === "completed" && task.outcome && (
                    <p className="text-[13px] text-[#34c759] mt-2">
                      {task.outcome}
                    </p>
                  )}
                </div>
                {(task.status === "planned" || task.status === "in_progress") && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="btn btn-ghost p-2"
                      aria-label="Edit task"
                    >
                      <Pencil size={14} />
                    </button>
                    <button className="btn btn-ghost p-2" aria-label="Cancel task">
                      <XIcon size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 animate-fade-in"
          onClick={closeEdit}
        >
          <div
            className="card p-6 w-[480px] max-w-[90vw] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-4">
              Edit Task
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1f] mb-1.5">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="input"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={closeEdit} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={saveEdit} className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
