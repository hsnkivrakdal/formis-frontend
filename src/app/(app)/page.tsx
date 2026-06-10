import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { I } from "@/components/ui/Icon";
import { getT } from "@/lib/lang-server";
import { getPetitions, getStudentProfile } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default async function DashboardPage() {
  const { T, lang } = await getT();
  const [profile, petitions] = await Promise.all([getStudentProfile(), getPetitions()]);

  const counts = {
    review: petitions.filter((p) => p.status === "review").length,
    approved: petitions.filter((p) => p.status === "approved").length,
    draft: petitions.filter((p) => p.status === "draft").length,
  };

  const stats = [
    { label: T("Açık Dilekçeler", "Open Petitions"), value: String(counts.review), hint: T("İncelemede", "in review") },
    { label: T("Onaylı", "Approved"), value: String(counts.approved), hint: T("son 30 gün", "last 30 days") },
    { label: T("Taslaklar", "Drafts"), value: String(counts.draft), hint: T("kaydedildi", "saved") },
    { label: T("Toplam GNO", "Overall GPA"), value: profile.gpa, hint: T("8. dönem", "8th semester") },
  ];

  const toneFor = (s: string) =>
    s === "review" ? ("review" as const) : s === "approved" ? ("approved" as const) : s === "rejected" ? ("rejected" as const) : ("default" as const);

  const statusLabel = (s: string) =>
    s === "review" ? T("İncelemede", "In review")
    : s === "approved" ? T("Onaylandı", "Approved")
    : s === "rejected" ? T("Reddedildi", "Rejected")
    : T("Taslak", "Draft");

  const recent = petitions.slice(0, 3);
  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="max-w-6xl mx-auto p-7 md:p-9 flex flex-col gap-7">
      <div className="flex items-end justify-between gap-6 pb-5 border-b border-line">
        <div>
          <h1 className="font-serif text-3xl tracking-tight font-medium">
            {T(`Hoş geldin, ${firstName}`, `Welcome back, ${firstName}`)}
          </h1>
          <p className="text-ink-3 text-sm mt-1 max-w-prose">
            {T(
              "Bölüm portalına genel bakış. Açık başvurular, son etkinlikler ve hızlı işlemler.",
              "Department portal at a glance — open submissions, recent activity, and quick actions.",
            )}
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/petitions/new">
            {I.send}
            {T("Yeni dilekçe", "New petition")}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold">{s.label}</div>
              <div className="font-serif text-3xl mt-1.5 leading-none">{s.value}</div>
              <div className="text-xs text-ink-3 mt-2">{s.hint}</div>
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
              {recent.map((p) => (
                <div key={p.id} className="grid grid-cols-[1.5fr_1fr_auto_auto] items-center gap-4 px-5 py-3 text-sm">
                  <span className="font-medium">{p.subject}</span>
                  <span className="text-ink-3 text-xs font-mono">{p.code}</span>
                  <span className="text-ink-3 text-xs tabular-nums">{formatDate(p.updatedAt, lang)}</span>
                  <Badge tone={toneFor(p.status)}>{statusLabel(p.status)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{T("Hızlı işlemler", "Quick actions")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/petitions/new">{I.doc}{T("Yeni dilekçe başlat", "Start new petition")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/internship">{I.briefcase}{T("Staj başvurusu", "Internship application")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/schedule">{I.cal}{T("Haftalık program", "Weekly schedule")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/profile">{I.user}{T("Profilim", "My profile")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
