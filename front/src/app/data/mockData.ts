// Type definitions only — all data lives in the backend (back/src/data.js)

export interface Plan {
  id: string;
  name: string;
  modality: string;
  price: number;
  duration: number; // months
  active: boolean;
  clientCount?: number; // computed by the API
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string;
  startDate: string;       // yyyy-MM-dd
  nextPaymentDate: string; // yyyy-MM-dd
  status: "em_dia" | "atrasado" | "cancelado";
  plan?: Plan;             // populated by GET /clients/:id
}

export interface Transaction {
  id: string;
  type: "entrada" | "saida";
  category: string;
  description: string;
  amount: number;
  date: string; // yyyy-MM-dd
  clientId?: string;
}

export interface PaymentRecord {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  description: string;
  paymentMethod: "dinheiro" | "pix" | "cartao" | "boleto";
  status: "pago" | "pendente" | "cancelado";
}

export interface Notification {
  id: string;
  type: "atrasado" | "vencendo" | "info";
  message: string;
  clientId?: string;
  date: string;
  read: boolean;
}

export interface DashboardData {
  totalReceita: number;
  totalDespesas: number;
  saldo: number;
  clientesAtivos: number;
  inadimplentes: number;
  unreadNotifs: number;
  recentTransactions: Transaction[];
  overdueClients: (Client & { planName: string; planPrice: number })[];
  monthlyRevenue: { month: string; receita: number; despesa: number }[];
  revenueByModality: { name: string; value: number; fill: string }[];
}
