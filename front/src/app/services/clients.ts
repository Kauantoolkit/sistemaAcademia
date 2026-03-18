import { get, post, put } from "./http";
import type { Client } from "../data/mockData";

export const clientsApi = {
  list:   ()                                    => get<Client[]>("/clients"),
  get:    (id: string)                          => get<Client>(`/clients/${id}`),
  create: (data: Omit<Client, "id">)            => post<Client>("/clients", data),
  update: (id: string, data: Partial<Client>)   => put<Client>(`/clients/${id}`, data),
};
