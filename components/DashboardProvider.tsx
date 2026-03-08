"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface Company {
  name: string;
  industry: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "planned" | "pending";
  assignee: string;
  assigneeRole: string;
  week: number;
  startDate: string;
  endDate: string;
  outcome?: string;
}

export interface ActivityItem {
  id: string;
  agent: string;
  role: string;
  message: string;
  type: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "paused";
  model: string;
}

interface DashboardContextValue {
  company: Company | null;
  tasks: Task[];
  activity: ActivityItem[];
  agents: Agent[];
  loading: boolean;
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextValue>({
  company: null,
  tasks: [],
  activity: [],
  agents: [],
  loading: true,
  refresh: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [companyRes, tasksRes, activityRes, agentsRes] = await Promise.all([
        fetch("/api/company").then((r) => r.json()).catch(() => null),
        fetch("/api/tasks").then((r) => r.json()).catch(() => []),
        fetch("/api/activity").then((r) => r.json()).catch(() => []),
        fetch("/api/agents").then((r) => r.json()).catch(() => []),
      ]);
      if (companyRes) setCompany(companyRes);
      if (Array.isArray(tasksRes)) setTasks(tasksRes);
      if (Array.isArray(activityRes)) setActivity(activityRes);
      if (Array.isArray(agentsRes)) setAgents(agentsRes);
    } catch {
      // silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <DashboardContext.Provider
      value={{ company, tasks, activity, agents, loading, refresh: fetchData }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
