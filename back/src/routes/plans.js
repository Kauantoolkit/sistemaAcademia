const { Router } = require("express");
const db = require("../data");

const router = Router();

const withCount = (plan) => ({
  ...plan,
  clientCount: db.clients.filter((c) => c.planId === plan.id && c.status !== "cancelado").length,
});

// GET /api/plans
router.get("/", (_req, res) => {
  res.json(db.plans.map(withCount));
});

// POST /api/plans
router.post("/", (req, res) => {
  const { name, modality, price, duration } = req.body;
  if (!name || !modality || !price) {
    return res.status(400).json({ error: "name, modality e price são obrigatórios" });
  }
  const plan = {
    id: `p${Date.now()}`,
    name,
    modality,
    price: parseFloat(price),
    duration: parseInt(duration ?? 1),
    active: true,
  };
  db.plans.push(plan);
  res.status(201).json(withCount(plan));
});

// PUT /api/plans/:id
router.put("/:id", (req, res) => {
  const idx = db.plans.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Plano não encontrado" });
  db.plans[idx] = { ...db.plans[idx], ...req.body, id: req.params.id };
  res.json(withCount(db.plans[idx]));
});

module.exports = router;
