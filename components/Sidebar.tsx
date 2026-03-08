"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  CalendarCheck,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/components/DashboardProvider";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Chat with CEO", icon: MessageSquare, href: "/dashboard/chat" },
  { label: "My Plan", icon: CalendarCheck, href: "/dashboard/plan" },
  { label: "Activity Log", icon: Activity, href: "/dashboard/activity" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { company } = useDashboard();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex flex-col w-[260px] min-w-[260px] h-screen bg-white border-r border-[#e5e5e7]">
      {/* Brand */}
      <div className="px-6 pt-7 pb-2">
        <h1 className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">
          RunMyBiz
        </h1>
        <p className="text-[11px] font-medium text-[#86868b] tracking-wide uppercase mt-0.5">
          AI Business Operator
        </p>
      </div>

      {/* Company name */}
      {company && (
        <div className="px-6 py-3">
          <div className="text-[13px] font-medium text-[#1d1d1f] truncate">
            {company.name}
          </div>
        </div>
      )}

      <div className="divider mx-6" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 no-underline",
                active
                  ? "bg-[#f0f5ff] text-[#0071e3]"
                  : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="px-6 py-5 border-t border-[#e5e5e7]">
        <div className="flex items-center gap-2">
          <span className="status-dot status-dot-green status-dot-pulse" />
          <span className="text-[13px] font-medium text-[#1d1d1f]">
            AI Team: Active
          </span>
        </div>
      </div>
    </aside>
  );
}
