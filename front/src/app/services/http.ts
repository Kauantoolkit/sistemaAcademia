const BASE = "http://localhost:3001/api";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro ${res.status}`);
  }
  return res.json();
}

export const get  = <T>(path: string)                   => request<T>(path);
export const post = <T>(path: string, body: unknown)    => request<T>(path, { method: "POST",   body: JSON.stringify(body) });
export const put  = <T>(path: string, body: unknown)    => request<T>(path, { method: "PUT",    body: JSON.stringify(body) });
export const del  = (path: string)                      => request<void>(path, { method: "DELETE" });
