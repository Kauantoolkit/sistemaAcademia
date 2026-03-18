import { NavLink } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  Bell,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/recebimentos", icon: TrendingUp, label: "Entradas" },
  { to: "/despesas", icon: TrendingDown, label: "Despesas" },
  { to: "/clientes", icon: Users, label: "Clientes" },
  { to: "/notificacoes", icon: Bell, label: "Alertas" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground z-50 border-t border-white/10">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[0.65rem] transition-colors ${
                isActive ? "text-white" : "text-white/50"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
