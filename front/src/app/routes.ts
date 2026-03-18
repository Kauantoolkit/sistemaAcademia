import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Recebimentos } from "./pages/Recebimentos";
import { Despesas } from "./pages/Despesas";
import { Clients } from "./pages/Clients";
import { ClientProfile } from "./pages/ClientProfile";
import { Plans } from "./pages/Plans";
import { Notifications } from "./pages/Notifications";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "recebimentos", Component: Recebimentos },
      { path: "despesas", Component: Despesas },
      { path: "clientes", Component: Clients },
      { path: "clientes/:id", Component: ClientProfile },
      { path: "planos", Component: Plans },
      { path: "notificacoes", Component: Notifications },
    ],
  },
]);
