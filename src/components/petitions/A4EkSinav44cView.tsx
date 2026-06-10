import type { Locale } from "@/types/petition";

export interface A4EkSinav44cData {
  fullName: string;
  studentNumber: string;
  department: string;
  phone: string;
  email: string;
  petitionDate: string;
  yearStart: string;
  yearEnd: string;
  academicTerm: string;
  courses: { code: string; takenBefore: string }[];
}

interface Props {
  data: A4EkSinav44cData;
  lang: Locale;
}

const ROW_COUNT = 15;

function fmtDate(iso: string, lang: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const parts = iso.split("-");
    if (parts.length === 3)
      return `${parts[2].slice(0, 2)}/${parts[1]}/${parts[0]}`;
    return iso;
  }
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

const headStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 18,
  lineHeight: 1.4,
};
const tcStyle: React.CSSProperties = { fontWeight: 700, fontSize: 13.5 };
const uniStyle: React.CSSProperties = {
  fontWeight: 700,
  textDecoration: "underline",
  fontSize: 14,
  letterSpacing: "0.02em",
};
const facStyle: React.CSSProperties = {
  fontWeight: 700,
  textDecoration: "underline",
  fontSize: 13.5,
  marginTop: 2,
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  textAlign: "justify",
  margin: "14px 0",
  textIndent: 24,
};
const blankStyle: React.CSSProperties = {
  borderBottom: "1px dotted #555",
  padding: "0 6px",
  margin: "0 2px",
  display: "inline-block",
  minWidth: 64,
  textAlign: "center",
};

const dateLineStyle: React.CSSProperties = {
  textAlign: "right",
  margin: "14px 0 0",
  fontSize: 13,
};
const imzaLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11.5,
  color: "#555",
  marginTop: 2,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 14,
  fontSize: 12.5,
  fontFamily: "var(--font-sans)",
};
const cellStyle: React.CSSProperties = {
  border: "1px solid #111",
  padding: "5px 8px",
  verticalAlign: "top",
  background: "#fff",
};
const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  background: "#f3f4f6",
  fontWeight: 600,
  textAlign: "left",
};
const labelCellStyle: React.CSSProperties = {
  ...cellStyle,
  width: "35%",
  fontWeight: 600,
  background: "#fafafa",
};
const numCellStyle: React.CSSProperties = {
  ...cellStyle,
  width: 48,
  textAlign: "center",
};

export function A4EkSinav44cView({ data: v, lang }: Props) {
  const t = (tr: string, en: string) => (lang === "tr" ? tr : en);

  const rows = Array.from(
    { length: ROW_COUNT },
    (_, i) => v.courses[i] ?? { code: "", takenBefore: "" },
  );

  return (
    <div className="a4">
      <div style={headStyle}>
        <div style={tcStyle}>T.C.</div>
        <div style={uniStyle}>IŞIK ÜNİVERSİTESİ</div>
        <div style={facStyle}>( İİSBF Fakültesi Dekanlığı&apos;na )</div>
      </div>

      <p style={bodyTextStyle}>
        <span style={blankStyle}>{v.yearStart || "20"}</span>
        {" – "}
        <span style={blankStyle}>{v.yearEnd || "20…."}</span>{" "}
        {t("Eğitim Öğretim yılı", "Academic year")}{" "}
        <span style={blankStyle}>{v.academicTerm}</span>
        {t(
          " yarıyılı sonunda azami öğrenim süresini tamamlamaktayım. Aşağıda belirtmiş olduğum derslerden 2547 sayılı Kanun'un 44. maddesinin (c) bendi ve Işık Üniversitesinin Ön lisans ve Lisans Öğretiminde Azami Öğrenim Süreleri Sonunda Verilecek Sınav Haklarına Dair Uygulama Esasları gereğince ek sınav haklarından faydalanmak istiyorum.",
          " term, I have completed the maximum study period. I would like to request additional examination rights for the courses listed below per Article 44(c) of Law No. 2547 and the relevant Işık University regulations.",
        )}
      </p>
      <p style={bodyTextStyle}>
        {t(
          "Gereğini bilgilerinize arz ederim.",
          "I respectfully submit this for your consideration.",
        )}
      </p>

      <div style={dateLineStyle}>
        <span>{fmtDate(v.petitionDate, lang) || "…. /…./ 20…."}</span>
        <span style={imzaLabelStyle}>{t("İmza", "Signature")}</span>
      </div>

      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={labelCellStyle}>
              {t("Başvuru sahibinin:", "Applicant:")}
            </td>
            <td style={cellStyle} />
          </tr>
          <tr>
            <td style={labelCellStyle}>{t("Adı Soyadı", "Full Name")}</td>
            <td style={cellStyle}>{v.fullName}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>
              {t("Öğrenci Numarası", "Student Number")}
            </td>
            <td style={cellStyle}>{v.studentNumber}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>
              {t("Bölüm / Program", "Department / Program")}
            </td>
            <td style={cellStyle}>{v.department}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>{t("Tel No", "Phone")}</td>
            <td style={cellStyle}>{v.phone}</td>
          </tr>
          <tr>
            <td style={labelCellStyle}>{t("Mail", "Email")}</td>
            <td style={cellStyle}>{v.email}</td>
          </tr>
        </tbody>
      </table>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle} colSpan={3}>
              {t(
                "Ek Sınav için başvurulan derslerin:",
                "Courses requested for extra exam:",
              )}
            </th>
          </tr>
          <tr>
            <th style={{ ...headerCellStyle, width: 48, textAlign: "center" }}>
              {t("Sıra No", "#")}
            </th>
            <th style={headerCellStyle}>{t("Ders Kodu", "Course Code")}</th>
            <th style={headerCellStyle}>
              {t("Dersi Daha Önce Aldı mı?", "Taken Before?")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={numCellStyle}>{i + 1}</td>
              <td style={cellStyle}>{row.code}</td>
              <td style={cellStyle}>{row.takenBefore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="doc-footer">
        <span className="havale">
          <b>{t("Dekanlığa havale nedeni:", "Reason for routing to Dean:")}</b>
        </span>
        <span className="opt">
          {t("FYK'na karar için", "For FYK decision")}{" "}
          <span className="check-box" />
        </span>
        <span className="opt">
          {t("Dosyalama için", "For filing")} <span className="check-box" />
        </span>
      </div>
    </div>
  );
}
