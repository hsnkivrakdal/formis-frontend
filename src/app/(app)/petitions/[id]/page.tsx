import Link from "next/link";
import { Badge } from "@/components/ui/Misc";
import { getT } from "@/lib/lang-server";
import { Forms } from "@/lib/api/forms";
import { formatDate } from "@/lib/format";
import { PreviewFrame } from "@/components/petitions/parts/PreviewFrame";
import { A4GeneralView } from "@/components/petitions/A4GeneralView";
import type { PetitionStatus } from "@/types/petition";

function mapStatus(name: string): PetitionStatus {
  const n = name.toLowerCase();
  if (n.includes("approve") || n.includes("onay")) return "approved";
  if (n.includes("reject") || n.includes("red")) return "rejected";
  if (n.includes("draft") || n.includes("taslak")) return "draft";
  return "review";
}

export default async function PetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { T, lang } = await getT();
  const form = await Forms.byId(Number(id));

  const status = mapStatus(form.formStatusName);
  const statusLabel =
    status === "review" ? T("İncelemede", "In review")
    : status === "approved" ? T("Onaylandı", "Approved")
    : status === "rejected" ? T("Reddedildi", "Rejected")
    : T("Taslak", "Draft");

  const code = `${form.formTypeName.slice(0, 3).toUpperCase()}-${String(form.id).padStart(4, "0")}`;

  return (
    <div className="flex flex-col">
      <div className="px-7 md:px-9 pt-5 pb-3 flex items-center gap-4 border-b border-line bg-surface">
        <Link href="/petitions" className="text-xs text-ink-3 inline-block">
          ← {T("Dilekçelere dön", "Back to petitions")}
        </Link>
        <div className="flex-1" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">{code}</span>
        <span className="text-xs text-ink-3 tabular-nums">{formatDate(form.formDate, lang)}</span>
        <Badge tone={status}>{statusLabel}</Badge>
      </div>

      <PreviewFrame label={T("Dilekçe Önizleme — A4", "Petition Preview — A4")}>
        <A4GeneralView
          lang={lang}
          data={{
            studentNumber: form.studentNumber,
            petitionDate: form.formDate,
            fullName: `${form.studentName} ${form.studentSurname}`,
            facultyEnrollments: "1",
            department: form.studentDepartment,
            semester: String(form.numOfSemesters),
            gpa: String(form.studentGpa),
            phone: form.studentPhone,
            email: form.studentEmail,
            subject: form.subject ?? "",
            body: form.body ?? "",
            routeReason: form.routeReason ?? "",
            advisor: form.studentAdvisor,
          }}
        />
      </PreviewFrame>
    </div>
  );
}
