import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Toaster } from "sonner";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>
      <MobileNav />
      <Toaster position="top-right" richColors />
    </div>
  );
}
