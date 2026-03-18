import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { format, parseISO, differenceInDays } from "date-fns";
import { ArrowLeft, Mail, Phone, Plus, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { clientsApi, paymentsApi } from "../services";
import type { Client, PaymentRecord } from "../data/mockData";

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

const recordStatusColors: Record<PaymentRecord["status"], string> = {
  pago: "bg-emerald-50 text-emerald-700",
  pendente: "bg-yellow-50 text-yellow-700",
  cancelado: "bg-gray-100 text-gray-500",
};

const recordStatusLabels: Record<PaymentRecord["status"], string> = {
  pago: "Pago",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

const paymentMethodLabels: Record<PaymentRecord["paymentMethod"], string> = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao: "Cartão",
  boleto: "Boleto",
};

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
  description: "",
  paymentMethod: "pix" as PaymentRecord["paymentMethod"],
  status: "pago" as PaymentRecord["status"],
};

export function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [recordForm, setRecordForm] = useState(emptyForm);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([clientsApi.get(id), paymentsApi.list(id)])
      .then(([c, r]) => { setClient(c); setRecords(r); })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecordId(null);
    setRecordForm(emptyForm);
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordForm.amount || !recordForm.description) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSaving(true);
    try {
      if (editingRecordId) {
        const updated = await paymentsApi.update(editingRecordId, {
          ...recordForm,
          amount: parseFloat(recordForm.amount),
        });
        setRecords(records.map((r) => (r.id === editingRecordId ? updated : r)));
        toast.success("Pagamento atualizado!");
      } else {
        const { record, client: updatedClient } = await paymentsApi.create(id!, {
          ...recordForm,
          amount: parseFloat(recordForm.amount),
        });
        setRecords([record, ...records]);
        setClient(updatedClient);
        toast.success("Pagamento registrado!");
      }
      handleCancel();
    } catch {
      toast.error("Erro ao salvar pagamento");
    } finally {
      setSaving(false);
    }
  };

  const handleEditRecord = (r: PaymentRecord) => {
    setRecordForm({ date: r.date, amount: String(r.amount), description: r.description, paymentMethod: r.paymentMethod, status: r.status });
    setEditingRecordId(r.id);
    setShowForm(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await paymentsApi.remove(recordId);
      setRecords(records.filter((r) => r.id !== recordId));
      toast.success("Registro removido!");
    } catch {
      toast.error("Erro ao remover registro");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;
  }

  if (!client) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
        <button onClick={() => navigate("/clientes")} className="text-primary underline cursor-pointer">Voltar</button>
      </div>
    );
  }

  const plan = client.plan;
  const daysLate = client.status === "atrasado" ? differenceInDays(new Date(), parseISO(client.nextPaymentDate)) : 0;
  const totalPago = records.filter((r) => r.status === "pago").reduce((s, r) => s + r.amount, 0);
  const totalPendente = records.filter((r) => r.status === "pendente").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="p-4 md:p-8 max-w-[960px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/clientes")} className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1>{client.name}</h1>
            <span className={`text-[0.75rem] px-2 py-0.5 rounded-full ${statusColors[client.status]}`}>
              {statusLabels[client.status]}
            </span>
          </div>
          {client.status === "atrasado" && (
            <p className="text-red-500 text-[0.8rem] mt-0.5">{daysLate} dia{daysLate !== 1 ? "s" : ""} de atraso</p>
          )}
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-card border border-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <p className="text-[0.75rem] text-muted-foreground mb-1">Email</p>
          <p className="flex items-center gap-1.5 text-[0.85rem]"><Mail size={14} className="text-muted-foreground shrink-0" />{client.email}</p>
        </div>
        <div>
          <p className="text-[0.75rem] text-muted-foreground mb-1">Telefone</p>
          <p className="flex items-center gap-1.5 text-[0.85rem]"><Phone size={14} className="text-muted-foreground shrink-0" />{client.phone}</p>
        </div>
        <div>
          <p className="text-[0.75rem] text-muted-foreground mb-1">Plano</p>
          <p className="text-[0.85rem]">{plan?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-[0.75rem] text-muted-foreground mb-1">Valor do plano</p>
          <p className="text-[0.85rem]">{plan ? fmt(plan.price) : "—"}</p>
        </div>
        <div>
          <p className="text-[0.75rem] text-muted-foreground mb-1">Início do contrato</p>
          <p className="text-[0.85rem]">{format(parseISO(client.startDate), "dd/MM/yyyy")}</p>
        </div>
        <div>
          <p className="text-[0.75rem] text-muted-foreground mb-1">Próx. vencimento</p>
          <p className={`text-[0.85rem] ${client.status === "atrasado" ? "text-red-500" : ""}`}>
            {format(parseISO(client.nextPaymentDate), "dd/MM/yyyy")}
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[1rem]">Histórico de Pagamentos</h2>
          <button
            onClick={() => (showForm && !editingRecordId ? handleCancel() : setShowForm(true))}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-[0.85rem]"
          >
            {showForm && !editingRecordId ? <X size={16} /> : <Plus size={16} />}
            {showForm && !editingRecordId ? "Cancelar" : "Registrar Pagamento"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleRecordSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-[0.9rem]">{editingRecordId ? "Editar Pagamento" : "Novo Pagamento"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-[0.8rem] text-muted-foreground block mb-1">Data</label>
                <input type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
              </div>
              <div>
                <label className="text-[0.8rem] text-muted-foreground block mb-1">Valor (R$)</label>
                <input type="number" step="0.01" min="0" value={recordForm.amount} onChange={(e) => setRecordForm({ ...recordForm, amount: e.target.value })} placeholder={plan ? String(plan.price) : "0.00"} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
              </div>
              <div>
                <label className="text-[0.8rem] text-muted-foreground block mb-1">Forma de Pagamento</label>
                <select value={recordForm.paymentMethod} onChange={(e) => setRecordForm({ ...recordForm, paymentMethod: e.target.value as PaymentRecord["paymentMethod"] })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background">
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              <div>
                <label className="text-[0.8rem] text-muted-foreground block mb-1">Status</label>
                <select value={recordForm.status} onChange={(e) => setRecordForm({ ...recordForm, status: e.target.value as PaymentRecord["status"] })} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background">
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[0.8rem] text-muted-foreground block mb-1">Descrição</label>
                <input value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} placeholder={`Mensalidade ${plan?.name ?? ""}`} className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60">
                {saving ? "Salvando..." : editingRecordId ? "Atualizar" : "Salvar"}
              </button>
              <button type="button" onClick={handleCancel} className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Data</th>
                  <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground">Descrição</th>
                  <th className="text-left px-4 py-3 text-[0.8rem] text-muted-foreground hidden sm:table-cell">Pagamento</th>
                  <th className="text-right px-4 py-3 text-[0.8rem] text-muted-foreground">Valor</th>
                  <th className="text-center px-4 py-3 text-[0.8rem] text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 text-[0.8rem] text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-[0.8rem] text-muted-foreground whitespace-nowrap">{format(parseISO(r.date), "dd/MM/yyyy")}</td>
                    <td className="px-4 py-3 text-[0.85rem]">{r.description}</td>
                    <td className="px-4 py-3 text-[0.8rem] text-muted-foreground hidden sm:table-cell">{paymentMethodLabels[r.paymentMethod]}</td>
                    <td className="px-4 py-3 text-right text-[0.85rem]">{fmt(r.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[0.7rem] px-2 py-0.5 rounded-full ${recordStatusColors[r.status]}`}>
                        {recordStatusLabels[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEditRecord(r)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteRecord(r.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer" title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {records.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-[0.85rem]">Nenhum pagamento registrado.</p>
          )}
        </div>

        {/* Summary */}
        {records.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-[0.7rem] text-emerald-700">Total Pago</p>
              <p className="text-[0.95rem] text-emerald-700">{fmt(totalPago)}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
              <p className="text-[0.7rem] text-yellow-700">Pendente</p>
              <p className="text-[0.95rem] text-yellow-700">{fmt(totalPendente)}</p>
            </div>
            <div className="bg-muted border border-border rounded-xl p-3 text-center">
              <p className="text-[0.7rem] text-muted-foreground">Total Geral</p>
              <p className="text-[0.95rem]">{fmt(records.reduce((s, r) => s + r.amount, 0))}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
