# Documentação de Expectativas — Sistema de Academia (Figma Make)

> Criada em: 2026-03-18
> Objetivo: Registrar o que se espera que o Figma Make tenha gerado, para posterior validação comparativa.
> Foco desta fase: **Gestão financeira** (donos da academia). Expansão futura: treinos e módulos para alunos.

---

## 1. Telas Esperadas

### 1.1 Dashboard / Visão Geral
Tela inicial após login. Deve ser a mais densa de informação.

**Elementos esperados:**
- Header com nome da academia, data atual, ícone de notificações (com badge de quantidade) e avatar/menu do usuário
- Cards de KPIs principais:
  - Receita do mês (com comparativo ao mês anterior, ex: +12%)
  - Despesas do mês
  - Lucro líquido
  - Total de alunos ativos
  - Total de inadimplentes
- Gráfico de barras ou linha: entradas vs saídas (últimos 6 meses)
- Lista rápida de pagamentos atrasados (top 5), com nome do aluno, dias em atraso e valor
- Mini calendário ou lista de vencimentos próximos (próximos 7 dias)

---

### 1.2 Gestão de Planos e Modalidades
Configuração dos produtos que a academia oferece.

**Elementos esperados:**
- Lista de planos com: nome, duração (mensal, trimestral, semestral, anual), preço, número de alunos vinculados, status (ativo/inativo)
- Lista de modalidades: musculação, crossfit, natação, pilates, etc.
- Botão "Novo Plano" com formulário/modal: nome, modalidade, duração, preço, descrição
- Ações por linha: editar, desativar, excluir
- Filtros: por modalidade, por status

---

### 1.3 Gestão de Alunos
Lista de clientes com foco financeiro.

**Elementos esperados:**
- Tabela com: nome, plano ativo, modalidade, data de vencimento, status de pagamento (badge: Ativo / Inadimplente / Suspenso / Cancelado)
- Busca por nome/CPF
- Filtros: por status, por plano, por modalidade
- Ao clicar em um aluno: tela de perfil com:
  - Dados pessoais (nome, contato, CPF)
  - Plano atual e histórico de planos
  - Histórico de pagamentos (tabela: data, valor, forma de pagamento, status)
  - Botão "Registrar pagamento"
  - Botão "Alterar plano"
  - Indicador de inadimplência (dias em atraso, valor total devido)

---

### 1.4 Pagamentos / Cobranças
Controle de recebíveis.

**Elementos esperados:**
- Abas ou filtros rápidos: Todos / Pendentes / Pagos / Atrasados / Cancelados
- Tabela: aluno, plano, vencimento, valor, status, forma de pagamento
- Botão "Registrar pagamento manual" com form: aluno, valor, data, forma de pagamento (dinheiro, PIX, cartão, boleto), observações
- Ação por linha: marcar como pago, enviar lembrete, ver detalhes
- Filtros por período (date range picker)
- Totalização no rodapé: total recebido, total pendente, total em atraso

---

### 1.5 Controle de Caixa — Entradas e Saídas
Fluxo de caixa livre para o dono registrar movimentações além das mensalidades.

**Elementos esperados:**
- Duas seções ou abas: Entradas / Saídas
- Tabela com: data, descrição, categoria, valor, forma de pagamento, responsável
- Categorias de entrada: Mensalidade, Matrícula, Venda de produto, Outros
- Categorias de saída: Aluguel, Salários, Energia/Água, Manutenção de equipamentos, Marketing, Outros
- Botão "Nova entrada" e "Nova saída" com formulário correspondente
- Saldo do período destacado (entradas − saídas)
- Gráfico de fluxo de caixa do mês (linha ou barras empilhadas)
- Filtros: por período, por categoria

---

### 1.6 Notificações
Central de alertas do sistema.

**Elementos esperados:**
- Lista de notificações com: ícone do tipo, mensagem, data/hora, status (lida/não lida)
- Tipos de notificação: pagamento atrasado, vencimento próximo (ex: 3 dias), novo aluno cadastrado, plano cancelado, meta financeira atingida
- Ação: marcar como lida, ir para o aluno relacionado
- Configurações de notificação: quais eventos geram alerta, antecedência para alertas de vencimento (1, 3, 7 dias), canal (in-app, e-mail, WhatsApp)

---

### 1.7 Relatórios
Visão analítica para tomada de decisão.

**Elementos esperados:**
- Relatório financeiro mensal: receita bruta, despesas, lucro, ticket médio
- Relatório de inadimplência: lista de alunos, valor total em aberto, tempo médio de atraso
- Relatório de planos: distribuição de alunos por plano/modalidade, receita por plano
- Gráficos de pizza/barras para distribuição
- Botão de exportação (PDF e/ou Excel) para cada relatório
- Seletor de período (mês/ano ou range customizado)

---

### 1.8 Configurações
Ajustes do sistema.

**Elementos esperados:**
- Dados da academia: nome, CNPJ, endereço, logo, contato
- Usuários e permissões: lista de usuários com papel (Admin, Financeiro, Recepção), convite por e-mail
- Formas de pagamento aceitas: toggle para habilitar/desabilitar (PIX, Cartão, Dinheiro, Boleto)
- Configurações de notificação: canais, gatilhos, antecedência
- Dados bancários (para geração de cobranças futuras)

---

## 2. Fluxos Principais Esperados

### Fluxo 1 — Registrar pagamento de aluno
`Dashboard → Pagamentos → Registrar pagamento → Selecionar aluno → Preencher form → Confirmar → Status atualizado`

### Fluxo 2 — Visualizar inadimplentes e cobrar
`Dashboard (card de inadimplentes) → Lista de alunos (filtro: inadimplente) → Perfil do aluno → Enviar lembrete ou Registrar pagamento`

### Fluxo 3 — Cadastrar novo plano
`Planos e Modalidades → Novo Plano → Preencher form → Salvar → Plano disponível para vinculação de alunos`

### Fluxo 4 — Lançar despesa
`Controle de Caixa → Saídas → Nova saída → Preencher (descrição, categoria, valor, data) → Salvar`

### Fluxo 5 — Consultar resultado mensal
`Relatórios → Relatório financeiro → Selecionar mês → Ver receita, despesas, lucro → Exportar PDF`

---

## 3. Componentes de UI Esperados

| Componente | Uso esperado |
|---|---|
| Cards de KPI | Dashboard |
| Tabelas com paginação | Alunos, Pagamentos, Caixa |
| Badges de status coloridos | Ativo (verde), Inadimplente (vermelho), Pendente (amarelo), Cancelado (cinza) |
| Gráficos de linha/barra | Dashboard e Relatórios |
| Modais/Drawers de formulário | Novo pagamento, Novo plano, Nova despesa |
| Date range picker | Filtros de período |
| Barra lateral de navegação | Menu principal entre telas |
| Notificação com badge | Header, ícone de sino |
| Tabs / filtros rápidos | Pagamentos, Caixa |
| Avatares | Alunos, usuário logado |

---

## 4. Paleta e Estilo Visual Esperados

O Figma Make tende a gerar designs modernos, limpos, estilo SaaS/dashboard. Expectativas:

- **Paleta:** Primária em azul ou roxo escuro (remete a confiança/financeiro), acentos em verde (positivo/receita) e vermelho (negativo/inadimplência)
- **Tipografia:** Sans-serif moderna (Inter, Poppins ou similar)
- **Layout:** Sidebar fixa à esquerda + área de conteúdo principal
- **Modo:** Provavelmente light mode, com possibilidade de dark mode
- **Cards:** Bordas arredondadas, sombra suave, fundo branco/cinza claro

---

## 5. O Que Seria Bonus (não necessariamente esperado, mas seria positivo)

- Tela de login/onboarding
- Indicador de meta mensal de receita com barra de progresso
- Timeline de atividades recentes no dashboard
- Integração visual com métodos de pagamento (logo PIX, etc.)
- Modo mobile-friendly ou versão responsiva
- Estado vazio (empty state) para tabelas sem dados
- Skeleton loading nos cards e tabelas

---

## 6. O Que Provavelmente NÃO foi Gerado (fora do escopo desta fase)

- Módulo de treinos / fichas de exercícios
- Área do aluno (login separado para o cliente)
- Agendamento de aulas
- Controle de acesso / catraca
- Integração com gateway de pagamento real
- Chat / comunicação interna

---

*Este documento serve como baseline para a validação do output do Figma Make.*
