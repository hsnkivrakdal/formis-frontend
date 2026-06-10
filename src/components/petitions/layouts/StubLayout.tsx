"use client";
import { useLang } from "@/lib/lang-client";

export function StubLayout({ title }: { title: string }) {
  const { T } = useLang();
  return (
    <div className="max-w-3xl mx-auto p-9 flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-medium tracking-tight">{title}</h2>
      <p className="text-sm text-ink-3">
        {T(
          "Bu dilekçe tipinin form bileşeni henüz hazırlanmadı. Yakında.",
          "The form component for this petition type is not built yet. Coming soon.",
        )}
      </p>
    </div>
  );
}
