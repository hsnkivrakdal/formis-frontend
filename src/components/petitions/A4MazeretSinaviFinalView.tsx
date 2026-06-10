import type { Locale } from "@/types/petition";

export interface A4MazeretSinaviFinalData {
  fullName: string;
  studentNumber: string;
  phone: string;
  email: string;
  petitionDate: string;
  faculty: string;
  excuseDates: string;
  courseCodesAndSections: string;
  excuseDetails: string;
  attachedDocuments: string;
  hasHealthReport: boolean;
  healthReportInstitution: string;
  healthReportDate: string;
  healthReportDuration: string;
}

interface Props {
  data: A4MazeretSinaviFinalData;
  lang: Locale;
}

function fmtDate(iso: string, lang: Locale): string {
  if (!iso) return "…./…./20….";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
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

const topDateStyle: React.CSSProperties = { textAlign: "right", fontSize: 13, marginBottom: 28 };
const facultyLineStyle: React.CSSProperties = { textAlign: "center", fontSize: 14, fontWeight: 700, margin: "22px 0 28px", letterSpacing: "0.01em" };
const blankInlineStyle: React.CSSProperties = { borderBottom: "1px dotted #555", display: "inline-block", minWidth: 220, padding: "0 6px", margin: "0 4px", textAlign: "center" };
const bodyTextStyle: React.CSSProperties = { fontSize: 13, lineHeight: 1.6, textAlign: "justify", margin: "14px 0", textIndent: 24 };
const labelCell: React.CSSProperties = { fontWeight: 500, whiteSpace: "nowrap", fontSize: 13 };
const fillBlank: React.CSSProperties = { flex: 1, borderBottom: "1px dotted #555", paddingLeft: 6, minHeight: 16, fontSize: 13 };
const fieldRow: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: 6 };
const flexCell: React.CSSProperties = { flex: 1, display: "flex", alignItems: "baseline", gap: 6 };

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: 14, fontSize: 12.5, fontFamily: "var(--font-sans)" };
const cellStyle: React.CSSProperties = { border: "1px solid #111", padding: "6px 8px", verticalAlign: "top", background: "#fff", minHeight: 30 };
const headerCellStyle: React.CSSProperties = { ...cellStyle, background: "#f3f4f6", fontWeight: 600, textAlign: "center" };
const labelCellStyle: React.CSSProperties = { ...cellStyle, width: "38%", fontWeight: 600, background: "#fafafa" };
const tableTitleStyle: React.CSSProperties = { textAlign: "center", fontSize: 12.5, fontWeight: 700, marginTop: 18, marginBottom: 4 };
const healthNoteStyle: React.CSSProperties = { textAlign: "center", fontSize: 11.5, fontStyle: "italic", margin: "16px 0 0", color: "#444" };

export function A4MazeretSinaviFinalView({ data: v, lang }: Props) {
  const t = (tr: string, en: string) => (lang === "tr" ? tr : en);

  return (
    <div className="a4">
      <div style={topDateStyle}>
        <b>{t("Tarih:", "Date:")}</b> {fmtDate(v.petitionDate, lang)}
      </div>

      <div style={facultyLineStyle}>
        {t("Işık Üniversitesi", "Işık University")}
        {" "}
        <span style={blankInlineStyle}>{v.faculty}</span>
        {" "}
        {t("Dekanlığına", "Dean's Office")}
      </div>

      <p style={bodyTextStyle}>
        {t(
          "Mazeretim nedeni ile aşağıda belirttiğim derslerimin Final Mazeret Sınavlarına girmek istiyorum. Üniversitemizin mazeret sınavı uygulama esasları doğrultusunda durumumun değerlendirilmesi için gereğini saygılarımla arz ederim.",
          "Due to my excuse, I would like to take the make-up final exams for the courses listed below. I respectfully request that my situation be evaluated in accordance with the university's make-up exam regulations.",
        )}
      </p>

      <div style={{ ...fieldRow, marginTop: 28 }}>
        <span style={labelCell}>{t("İmza:", "Signature:")}</span>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
        <div style={flexCell}>
          <span style={labelCell}>{t("Ad Soyad:", "Full Name:")}</span>
          <span style={fillBlank}>{v.fullName}</span>
        </div>
        <div style={flexCell}>
          <span style={labelCell}>{t("E-mail:", "E-mail:")}</span>
          <span style={fillBlank}>{v.email}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
        <div style={flexCell}>
          <span style={labelCell}>{t("Öğrenci Numarası:", "Student Number:")}</span>
          <span style={fillBlank}>{v.studentNumber}</span>
        </div>
        <div style={flexCell}>
          <span style={labelCell}>{t("Cep no:", "Mobile:")}</span>
          <span style={fillBlank}>{v.phone}</span>
        </div>
      </div>

      <div style={tableTitleStyle}>{t("Mazerete konu olan", "Subject of excuse")}</div>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={labelCellStyle}>{t("Tarih(ler)", "Date(s)")}</td>
            <td style={cellStyle}>{v.excuseDates}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>{t("Ders kodları ve şubeleri", "Course codes and sections")}</td>
            <td style={cellStyle}>{v.courseCodesAndSections}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>{t("Mazerete konu olayın detaylı (tarih & saat vb. dahil) açıklaması", "Detailed explanation of the incident (incl. date & time)")}</td>
            <td style={{ ...cellStyle, minHeight: 90, whiteSpace: "pre-wrap" }}>{v.excuseDetails}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>{t("Ekte verilen belgeler", "Attached documents")}</td>
            <td style={{ ...cellStyle, whiteSpace: "pre-wrap" }}>{v.attachedDocuments}</td>
          </tr>
        </tbody>
      </table>

      {v.hasHealthReport ? (
        <>
          <div style={healthNoteStyle}>
            {t("(Mazeret gerekçesi sağlık ise aşağıdaki bilgiler de doldurulacaktır)", "(If the excuse is health-related, fill in the section below)")}
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle} colSpan={2}>{t("Sağlık Raporuna İlişkin Bilgiler", "Health Report Information")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={labelCellStyle}>{t("Rapor alınan kurumun açık adı", "Issuing institution")}</td>
                <td style={cellStyle}>{v.healthReportInstitution}</td>
              </tr>
              <tr>
                <td style={labelCellStyle}>{t("Raporun imzalandığı tarih", "Date of signature")}</td>
                <td style={cellStyle}>{v.healthReportDate}</td>
              </tr>
              <tr>
                <td style={labelCellStyle}>{t("Rapor süresi", "Duration")}</td>
                <td style={cellStyle}>{v.healthReportDuration}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : null}

      <div className="doc-footer">
        <span className="havale">
          <b>{t("Dekanlığa havale nedeni:", "Reason for routing to Dean:")}</b>
        </span>
          <span className="opt">
            {t("FYK'na karar için", "For FYK decision")} <span className="check-box" />
          </span>
          <span className="opt">
            {t("Dosyalama için", "For filing")} <span className="check-box" />
          </span>
      </div>
    </div>
  );
}
