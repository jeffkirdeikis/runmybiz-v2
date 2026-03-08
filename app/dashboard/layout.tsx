"use client";

import { DashboardProvider } from "@/components/DashboardProvider";
import Sidebar from "@/components/Sidebar";
import ActivityPanel from "@/components/ActivityPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-[#fbfbfd]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <ActivityPanel />
      </div>
    </DashboardProvider>
  );
}
