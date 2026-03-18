import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Users, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { StatCard } from "../components/StatCard";
import { dashboardApi } from "../services";
import type { DashboardData } from "../data/mockData";
import { format, parseISO } from "date-fns";
import { Link } from "react-router";

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-red-500">Não foi possível carregar os dados. Verifique se o servidor está rodando.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground text-[0.85rem]">Visão geral financeira da academia</p>
        </div>
        {data.unreadNotifs > 0 && (
          <Link
            to="/notificacoes"
            className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-2 rounded-lg text-[0.8rem] hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle size={16} />
            {data.unreadNotifs} alerta{data.unreadNotifs > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Receita Total"    value={fmt(data.totalReceita)}  icon={TrendingUp}   trend="+12% vs mês anterior" trendUp  color="bg-emerald-600" />
        <StatCard title="Despesas Total"   value={fmt(data.totalDespesas)} icon={TrendingDown}  trend="+3% vs mês anterior"  trendUp={false} color="bg-red-500" />
        <StatCard title="Saldo Líquido"    value={fmt(data.saldo)}          icon={DollarSign}   color={data.saldo >= 0 ? "bg-blue-600" : "bg-red-600"} />
        <StatCard
          title="Clientes Ativos"
          value={String(data.clientesAtivos)}
          icon={Users}
          trend={`${data.inadimplentes} inadimplente${data.inadimplentes !== 1 ? "s" : ""}`}
          trendUp={false}
          color="bg-violet-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="mb-4">Receita vs Despesas</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyRevenue}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
              <Bar dataKey="despesa" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="mb-4">Receita por Modalidade</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.revenueByModality} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={3}>
                {data.revenueByModality.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions & Late Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3>Últimas Transações</h3>
            <Link to="/recebimentos" className="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors">Ver todas →</Link>
          </div>
          <div className="space-y-3">
            {data.recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${t.type === "entrada" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div>
                    <p className="text-[0.85rem]">{t.description}</p>
                    <p className="text-[0.75rem] text-muted-foreground">{t.category}</p>
                  </div>
                </div>
                <span className={`text-[0.85rem] ${t.type === "entrada" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "entrada" ? "+" : "-"}{fmt(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-500 flex items-center gap-2">
              <AlertTriangle size={18} />
              Pagamentos Atrasados
            </h3>
            <Link to="/clientes" className="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors">Ver clientes →</Link>
          </div>
          <div className="space-y-3">
            {data.overdueClients.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-[0.85rem]">{c.name}</p>
                  <p className="text-[0.75rem] text-muted-foreground">
                    {c.planName} — Venceu em {format(parseISO(c.nextPaymentDate), "dd/MM/yyyy")}
                  </p>
                </div>
                <span className="text-[0.8rem] bg-red-50 text-red-600 px-2 py-1 rounded-md">
                  {fmt(c.planPrice)}
                </span>
              </div>
            ))}
            {data.overdueClients.length === 0 && (
              <p className="text-center text-muted-foreground py-4 text-[0.85rem]">Nenhum atraso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
