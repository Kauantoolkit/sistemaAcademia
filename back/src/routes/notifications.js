const { Router } = require("express");
const db = require("../data");

const router = Router();

// GET /api/notifications
router.get("/", (_req, res) => {
  res.json(db.notifications);
});

// PUT /api/notifications/read-all
router.put("/read-all", (_req, res) => {
  db.notifications.forEach((n) => (n.read = true));
  res.json({ ok: true });
});

// PUT /api/notifications/:id/read
router.put("/:id/read", (req, res) => {
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (!notif) return res.status(404).json({ error: "Notificação não encontrada" });
  notif.read = true;
  res.json(notif);
});

module.exports = router;
