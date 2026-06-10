import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Misc";
import { I } from "@/components/ui/Icon";
import { getT } from "@/lib/lang-server";
import { getPetitions } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { PetitionStatus, LayoutKey } from "@/types/petition";

const TONE: Record<PetitionStatus, "review" | "approved" | "rejected" | "draft"> = {
  review: "review",
  approved: "approved",
  rejected: "rejected",
  draft: "draft",
};

interface PetitionType {
  key: LayoutKey;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default async function PetitionsListPage() {
  const { T, lang } = await getT();
  const items = await getPetitions();

  const statusLabel = (s: PetitionStatus) =>
    s === "review" ? T("İncelemede", "In review")
    : s === "approved" ? T("Onaylandı", "Approved")
    : s === "rejected" ? T("Reddedildi", "Rejected")
    : T("Taslak", "Draft");

  const layoutLabel = (l: LayoutKey) =>
    l === "general" ? T("Genel", "General")
    : l === "cancellation" ? T("Ders Bırakma", "Cancellation")
    : l === "ek-sinav-44c" ? T("44/c Ek Sınavı", "44/c Extra Exam")
    : l === "mazeret-sinavi-final" ? T("Mazeret Sınavı", "Excuse Exam")
    : T("İlişik Kesme", "Withdrawal");

  const types: PetitionType[] = [
    {
      key: "general",
      title: T("Genel Dilekçe", "General Petition"),
      description: T(
        "Serbest metin ile herhangi bir konuda dilekçe.",
        "Free-form petition for any general request.",
      ),
      icon: I.doc,
    },
    {
      key: "cancellation",
      title: T("Ders Bırakma", "Course Cancellation"),
      description: T(
        "Dönem içinde alınan bir dersi bırakma talebi.",
        "Drop a course you are currently enrolled in.",
      ),
      icon: I.x,
    },
    {
      key: "ek-sinav-44c",
      title: T("44/c Ek Sınavı", "44/c Extra Exam"),
      description: T(
        "Azami öğrenim süresi sonunda 2547 sayılı kanun 44/c kapsamında ek sınav talebi.",
        "Extra exam request under article 44/c after maximum study period.",
      ),
      icon: I.paper,
    },
    {
      key: "mazeret-sinavi-final",
      title: T("Mazeret Sınavı (Final)", "Excuse Exam (Final)"),
      description: T(
        "Mazeret sebebiyle final sınavlarına giremediğin dersler için talep.",
        "Request a make-up final exam due to valid excuse.",
      ),
      icon: I.alert,
    },
    {
      key: "ilisik-kesme",
      title: T("İlişik Kesme", "Withdrawal"),
      description: T(
        "Üniversiteden kaydın silinmesi için dilekçe.",
        "Request to withdraw your registration from the university.",
      ),
      icon: I.x,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-7 md:p-9 flex flex-col gap-7">
      <header className="pb-5 border-b border-line">
        <h1 className="font-serif text-3xl tracking-tight font-medium">{T("Dilekçelerim", "My Petitions")}</h1>
        <p className="text-ink-3 text-sm mt-1">
          {T("Yeni başlatmak için bir form türü seçin veya mevcut başvurularını gör.", "Pick a form type to start a new petition, or review existing ones.")}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold">
          {T("Yeni Dilekçe Başlat", "Start New Petition")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {types.map((t) => (
            <Link
              key={t.key}
              href={`/petitions/new?layout=${t.key}`}
              className="group flex flex-col gap-2 p-5 rounded-lg border border-line bg-surface hover:border-accent hover:bg-surface-2 transition-colors"
            >
              <span className="text-ink-2 group-hover:text-accent transition-colors">{t.icon}</span>
              <div className="font-serif text-base font-medium tracking-tight">{t.title}</div>
              <p className="text-xs text-ink-3 leading-relaxed">{t.description}</p>
              <span className="mt-auto pt-2 text-[11px] font-mono uppercase tracking-wider text-ink-3 group-hover:text-accent transition-colors inline-flex items-center gap-1">
                {T("Başlat", "Start")} {I.arrow}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{T("Önceki Başvurularım", "Previous Submissions")}</CardTitle>
          <CardDescription>{items.length} {T("kayıt", "records")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-line">
            {items.map((p) => (
              <Link
                key={p.id}
                href={`/petitions/${p.id}`}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3 text-sm hover:bg-surface-2 transition-colors"
              >
                <div>
                  <div className="font-medium">{p.subject}</div>
                  <div className="text-[11px] text-ink-3 font-mono mt-0.5">{p.code}</div>
                </div>
                <span className="text-xs text-ink-3">{layoutLabel(p.layoutKey)}</span>
                <span className="text-xs text-ink-3 tabular-nums">{formatDate(p.updatedAt, lang)}</span>
                <Badge tone={TONE[p.status]}>{statusLabel(p.status)}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
