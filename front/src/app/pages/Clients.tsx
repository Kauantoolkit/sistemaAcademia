import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { format, parseISO, differenceInDays } from "date-fns";
import { Search, Plus, X, AlertTriangle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { clientsApi, plansApi } from "../services";
import type { Client, Plan } from "../data/mockData";

const statusLabels: Record<Client["status"], string> = {
  em_dia: "Em dia",
  atrasado: "Atrasado",
  cancelado: "Cancelado",
};

const statusColors: Record<Client["status"], string> = {
  em_dia: "bg-emerald-50 text-emerald-700",
  atrasado: "bg-red-50 text-red-600",
  cancelado: "bg-gray-100 text-gray-500",
};

const emptyForm = { name: "", email: "", phone: "", planId: "" };

export function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | Client["status"]>("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([clientsApi.list(), plansApi.list()])
      .then(([c, p]) => { setClients(c); setPlans(p); })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const filtered = clients
    .filter((c) => filterStatus === "todos" || c.status === filterStatus)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

  const activePlans = plans.filter((p) => p.active);
  const atrasados = clients.filter((c) => c.status === "atrasado").length;
  const ativos = clients.filter((c) => c.status !== "cancelado").length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.planId) {
      toast.error("Preencha nome, email e plano");
      return;
    }
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const newClient = await clientsApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        planId: form.planId,
        startDate: today,
        nextPaymentDate: today,
        status: "em_dia",
      });
      setClients([newClient, ...clients]);
      setShowForm(false);
      setForm(emptyForm);
      toast.success("Cliente adicionado!");
    } catch {
      toast.error("Erro ao salvar cliente");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1>Clientes</h1>
          <p className="text-muted-foreground text-[0.85rem]">
            {ativos} ativos
            {atrasados > 0 && (
              <> · <span className="text-red-500">{atrasados} inadimplente{atrasados > 1 ? "s" : ""}</span></>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancelar" : "Novo Cliente"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-card border border-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Nome</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@email.com" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Telefone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Plano</label>
            <select value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background">
              <option value="">Selecione...</option>
              {activePlans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60">
              {saving ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-input-background rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-[400px]">
          <Search size={16} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente..." className="bg-transparent flex-1 outline-none" />
        </div>
        <div className="flex gap-1 bg-input-background rounded-lg p-1">
          {(["todos", "em_dia", "atrasado", "cancelado"] as const).map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 rounded-md text-[0.8rem] transition-colors cursor-pointer ${filterStatus === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {f === "todos" ? "Todos" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Cliente</th>
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground hidden md:table-cell">Plano</th>
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground hidden sm:table-cell">Próx. vencimento</th>
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-[0.8rem] text-muted-foreground">Perfil</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const plan = plans.find((p) => p.id === c.planId);
                const daysLate = c.status === "atrasado" ? differenceInDays(new Date(), parseISO(c.nextPaymentDate)) : 0;
                return (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[0.85rem]">{c.name}</p>
                      <p className="text-[0.75rem] text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[0.8rem] text-muted-foreground hidden md:table-cell">{plan?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-[0.8rem] hidden sm:table-cell">
                      <span className={c.status === "atrasado" ? "text-red-500" : "text-muted-foreground"}>
                        {format(parseISO(c.nextPaymentDate), "dd/MM/yyyy")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[0.7rem] px-2 py-0.5 rounded-full w-fit ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                        {c.status === "atrasado" && (
                          <span className="flex items-center gap-1 text-red-500 text-[0.7rem]">
                            <AlertTriangle size={11} />{daysLate} dia{daysLate !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => navigate(`/clientes/${c.id}`)} className="flex items-center gap-1 ml-auto text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        Ver perfil <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-[0.85rem]">Nenhum cliente encontrado.</p>
        )}
      </div>
    </div>
  );
}
