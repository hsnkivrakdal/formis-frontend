import "server-only";

export const SERVICES = {
  form: process.env.FORMIS_FORM_API_BASE,
  university: process.env.FORMIS_UNIVERSITY_API_BASE,
  user: process.env.FORMIS_USER_API_BASE,
} as const;

export type ServiceKey = keyof typeof SERVICES;

export function serviceUrl(key: ServiceKey): string {
  const url = SERVICES[key];
  if (!url) throw new Error(`Env yok: ${envNameFor(key)} (.env'e ekle)`);
  return url.replace(/\/+$/, "");
}

function envNameFor(key: ServiceKey): string {
  switch (key) {
    case "form":       return "FORMIS_FORM_API_BASE";
    case "university": return "FORMIS_UNIVERSITY_API_BASE";
    case "user":       return "FORMIS_USER_API_BASE";
  }
}

export const DEV_IDENTITY_NUMBER = process.env.DEV_IDENTITY_NUMBER ?? "";
