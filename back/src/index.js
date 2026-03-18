const express = require("express");
const cors = require("cors");

const dashboardRouter     = require("./routes/dashboard");
const clientsRouter       = require("./routes/clients");
const plansRouter         = require("./routes/plans");
const transactionsRouter  = require("./routes/transactions");
const notificationsRouter = require("./routes/notifications");
const paymentsRouter      = require("./routes/payments");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/dashboard",     dashboardRouter);
app.use("/api/clients",       clientsRouter);
app.use("/api/plans",         plansRouter);
app.use("/api/transactions",  transactionsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/payments",      paymentsRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
