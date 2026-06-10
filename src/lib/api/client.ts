import "server-only";
import { serviceUrl, type ServiceKey } from "./services";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
    public path: string,
  ) {
    super(`API ${status} on ${path}`);
    this.name = "ApiError";
  }
}

interface BaseOptions<B> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: B;
  token?: string;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

interface ApiOptions<B> extends BaseOptions<B> {
  service: ServiceKey;
}

export async function api<T, B = unknown>(path: string, opts: ApiOptions<B>): Promise<T> {
  const { service, method = "GET", body, token, cache = "no-store", next } = opts;
  const base = serviceUrl(service);
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = { "content-type": "application/json", accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text, path);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : (undefined as T)) as T;
}

const scoped = (service: ServiceKey) =>
  <T, B = unknown>(path: string, opts: BaseOptions<B> = {}) =>
    api<T, B>(path, { ...opts, service });

export const formApi = scoped("form");
export const universityApi = scoped("university");
export const userApi = scoped("user");
