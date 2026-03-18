import { NavLink } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Bell,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/recebimentos", icon: TrendingUp, label: "Recebimentos" },
  { to: "/despesas", icon: TrendingDown, label: "Despesas" },
  { to: "/clientes", icon: Users, label: "Clientes" },
  { to: "/planos", icon: CreditCard, label: "Planos" },
  { to: "/notificacoes", icon: Bell, label: "Notificações" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col bg-primary text-primary-foreground transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[250px]"
      }`}
    >
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <Dumbbell className="shrink-0" size={28} />
        {!collapsed && <span className="text-[1.125rem]">GymFinance</span>}
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
}
