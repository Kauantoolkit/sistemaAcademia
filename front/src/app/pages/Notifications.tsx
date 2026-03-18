import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Info, CheckCheck, Bell } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { notificationsApi } from "../services";
import type { Notification } from "../data/mockData";

const typeConfig: Record<Notification["type"], { icon: typeof AlertTriangle; color: string; bg: string; label: string }> = {
  atrasado: { icon: AlertTriangle, color: "text-red-500",   bg: "bg-red-50",   label: "Atrasado" },
  vencendo: { icon: Clock,         color: "text-amber-500", bg: "bg-amber-50", label: "Vencendo" },
  info:     { icon: Info,          color: "text-blue-500",  bg: "bg-blue-50",  label: "Info"     },
};

export function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | Notification["type"]>("todos");

  useEffect(() => {
    notificationsApi.list()
      .then(setNotifs)
      .catch(() => toast.error("Erro ao carregar notificações"))
      .finally(() => setLoading(false));
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    try {
      const updated = await notificationsApi.markRead(id);
      setNotifs(notifs.map((n) => (n.id === id ? updated : n)));
    } catch { toast.error("Erro ao atualizar notificação"); }
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifs(notifs.map((n) => ({ ...n, read: true })));
    } catch { toast.error("Erro ao atualizar notificações"); }
  };

  const filtered = notifs
    .filter((n) => filter === "todos" || n.type === filter)
    .sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return b.date.localeCompare(a.date);
    });

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2"><Bell size={24} />Notificações</h1>
          <p className="text-muted-foreground text-[0.85rem]">
            {unread > 0 ? `${unread} não lida${unread > 1 ? "s" : ""}` : "Todas lidas"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-[0.85rem] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <CheckCheck size={16} />Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-input-background rounded-lg p-1 w-fit">
        {(["todos", "atrasado", "vencendo", "info"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-[0.8rem] transition-colors cursor-pointer ${filter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            {f === "todos" ? "Todas" : typeConfig[f].label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((n) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${n.read ? "bg-card border-border opacity-70" : `${cfg.bg} border-border shadow-sm cursor-pointer`}`}
            >
              <div className={`p-2 rounded-lg ${n.read ? "bg-muted" : cfg.bg}`}>
                <Icon size={18} className={n.read ? "text-muted-foreground" : cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[0.85rem] ${n.read ? "text-muted-foreground" : ""}`}>{n.message}</p>
                <p className="text-[0.75rem] text-muted-foreground mt-1">{format(parseISO(n.date), "dd/MM/yyyy")}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12 text-[0.85rem]">Nenhuma notificação.</p>}
      </div>
    </div>
  );
}
