import { get, post, put, del } from "./http";
import type { Client, PaymentRecord } from "../data/mockData";

export const paymentsApi = {
  list: (clientId: string) =>
    get<PaymentRecord[]>(`/clients/${clientId}/payments`),

  create: (clientId: string, data: Omit<PaymentRecord, "id" | "clientId">) =>
    post<{ record: PaymentRecord; client: Client }>(`/clients/${clientId}/payments`, data),

  update: (id: string, data: Partial<PaymentRecord>) =>
    put<PaymentRecord>(`/payments/${id}`, data),

  remove: (id: string) => del(`/payments/${id}`),
};
