const { Router } = require("express");
const db = require("../data");

const router = Router();

// GET /api/transactions?type=entrada|saida
router.get("/", (req, res) => {
  const { type } = req.query;
  const result = type ? db.transactions.filter((t) => t.type === type) : db.transactions;
  res.json([...result].sort((a, b) => b.date.localeCompare(a.date)));
});

// POST /api/transactions
router.post("/", (req, res) => {
  const { type, category, description, amount, date, clientId } = req.body;
  if (!type || !category || !description || !amount) {
    return res.status(400).json({ error: "type, category, description e amount são obrigatórios" });
  }
  const tx = {
    id: `t${Date.now()}`,
    type,
    category,
    description,
    amount: parseFloat(amount),
    date: date ?? new Date().toISOString().split("T")[0],
    ...(clientId ? { clientId } : {}),
  };
  db.transactions.push(tx);
  res.status(201).json(tx);
});

// PUT /api/transactions/:id
router.put("/:id", (req, res) => {
  const idx = db.transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Transação não encontrada" });
  db.transactions[idx] = { ...db.transactions[idx], ...req.body, id: req.params.id };
  res.json(db.transactions[idx]);
});

// DELETE /api/transactions/:id
router.delete("/:id", (req, res) => {
  const idx = db.transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Transação não encontrada" });
  db.transactions.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
