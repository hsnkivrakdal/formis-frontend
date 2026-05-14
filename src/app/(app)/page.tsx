"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { I } from "@/components/ui/Icon";
import { useApp } from "@/lib/app-context";
import Link from "next/link";

export default function DashboardPage() {
  const { T } = useApp();
  const stats = [
    { label: T("Açık Dilekçeler", "Open Petitions"), value: "2", hint: T("İncelemede", "in review") },
    { label: T("Onaylı", "Approved"), value: "7", hint: T("son 30 gün", "last 30 days") },
    { label: T("Taslaklar", "Drafts"), value: "1", hint: T("kaydedildi", "saved") },
    { label: T("Toplam GNO", "Overall GPA"), value: "3.42", hint: T("8. dönem", "8th semester") },
  ];
  const recent = [
    { name: T("Ders Saydırma — STAT201", "Course Substitution — STAT201"), who: "Dr. Mehmet Kara", when: "2h", tone: "review" as const, label: T("İncelemede", "In review") },
    { name: T("Yan dal başvurusu", "Minor application"), who: T("Dekanlık", "Dean's Office"), when: "1d", tone: "approved" as const, label: T("Onaylandı", "Approved") },
    { name: T("MIS305 not itirazı", "MIS305 grade appeal"), who: T("Bölüm Başkanlığı", "Dept. Chair"), when: "Apr 29", tone: "rejected" as const, label: T("Reddedildi", "Rejected") },
  ];
  return (
    <div className="max-w-6xl mx-auto p-7 md:p-9 flex flex-col gap-7">
      <div className="flex items-end justify-between gap-6 pb-5 border-b border-[var(--color-line)]">
        <div>
          <h1 className="font-serif text-3xl tracking-tight font-medium">{T("Hoş geldin, Elif", "Welcome back, Elif")}</h1>
          <p className="text-[var(--color-ink-3)] text-sm mt-1 max-w-prose">
            {T("Bölüm portalına genel bakış. Açık başvurular, son etkinlikler ve hızlı işlemler.",
               "Department portal at a glance — open submissions, recent activity, and quick actions.")}
          </p>
        </div>
        <Link href="/petitions/new"><Button variant="primary">{I.send}{T("Yeni dilekçe", "New petition")}</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] font-semibold">{s.label}</div>
              <div className="font-serif text-3xl mt-1.5 leading-none">{s.value}</div>
              <div className="text-xs text-[var(--color-ink-3)] mt-2">{s.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{T("Son hareketler", "Recent activity")}</CardTitle>
            <CardDescription>{T("Başvurularının ve değişikliklerin akışı", "Stream of your submissions and changes")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-line">
              {recent.map((r, i) => (
                <div key={i} className="grid grid-cols-[1.5fr_1fr_auto_auto] items-center gap-4 px-5 py-3 text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-ink-3 text-xs">{r.who}</span>
                  <span className="text-ink-3 text-xs tabular-nums">{r.when}</span>
                  <Badge tone={r.tone}>{r.label}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{T("Hızlı işlemler", "Quick actions")}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/petitions/new"><Button className="w-full justify-start" variant="outline">{I.doc}{T("Yeni dilekçe başlat", "Start new petition")}</Button></Link>
            <Link href="/internship"><Button className="w-full justify-start" variant="outline">{I.briefcase}{T("Staj başvurusu", "Internship application")}</Button></Link>
            <Link href="/schedule"><Button className="w-full justify-start" variant="outline">{I.cal}{T("Haftalık program", "Weekly schedule")}</Button></Link>
            <Link href="/profile"><Button className="w-full justify-start" variant="outline">{I.user}{T("Profilim", "My profile")}</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
