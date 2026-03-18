// In-memory store — all mutations persist during the session.
// Replace each array with real DB calls when the backend grows.

const today = new Date();

const sub = (days = 0, months = 0) => {
  const d = new Date(today);
  d.setMonth(d.getMonth() - months);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};

const add = (days = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const todayStr = today.toISOString().split("T")[0];

// ─── Plans ────────────────────────────────────────────────────────────────────
const plans = [
  { id: "p1", name: "Musculação Mensal",      modality: "Musculação", price: 89.9,   duration: 1,  active: true  },
  { id: "p2", name: "Musculação Trimestral",   modality: "Musculação", price: 239.9,  duration: 3,  active: true  },
  { id: "p3", name: "Musculação Semestral",    modality: "Musculação", price: 449.9,  duration: 6,  active: true  },
  { id: "p4", name: "Musculação Anual",        modality: "Musculação", price: 799.9,  duration: 12, active: true  },
  { id: "p5", name: "CrossFit Mensal",         modality: "CrossFit",   price: 129.9,  duration: 1,  active: true  },
  { id: "p6", name: "CrossFit Trimestral",     modality: "CrossFit",   price: 349.9,  duration: 3,  active: true  },
  { id: "p7", name: "Pilates Mensal",          modality: "Pilates",    price: 149.9,  duration: 1,  active: true  },
  { id: "p8", name: "Combo Completo Mensal",   modality: "Combo",      price: 199.9,  duration: 1,  active: true  },
  { id: "p9", name: "Natação Mensal",          modality: "Natação",    price: 119.9,  duration: 1,  active: false },
];

// ─── Clients ──────────────────────────────────────────────────────────────────
const clients = [
  { id: "c1",  name: "Lucas Oliveira",      email: "lucas@email.com",     phone: "(11) 99123-4567", planId: "p1", startDate: "2025-09-15", nextPaymentDate: sub(15), status: "atrasado" },
  { id: "c2",  name: "Maria Santos",        email: "maria@email.com",     phone: "(11) 98765-4321", planId: "p2", startDate: "2025-11-01", nextPaymentDate: add(20), status: "em_dia"  },
  { id: "c3",  name: "João Pedro Silva",    email: "joao@email.com",      phone: "(11) 97654-3210", planId: "p5", startDate: "2025-10-10", nextPaymentDate: sub(5),  status: "atrasado" },
  { id: "c4",  name: "Ana Carolina Souza",  email: "ana@email.com",       phone: "(11) 96543-2109", planId: "p8", startDate: "2026-01-05", nextPaymentDate: add(5),  status: "em_dia"  },
  { id: "c5",  name: "Rafael Costa",        email: "rafael@email.com",    phone: "(11) 95432-1098", planId: "p4", startDate: "2025-06-20", nextPaymentDate: add(90), status: "em_dia"  },
  { id: "c6",  name: "Fernanda Lima",       email: "fernanda@email.com",  phone: "(11) 94321-0987", planId: "p7", startDate: "2025-12-01", nextPaymentDate: sub(30), status: "atrasado" },
  { id: "c7",  name: "Bruno Mendes",        email: "bruno@email.com",     phone: "(11) 93210-9876", planId: "p1", startDate: "2026-02-15", nextPaymentDate: add(2),  status: "em_dia"  },
  { id: "c8",  name: "Camila Rocha",        email: "camila@email.com",    phone: "(11) 92109-8765", planId: "p6", startDate: "2025-08-01", nextPaymentDate: add(45), status: "em_dia"  },
  { id: "c9",  name: "Diego Martins",       email: "diego@email.com",     phone: "(11) 91098-7654", planId: "p5", startDate: "2025-07-10", nextPaymentDate: sub(2),  status: "atrasado" },
  { id: "c10", name: "Patrícia Alves",      email: "patricia@email.com",  phone: "(11) 90987-6543", planId: "p3", startDate: "2026-01-20", nextPaymentDate: add(120),status: "em_dia"  },
  { id: "c11", name: "Thiago Nunes",        email: "thiago@email.com",    phone: "(11) 99876-5432", planId: "p1", startDate: "2025-04-01", nextPaymentDate: sub(60), status: "cancelado"},
  { id: "c12", name: "Juliana Ferreira",    email: "juliana@email.com",   phone: "(11) 98765-1234", planId: "p8", startDate: "2026-03-01", nextPaymentDate: add(12), status: "em_dia"  },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
const transactions = [
  { id: "t1",  type: "entrada", category: "Mensalidade",           description: "Pgto mensalidade - Maria Santos",      amount: 239.9,  date: sub(1),  clientId: "c2"  },
  { id: "t2",  type: "entrada", category: "Mensalidade",           description: "Pgto mensalidade - Ana Carolina",      amount: 199.9,  date: sub(2),  clientId: "c4"  },
  { id: "t3",  type: "saida",   category: "Salários",              description: "Folha de pagamento - Instrutores",     amount: 8500,   date: sub(3)                    },
  { id: "t4",  type: "saida",   category: "Aluguel",               description: "Aluguel do espaço - Março",            amount: 4500,   date: sub(5)                    },
  { id: "t5",  type: "entrada", category: "Matrícula",             description: "Nova matrícula - Juliana Ferreira",    amount: 50,     date: sub(5),  clientId: "c12" },
  { id: "t6",  type: "saida",   category: "Energia Elétrica",      description: "Conta de luz - Março",                 amount: 1200,   date: sub(7)                    },
  { id: "t7",  type: "entrada", category: "Mensalidade",           description: "Pgto mensalidade - Rafael Costa",      amount: 799.9,  date: sub(8),  clientId: "c5"  },
  { id: "t8",  type: "entrada", category: "Personal Trainer",      description: "Pacote PT - Bruno Mendes",             amount: 350,    date: sub(10), clientId: "c7"  },
  { id: "t9",  type: "saida",   category: "Manutenção Equipamentos",description: "Reparo esteira #3",                   amount: 450,    date: sub(10)                   },
  { id: "t10", type: "entrada", category: "Mensalidade",           description: "Pgto mensalidade - Camila Rocha",      amount: 349.9,  date: sub(12), clientId: "c8"  },
  { id: "t11", type: "saida",   category: "Material de Limpeza",   description: "Produtos de limpeza mensal",           amount: 280,    date: sub(14)                   },
  { id: "t12", type: "entrada", category: "Venda de Produtos",     description: "Venda suplementos",                    amount: 185,    date: sub(15)                   },
  { id: "t13", type: "saida",   category: "Marketing",             description: "Campanha Instagram Ads",               amount: 600,    date: sub(18)                   },
  { id: "t14", type: "entrada", category: "Mensalidade",           description: "Pgto mensalidade - Patrícia Alves",    amount: 449.9,  date: sub(20), clientId: "c10" },
  { id: "t15", type: "saida",   category: "Água",                  description: "Conta de água - Fev",                  amount: 380,    date: sub(22)                   },
  { id: "t16", type: "entrada", category: "Avaliação Física",      description: "Avaliações do mês",                    amount: 400,    date: sub(25)                   },
  { id: "t17", type: "saida",   category: "Internet",              description: "Plano internet fibra",                 amount: 199,    date: sub(28)                   },
  { id: "t18", type: "saida",   category: "Impostos",              description: "DAS Simples Nacional",                 amount: 1850,   date: sub(30)                   },
  { id: "t19", type: "entrada", category: "Mensalidade",           description: "Pgto mensalidades diversas",           amount: 1250,   date: sub(30)                   },
  { id: "t20", type: "saida",   category: "Equipamentos Novos",    description: "2x Halteres 30kg",                     amount: 520,    date: sub(35)                   },
];

// ─── Payment Records ──────────────────────────────────────────────────────────
const paymentRecords = [
  { id: "pr1",  clientId: "c1",  date: sub(0, 3), amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "pix",      status: "pago"     },
  { id: "pr2",  clientId: "c1",  date: sub(0, 2), amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "pix",      status: "pago"     },
  { id: "pr3",  clientId: "c1",  date: sub(15),   amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "pix",      status: "pendente" },
  { id: "pr4",  clientId: "c2",  date: sub(0, 3), amount: 239.9, description: "Mensalidade Trimestral Musculação",paymentMethod: "cartao",  status: "pago"     },
  { id: "pr5",  clientId: "c2",  date: sub(0, 1), amount: 239.9, description: "Mensalidade Trimestral Musculação",paymentMethod: "cartao",  status: "pago"     },
  { id: "pr6",  clientId: "c3",  date: sub(0, 2), amount: 129.9, description: "Mensalidade CrossFit",            paymentMethod: "dinheiro", status: "pago"     },
  { id: "pr7",  clientId: "c3",  date: sub(5),    amount: 129.9, description: "Mensalidade CrossFit",            paymentMethod: "dinheiro", status: "pendente" },
  { id: "pr8",  clientId: "c4",  date: sub(0, 2), amount: 199.9, description: "Mensalidade Combo Completo",      paymentMethod: "pix",      status: "pago"     },
  { id: "pr9",  clientId: "c4",  date: sub(0, 1), amount: 199.9, description: "Mensalidade Combo Completo",      paymentMethod: "pix",      status: "pago"     },
  { id: "pr10", clientId: "c5",  date: sub(0, 9), amount: 799.9, description: "Plano Anual Musculação",          paymentMethod: "cartao",   status: "pago"     },
  { id: "pr11", clientId: "c6",  date: sub(0, 3), amount: 149.9, description: "Mensalidade Pilates",             paymentMethod: "boleto",   status: "pago"     },
  { id: "pr12", clientId: "c6",  date: sub(0, 2), amount: 149.9, description: "Mensalidade Pilates",             paymentMethod: "boleto",   status: "pago"     },
  { id: "pr13", clientId: "c6",  date: sub(30),   amount: 149.9, description: "Mensalidade Pilates",             paymentMethod: "boleto",   status: "pendente" },
  { id: "pr14", clientId: "c7",  date: sub(0, 1), amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "pix",      status: "pago"     },
  { id: "pr15", clientId: "c8",  date: sub(0, 3), amount: 349.9, description: "Mensalidade Trimestral CrossFit", paymentMethod: "cartao",   status: "pago"     },
  { id: "pr16", clientId: "c9",  date: sub(0, 2), amount: 129.9, description: "Mensalidade CrossFit",            paymentMethod: "dinheiro", status: "pago"     },
  { id: "pr17", clientId: "c9",  date: sub(0, 1), amount: 129.9, description: "Mensalidade CrossFit",            paymentMethod: "dinheiro", status: "pago"     },
  { id: "pr18", clientId: "c9",  date: sub(2),    amount: 129.9, description: "Mensalidade CrossFit",            paymentMethod: "dinheiro", status: "pendente" },
  { id: "pr19", clientId: "c10", date: sub(0, 2), amount: 449.9, description: "Mensalidade Semestral Musculação",paymentMethod: "cartao",   status: "pago"     },
  { id: "pr20", clientId: "c11", date: sub(0, 4), amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "dinheiro", status: "pago"     },
  { id: "pr21", clientId: "c11", date: sub(0, 3), amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "dinheiro", status: "pago"     },
  { id: "pr22", clientId: "c11", date: sub(0, 2), amount: 89.9,  description: "Mensalidade Musculação",          paymentMethod: "dinheiro", status: "cancelado"},
  { id: "pr23", clientId: "c12", date: sub(0, 1), amount: 199.9, description: "Mensalidade Combo Completo",      paymentMethod: "pix",      status: "pago"     },
];

// ─── Notifications ────────────────────────────────────────────────────────────
const notifications = [
  { id: "n1", type: "atrasado", message: "Lucas Oliveira está com pagamento atrasado há 15 dias",     clientId: "c1",  date: todayStr,  read: false },
  { id: "n2", type: "atrasado", message: "Fernanda Lima está com pagamento atrasado há 30 dias",      clientId: "c6",  date: todayStr,  read: false },
  { id: "n3", type: "atrasado", message: "João Pedro Silva está com pagamento atrasado há 5 dias",    clientId: "c3",  date: sub(1),    read: false },
  { id: "n4", type: "vencendo", message: "Pagamento de Bruno Mendes vence em 2 dias",                 clientId: "c7",  date: todayStr,  read: false },
  { id: "n5", type: "atrasado", message: "Diego Martins está com pagamento atrasado há 2 dias",       clientId: "c9",  date: todayStr,  read: true  },
  { id: "n6", type: "vencendo", message: "Pagamento de Ana Carolina vence em 5 dias",                 clientId: "c4",  date: sub(1),    read: true  },
  { id: "n7", type: "info",     message: "Thiago Nunes cancelou o plano - inadimplência de 60 dias",  clientId: "c11", date: sub(3),    read: true  },
];

// ─── Chart data (static — replace with DB aggregation in production) ──────────
const monthlyRevenue = [
  { month: "Out", receita: 8450,  despesa: 12800 },
  { month: "Nov", receita: 10200, despesa: 13100 },
  { month: "Dez", receita: 9800,  despesa: 12500 },
  { month: "Jan", receita: 12400, despesa: 13800 },
  { month: "Fev", receita: 11800, despesa: 13200 },
  { month: "Mar", receita: 13500, despesa: 14100 },
];

const revenueByModality = [
  { name: "Musculação", value: 5200, fill: "#6366f1" },
  { name: "CrossFit",   value: 3100, fill: "#8b5cf6" },
  { name: "Pilates",    value: 1800, fill: "#a78bfa" },
  { name: "Combo",      value: 2400, fill: "#c4b5fd" },
  { name: "Outros",     value: 1000, fill: "#ddd6fe" },
];

module.exports = { plans, clients, transactions, paymentRecords, notifications, monthlyRevenue, revenueByModality };
