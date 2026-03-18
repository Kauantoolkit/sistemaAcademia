import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Plus, Search, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { transactionsApi } from "../services";
import type { Transaction } from "../data/mockData";

const saidaCategories = ["Aluguel", "Salários", "Energia Elétrica", "Água", "Internet", "Manutenção Equipamentos", "Material de Limpeza", "Marketing", "Impostos", "Equipamentos Novos", "Outros"];

const emptyForm = { category: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] };

export function Despesas() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("todas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    transactionsApi.despesas()
      .then(setItems)
      .catch(() => toast.error("Erro ao carregar despesas"))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["todas", ...Array.from(new Set(items.map((t) => t.category)))];

  const filtered = items
    .filter((t) => filterCategory === "todas" || t.category === filterCategory)
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = items.reduce((s, t) => s + t.amount, 0);
  const totalFiltered = filtered.reduce((s, t) => s + t.amount, 0);
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.description || !form.amount) { toast.error("Preencha todos os campos"); return; }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await transactionsApi.update(editingId, { category: form.category, description: form.description, amount: parseFloat(form.amount), date: form.date });
        setItems(items.map((t) => (t.id === editingId ? updated : t)));
        toast.success("Despesa atualizada!");
      } else {
        const created = await transactionsApi.create({ type: "saida", category: form.category, description: form.description, amount: parseFloat(form.amount), date: form.date });
        setItems([created, ...items]);
        toast.success("Despesa registrada!");
      }
      handleCancel();
    } catch { toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  };

  const handleEdit = (t: Transaction) => { setForm({ category: t.category, description: t.description, amount: String(t.amount), date: t.date }); setEditingId(t.id); setShowForm(true); };

  const handleDelete = async (id: string) => {
    try { await transactionsApi.remove(id); setItems(items.filter((t) => t.id !== id)); toast.success("Despesa removida!"); }
    catch { toast.error("Erro ao remover"); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1>Despesas</h1>
          <p className="text-muted-foreground text-[0.85rem]">Controle de saídas operacionais</p>
        </div>
        <button onClick={() => (showForm ? handleCancel() : setShowForm(true))} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancelar" : "Nova Despesa"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-[0.9rem]">{editingId ? "Editar Despesa" : "Nova Despesa"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[0.8rem] text-muted-foreground block mb-1">Categoria</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background">
                <option value="">Selecione...</option>
                {saidaCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="text-[0.8rem] text-muted-foreground block mb-1">Descrição</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Conta de luz - Março" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
            </div>
            <div>
              <label className="text-[0.8rem] text-muted-foreground block mb-1">Valor (R$)</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
            </div>
            <div>
              <label className="text-[0.8rem] text-muted-foreground block mb-1">Data</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60">
              {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-[0.8rem] text-red-600">Total de Despesas</p>
          <p className="text-[1.5rem] text-red-600">{fmt(total)}</p>
          <p className="text-[0.75rem] text-red-500">{items.length} lançamentos</p>
        </div>
        {filterCategory !== "todas" && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-[0.8rem] text-orange-700">{filterCategory}</p>
            <p className="text-[1.5rem] text-orange-700">{fmt(totalFiltered)}</p>
            <p className="text-[0.75rem] text-orange-600">{filtered.length} lançamentos</p>
          </div>
        )}
        <div className={`flex items-center gap-2 bg-input-background border border-border rounded-xl px-4 ${filterCategory !== "todas" ? "" : "sm:col-span-2"}`}>
          <Search size={16} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar despesa..." className="bg-transparent flex-1 outline-none py-3" />
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1.5 rounded-lg text-[0.75rem] transition-colors cursor-pointer border ${filterCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
            {c === "todas" ? "Todas" : c}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Data</th>
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Categoria</th>
                <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Descrição</th>
                <th className="text-right px-4 py-3 text-[0.8rem] text-muted-foreground">Valor</th>
                <th className="text-right px-4 py-3 text-[0.8rem] text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-[0.8rem] text-muted-foreground whitespace-nowrap">{format(parseISO(t.date), "dd/MM/yyyy")}</td>
                  <td className="px-4 py-3"><span className="text-[0.75rem] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{t.category}</span></td>
                  <td className="px-4 py-3 text-[0.85rem]">{t.description}</td>
                  <td className="px-4 py-3 text-right text-[0.85rem] text-red-500">-{fmt(t.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(t)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Editar"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer" title="Excluir"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-[0.85rem]">Nenhuma despesa encontrada.</p>}
      </div>
    </div>
  );
}
