const { Router } = require("express");
const db = require("../data");

const router = Router();

// GET /api/dashboard
router.get("/", (_req, res) => {
  const { transactions, clients, notifications, plans, monthlyRevenue, revenueByModality } = db;

  const totalReceita = transactions
    .filter((t) => t.type === "entrada")
    .reduce((s, t) => s + t.amount, 0);

  const totalDespesas = transactions
    .filter((t) => t.type === "saida")
    .reduce((s, t) => s + t.amount, 0);

  const clientesAtivos = clients.filter((c) => c.status !== "cancelado").length;
  const inadimplentes = clients.filter((c) => c.status === "atrasado").length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const overdueClients = clients
    .filter((c) => c.status === "atrasado")
    .map((c) => {
      const plan = plans.find((p) => p.id === c.planId);
      return { ...c, planName: plan?.name ?? "—", planPrice: plan?.price ?? 0 };
    });

  res.json({
    totalReceita,
    totalDespesas,
    saldo: totalReceita - totalDespesas,
    clientesAtivos,
    inadimplentes,
    unreadNotifs,
    recentTransactions,
    overdueClients,
    monthlyRevenue,
    revenueByModality,
  });
});

module.exports = router;
