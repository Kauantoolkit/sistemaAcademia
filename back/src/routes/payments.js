const { Router } = require("express");
const db = require("../data");

const router = Router();

// PUT /api/payments/:id
router.put("/:id", (req, res) => {
  const idx = db.paymentRecords.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Registro não encontrado" });
  db.paymentRecords[idx] = { ...db.paymentRecords[idx], ...req.body, id: req.params.id };
  res.json(db.paymentRecords[idx]);
});

// DELETE /api/payments/:id
router.delete("/:id", (req, res) => {
  const idx = db.paymentRecords.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Registro não encontrado" });
  db.paymentRecords.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
