import { useEffect, useState } from "react";
import { Plus, X, Edit2, ToggleLeft, ToggleRight, Users } from "lucide-react";
import { toast } from "sonner";
import { plansApi } from "../services";
import type { Plan } from "../data/mockData";

const emptyForm = { name: "", modality: "", price: "", duration: "1" };

export function Plans() {
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    plansApi.list()
      .then(setPlanList)
      .catch(() => toast.error("Erro ao carregar planos"))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const modalities = [...new Set(planList.map((p) => p.modality))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.modality || !form.price) { toast.error("Preencha todos os campos"); return; }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await plansApi.update(editingId, { name: form.name, modality: form.modality, price: parseFloat(form.price), duration: parseInt(form.duration) });
        setPlanList(planList.map((p) => (p.id === editingId ? updated : p)));
        toast.success("Plano atualizado!");
      } else {
        const created = await plansApi.create({ name: form.name, modality: form.modality, price: parseFloat(form.price), duration: parseInt(form.duration), active: true });
        setPlanList([...planList, created]);
        toast.success("Plano criado!");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch { toast.error("Erro ao salvar plano"); }
    finally { setSaving(false); }
  };

  const toggleActive = async (plan: Plan) => {
    try {
      const updated = await plansApi.update(plan.id, { active: !plan.active });
      setPlanList(planList.map((p) => (p.id === plan.id ? updated : p)));
    } catch { toast.error("Erro ao atualizar plano"); }
  };

  const startEdit = (plan: Plan) => {
    setForm({ name: plan.name, modality: plan.modality, price: String(plan.price), duration: String(plan.duration) });
    setEditingId(plan.id);
    setShowForm(true);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1>Planos & Modalidades</h1>
          <p className="text-muted-foreground text-[0.85rem]">{planList.length} planos cadastrados</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancelar" : "Novo Plano"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Nome do Plano</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Musculação Mensal" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Modalidade</label>
            <input value={form.modality} onChange={(e) => setForm({ ...form, modality: e.target.value })} list="modalities" placeholder="Ex: Musculação" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
            <datalist id="modalities">{modalities.map((m) => <option key={m} value={m} />)}</datalist>
          </div>
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Preço (R$)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <div>
            <label className="text-[0.8rem] text-muted-foreground block mb-1">Duração (meses)</label>
            <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background">
              {[1, 3, 6, 12].map((d) => <option key={d} value={d}>{d} {d === 1 ? "mês" : "meses"}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60">
              {saving ? "Salvando..." : editingId ? "Atualizar" : "Criar Plano"}
            </button>
          </div>
        </form>
      )}

      {modalities.map((mod) => (
        <div key={mod}>
          <h3 className="mb-3 text-muted-foreground">{mod}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planList.filter((p) => p.modality === mod).map((plan) => (
              <div key={plan.id} className={`bg-card border rounded-xl p-5 transition-all ${plan.active ? "border-border" : "border-border opacity-60"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4>{plan.name}</h4>
                    <p className="text-[0.8rem] text-muted-foreground">{plan.duration} {plan.duration === 1 ? "mês" : "meses"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(plan)} className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <Edit2 size={14} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => toggleActive(plan)} className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      {plan.active ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} className="text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <p className="text-[1.5rem] mb-2">{fmt(plan.price)}</p>
                {plan.duration > 1 && (
                  <p className="text-[0.75rem] text-muted-foreground mb-3">{fmt(plan.price / plan.duration)}/mês</p>
                )}
                <div className="flex items-center gap-1 text-[0.8rem] text-muted-foreground">
                  <Users size={14} />
                  {plan.clientCount ?? 0} aluno{(plan.clientCount ?? 0) !== 1 ? "s" : ""}
                </div>
                {!plan.active && <p className="text-[0.7rem] text-amber-600 mt-2">Plano desativado</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
