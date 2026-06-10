import Link from "next/link";
import { Badge } from "@/components/ui/Misc";
import { getT } from "@/lib/lang-server";
import { Forms } from "@/lib/api/forms";
import { getEkSinav44cDetailByFormId } from "@/lib/api/formEkSinav44cDetails";
import { getEkSinav44cCoursesByFormId } from "@/lib/api/formEkSinav44cCourses";
import { getMazeretSinaviFinalDetailByFormId } from "@/lib/api/formMazeretSinaviFinalDetails";
import { getIlisikKesmeDetailByFormId } from "@/lib/api/formIlisikKesmeDetails";
import { formatDate } from "@/lib/format";
import { PreviewFrame } from "@/components/petitions/parts/PreviewFrame";
import { A4GeneralView } from "@/components/petitions/A4GeneralView";
import { A4EkSinav44cView } from "@/components/petitions/A4EkSinav44cView";
import { A4MazeretSinaviFinalView } from "@/components/petitions/A4MazeretSinaviFinalView";
import { A4IlisikKesmeView } from "@/components/petitions/A4IlisikKesmeView";
import type { FormDto, Locale, PetitionStatus } from "@/types/petition";

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
        <LayoutPreview form={form} lang={lang} />
      </PreviewFrame>
    </div>
  );
}

async function LayoutPreview({ form, lang }: { form: FormDto; lang: Locale }) {
  const fullName = `${form.studentName} ${form.studentSurname}`.trim();

  switch (form.layoutKey) {
    case "ek-sinav-44c": {
      const [detail, courses] = await Promise.all([
        getEkSinav44cDetailByFormId(form.id),
        getEkSinav44cCoursesByFormId(form.id),
      ]);
      return (
        <A4EkSinav44cView
          lang={lang}
          data={{
            fullName,
            studentNumber: form.studentNumber,
            department: form.studentDepartment,
            phone: form.studentPhone,
            email: form.studentEmail,
            petitionDate: form.formDate,
            yearStart: detail?.yearStart ?? "",
            yearEnd: detail?.yearEnd ?? "",
            academicTerm: detail?.academicTerm ?? "",
            courses: courses.map((c) => ({ code: c.courseCode, takenBefore: c.takenBefore })),
          }}
        />
      );
    }

    case "mazeret-sinavi-final": {
      const detail = await getMazeretSinaviFinalDetailByFormId(form.id);
      return (
        <A4MazeretSinaviFinalView
          lang={lang}
          data={{
            fullName,
            studentNumber: form.studentNumber,
            phone: form.studentPhone,
            email: form.studentEmail,
            petitionDate: form.formDate,
            faculty: detail?.faculty ?? "",
            excuseDates: detail?.excuseDates ?? "",
            courseCodesAndSections: detail?.courseCodesAndSections ?? "",
            excuseDetails: detail?.excuseDetails ?? "",
            attachedDocuments: detail?.attachedDocuments ?? "",
            hasHealthReport: detail?.hasHealthReport ?? false,
            healthReportInstitution: detail?.healthReportInstitution ?? "",
            healthReportDate: detail?.healthReportDate ?? "",
            healthReportDuration: detail?.healthReportDuration ?? "",
          }}
        />
      );
    }

    case "ilisik-kesme": {
      const detail = await getIlisikKesmeDetailByFormId(form.id);
      return (
        <A4IlisikKesmeView
          lang={lang}
          data={{
            fullName,
            studentNumber: form.studentNumber,
            faculty: detail?.faculty ?? form.studentFaculty,
            department: form.studentDepartment,
            scholarship: detail?.scholarship ?? form.scholarshipStatus,
            address: detail?.address ?? form.studentAddress,
            phone: form.studentPhone,
            petitionDate: form.formDate,
            reasonTransfer: detail?.reasonTransfer ?? false,
            transferUniversity: detail?.transferUniversity ?? "",
            reasonSFL: detail?.reasonSFL ?? false,
            reasonFinancial: detail?.reasonFinancial ?? false,
            reasonLYS: detail?.reasonLYS ?? false,
            lysUniversity: detail?.lysUniversity ?? "",
            reasonDissatisfaction: detail?.reasonDissatisfaction ?? false,
            dissatisfactionDetails: detail?.dissatisfactionDetails ?? "",
            reasonOther: detail?.reasonOther ?? false,
            otherDetails: detail?.otherDetails ?? "",
          }}
        />
      );
    }

    case "general":
    case "cancellation":
    default:
      return (
        <A4GeneralView
          lang={lang}
          data={{
            studentNumber: form.studentNumber,
            petitionDate: form.formDate,
            fullName,
            facultyEnrollments: "1",
            department: form.studentDepartment,
            semester: String(form.numOfSemesters),
            gpa: String(form.studentGpa),
            phone: form.studentPhone,
            email: form.studentEmail,
            subject: form.subject ?? "",
            body: form.body ?? "",
            advisor: form.studentAdvisor,
          }}
        />
      );
  }
}
