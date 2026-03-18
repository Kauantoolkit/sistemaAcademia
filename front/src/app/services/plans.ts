import { get, post, put } from "./http";
import type { Plan } from "../data/mockData";

export const plansApi = {
  list:   ()                                            => get<Plan[]>("/plans"),
  create: (data: Omit<Plan, "id" | "clientCount">)     => post<Plan>("/plans", data),
  update: (id: string, data: Partial<Plan>)             => put<Plan>(`/plans/${id}`, data),
};
