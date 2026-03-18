import { get, post, put, del } from "./http";
import type { Transaction } from "../data/mockData";

export const transactionsApi = {
  recebimentos: ()                                          => get<Transaction[]>("/transactions?type=entrada"),
  despesas:     ()                                          => get<Transaction[]>("/transactions?type=saida"),
  create:       (data: Omit<Transaction, "id">)             => post<Transaction>("/transactions", data),
  update:       (id: string, data: Partial<Transaction>)    => put<Transaction>(`/transactions/${id}`, data),
  remove:       (id: string)                                => del(`/transactions/${id}`),
};
