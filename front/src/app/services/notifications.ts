import { get, put } from "./http";
import type { Notification } from "../data/mockData";

export const notificationsApi = {
  list:        ()          => get<Notification[]>("/notifications"),
  markRead:    (id: string) => put<Notification>(`/notifications/${id}/read`, {}),
  markAllRead: ()           => put<{ ok: boolean }>("/notifications/read-all", {}),
};
