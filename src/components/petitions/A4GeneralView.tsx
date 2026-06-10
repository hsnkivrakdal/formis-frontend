import { DocRow } from "./parts/DocRow";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types/petition";

export interface A4GeneralData {
  studentNumber: string;
  petitionDate: string;
  fullName: string;
  facultyEnrollments: string;
  department: string;
  semester: string;
  gpa: string;
  phone: string;
  email: string;
  subject: string;
  body: string;
  routeReason?: string;
  advisor?: string;
  advisorOpinion?: string;
  departmentOpinion?: string;
}

interface Props {
  data: A4GeneralData;
  lang: Locale;
  /** field key currently being edited — adds 'typing' highlight on the corresponding row */
  hi?: string | null;
}

function fmtDisplayDate(iso: string, lang: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    // Probably "YYYY-MM-DD" without time; do a naive DD/MM/YYYY
    const parts = iso.split("-");
    if (parts.length === 3) return `${parts[2].slice(0, 2)}/${parts[1]}/${parts[0]}`;
    return iso;
  }
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function A4GeneralView({ data: v, lang, hi = null }: Props) {
  const t = (tr: string, en: string) => (lang === "tr" ? tr : en);
  return (
    <div className="a4">
      <div className="doc-head">
        <div className="uni">
          IŞIK ÜNİVERSİTESİ{" "}
          <span className="light">
            {t("İKTİSADİ, İDARİ VE SOSYAL BİLİMLER FAKÜLTESİ", "FACULTY OF ECONOMICS, ADMINISTRATIVE AND SOCIAL SCIENCES")}
          </span>
        </div>
        <div className="doc-title">{t("DİLEKÇE FORMU", "PETITION FORM")}</div>
      </div>
      <div className="meta-grid">
        <DocRow lab={t("Öğrenci No", "Student ID")} val={v.studentNumber} hi={hi === "studentNumber"} />
        <DocRow lab={t("Dilekçe tarihi", "Petition date")} val={fmtDisplayDate(v.petitionDate, lang)} hi={hi === "petitionDate"} />
        <DocRow lab={t("Adı ve Soyadı", "Full name")} val={v.fullName} hi={hi === "fullName"} />
        <DocRow lab={t("Fakülte kayıt sayısı", "Faculty enrollments")} val={v.facultyEnrollments} hi={hi === "facultyEnrollments"} />
        <DocRow lab={t("Bölümü", "Department")} val={v.department} hi={hi === "department"} />
        <span />
        <DocRow
          lab={t("Dönem / GNO", "Semester / GPA")}
          val={v.semester && v.gpa ? `${v.semester} / ${v.gpa}` : ""}
          hi={hi === "semester" || hi === "gpa"}
        />
        <span />
        <DocRow lab={t("Tel No", "Phone")} val={v.phone} hi={hi === "phone"} />
        <span />
        <DocRow lab={t("E-posta", "Email")} val={v.email} hi={hi === "email"} />
        <span />
      </div>
      <div className="body-label">
        {t("Konu:", "Subject:")} {v.subject}
      </div>
      <div className={cn("body-box", !v.body && "empty", hi === "body" && "typing")}>
        {v.body || t("Bu alan, dilekçe metniniz girildikçe gerçek zamanlı doldurulacaktır…", "This area will fill in real time as you type your petition…")}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 12.5, fontStyle: "italic" }}>
        <span>{t("Not: Gerekçelerin devamı için ayrı bir sayfa kullanınız.", "Note: Use a separate page for continuation of justifications.")}</span>
        <span>{t("Saygılarımla", "Sincerely")}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, fontSize: 12.5 }}>
        <span>
          <b>{t("Eki:", "Attachments:")}</b> {t("Transkript ve CCR", "Transcript and CCR")}
        </span>
        <span style={{ borderBottom: "1px dotted #555", width: 200, textAlign: "center", paddingBottom: 2 }}>
          {t("(imza)", "(signature)")}
        </span>
      </div>
      <div className="advisor-box">
        <div className="adv-line">
          <span className="adv-lab">{t("Danışmanın Adı", "Advisor name")}</span>
          <span className="adv-val">{v.advisor ?? ""}</span>
        </div>
        <div className="adv-line stacked">
          <span className="adv-lab">{t("Danışmanın açıklamalı görüşü", "Advisor's detailed opinion")}</span>
          <span className="adv-val multi">{v.advisorOpinion ?? ""}</span>
        </div>
        <div className="adv-grid">
          <div className="adv-line">
            <span className="adv-lab">{t("GNO", "GPA")}</span>
            <span className="adv-val" />
          </div>
          <div className="adv-line">
            <span className="adv-lab">{t("Öğrencinin dönem sayısı", "Student's semester count")}</span>
            <span className="adv-val" />
          </div>
          <span className="adv-imza">{t("(imza)", "(signature)")}</span>
        </div>
        <div className="adv-line stacked">
          <span className="adv-lab">{t("Bölüm Görüşü (gerekirse)", "Department opinion (if needed)")}</span>
          <span className="adv-val multi">{v.departmentOpinion ?? ""}</span>
        </div>
      </div>
      <div className="doc-footer">
        <span className="havale">
          <b>{t("Dekanlığa havale nedeni:", "Reason for routing to Dean:")}</b>
        </span>
        <span className="opt">
          {t("FYK'na karar için", "For FYK decision")} <span className="check-box" />
        </span>
        <span className="opt">
          {t(" Dosyalama için", "For filing")} <span className="check-box" />
        </span>
      </div>
    </div>
  );
}
