const { Router } = require("express");
const db = require("../data");

const router = Router();

// GET /api/clients
router.get("/", (_req, res) => {
  res.json(db.clients);
});

// POST /api/clients
router.post("/", (req, res) => {
  const { name, email, phone, planId, startDate, nextPaymentDate, status } = req.body;
  if (!name || !email || !planId) {
    return res.status(400).json({ error: "name, email e planId são obrigatórios" });
  }
  const today = new Date().toISOString().split("T")[0];
  const client = {
    id: `c${Date.now()}`,
    name,
    email,
    phone: phone ?? "",
    planId,
    startDate: startDate ?? today,
    nextPaymentDate: nextPaymentDate ?? today,
    status: status ?? "em_dia",
  };
  db.clients.push(client);
  res.status(201).json(client);
});

// GET /api/clients/:id
router.get("/:id", (req, res) => {
  const client = db.clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Cliente não encontrado" });
  const plan = db.plans.find((p) => p.id === client.planId);
  res.json({ ...client, plan: plan ?? null });
});

// PUT /api/clients/:id
router.put("/:id", (req, res) => {
  const idx = db.clients.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Cliente não encontrado" });
  db.clients[idx] = { ...db.clients[idx], ...req.body, id: req.params.id };
  res.json(db.clients[idx]);
});

// GET /api/clients/:id/payments
router.get("/:id/payments", (req, res) => {
  const records = db.paymentRecords
    .filter((r) => r.clientId === req.params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  res.json(records);
});

// POST /api/clients/:id/payments
router.post("/:id/payments", (req, res) => {
  const client = db.clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Cliente não encontrado" });

  const { date, amount, description, paymentMethod, status } = req.body;
  if (!amount || !description) {
    return res.status(400).json({ error: "amount e description são obrigatórios" });
  }

  const record = {
    id: `pr${Date.now()}`,
    clientId: req.params.id,
    date: date ?? new Date().toISOString().split("T")[0],
    amount: parseFloat(amount),
    description,
    paymentMethod: paymentMethod ?? "pix",
    status: status ?? "pago",
  };

  db.paymentRecords.push(record);

  // When a payment is marked as paid, update the client status and next payment date
  if (record.status === "pago") {
    const plan = db.plans.find((p) => p.id === client.planId);
    const duration = plan?.duration ?? 1;
    const next = new Date(record.date);
    next.setMonth(next.getMonth() + duration);
    const clientIdx = db.clients.findIndex((c) => c.id === req.params.id);
    db.clients[clientIdx] = {
      ...db.clients[clientIdx],
      status: "em_dia",
      nextPaymentDate: next.toISOString().split("T")[0],
    };
  }

  res.status(201).json({ record, client: db.clients.find((c) => c.id === req.params.id) });
});

module.exports = router;
