import { get } from "./http";
import type { DashboardData } from "../data/mockData";

export const dashboardApi = {
  get: () => get<DashboardData>("/dashboard"),
};
