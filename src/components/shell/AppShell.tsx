import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[232px_1fr] min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex flex-col">
        <Topbar />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
