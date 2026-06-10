import type { Locale } from "@/types/petition";

export interface A4IlisikKesmeData {
  fullName: string;
  studentNumber: string;
  faculty: string;
  department: string;
  scholarship: string;
  address: string;
  phone: string;
  petitionDate: string;
  reasonTransfer: boolean;
  transferUniversity: string;
  reasonSFL: boolean;
  reasonFinancial: boolean;
  reasonLYS: boolean;
  lysUniversity: string;
  reasonDissatisfaction: boolean;
  dissatisfactionDetails: string;
  reasonOther: boolean;
  otherDetails: string;
}

interface Props {
  data: A4IlisikKesmeData;
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

const topDateStyle: React.CSSProperties = { textAlign: "right", fontSize: 13, marginBottom: 24 };
const headerLineStyle: React.CSSProperties = { fontSize: 14, fontWeight: 700, margin: "18px 0 4px" };
const headerLineEnStyle: React.CSSProperties = { fontSize: 12.5, fontStyle: "italic", color: "#222", margin: "0 0 22px" };
const blankInlineStyle: React.CSSProperties = { borderBottom: "1px dotted #555", display: "inline-block", minWidth: 200, padding: "0 6px", margin: "0 4px", textAlign: "center" };
const bodyTextStyle: React.CSSProperties = { fontSize: 13, lineHeight: 1.6, textAlign: "justify", margin: "10px 0", textIndent: 24 };
const bodyTextEnStyle: React.CSSProperties = { ...bodyTextStyle, fontStyle: "italic", color: "#333" };
const signatureBlockStyle: React.CSSProperties = { textAlign: "right", marginTop: 60, fontSize: 12.5 };
const ogrenciTitle: React.CSSProperties = { textDecoration: "underline", fontWeight: 700, fontSize: 13.5, marginTop: 18, marginBottom: 8 };

const fieldRow: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 };
const labelTrStyle: React.CSSProperties = { fontWeight: 700, whiteSpace: "nowrap", fontSize: 13, minWidth: 80 };
const labelEnStyle: React.CSSProperties = { fontWeight: 400, fontStyle: "italic", whiteSpace: "nowrap", fontSize: 12, color: "#444" };
const fillBlank: React.CSSProperties = { flex: 1, borderBottom: "1px dotted #555", paddingLeft: 6, minHeight: 14, fontSize: 13 };
const reasonsTitleStyle: React.CSSProperties = { textDecoration: "underline", fontWeight: 700, fontSize: 13, marginTop: 16, marginBottom: 8 };

const reasonRow: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8, fontSize: 12.5 };
const checkBox: React.CSSProperties = { display: "inline-block", width: 12, height: 12, border: "1px solid #111", background: "#fff", marginTop: 3, flexShrink: 0 };
const checkBoxFilled: React.CSSProperties = { ...checkBox, background: "#111", position: "relative" };
const reasonText: React.CSSProperties = { flex: 1 };
const reasonEnStyle: React.CSSProperties = { fontStyle: "italic", color: "#444", display: "block", fontSize: 11.5 };
const reasonInlineBlank: React.CSSProperties = { borderBottom: "1px dotted #555", display: "inline-block", minWidth: 140, padding: "0 4px", textAlign: "center", fontSize: 12 };

const opinionBoxStyle: React.CSSProperties = { border: "1px solid #111", marginTop: 8, minHeight: 90, padding: "8px 10px", background: "#fff" };
const opinionLabelStyle: React.CSSProperties = { fontWeight: 700, fontSize: 13, marginTop: 18 };
const opinionLabelEnStyle: React.CSSProperties = { fontStyle: "italic", color: "#444", fontSize: 11.5 };

export function A4IlisikKesmeView({ data: v, lang }: Props) {
  const t = (tr: string, en: string) => (lang === "tr" ? tr : en);
  const Check = (on: boolean) => <span style={on ? checkBoxFilled : checkBox} />;

  return (
    <div className="a4">
      <div style={topDateStyle}>{fmtDate(v.petitionDate, lang)}</div>

      <div style={headerLineStyle}>
        IŞIK ÜNİVERSİTESİ
        <span style={blankInlineStyle}>{v.faculty}</span>
        DEKANLIĞI&apos;NA,
      </div>
      <div style={headerLineEnStyle}>
        <em>To Işık University, Faculty Of</em>
        <span style={blankInlineStyle}>{v.faculty}</span>
        ,
      </div>

      <p style={bodyTextStyle}>
        Üniversitemizden kaydımın silinmesi hususunda gereğini saygılarımla arz ederim.
      </p>
      <p style={bodyTextEnStyle}>
        <em>I would like to request cancelation of my university registration. Sincerely,</em>
      </p>

      <div style={signatureBlockStyle}>
        <div style={{ borderBottom: "1px dotted #555", display: "inline-block", minWidth: 180, padding: "0 4px", marginBottom: 2 }}>&nbsp;</div>
        <div><b>İMZA</b> <em style={{ color: "#444" }}>/ Signature</em></div>
      </div>

      <div style={ogrenciTitle}>
        Öğrencinin <em style={{ fontWeight: 400, color: "#444" }}>/ Student</em>
      </div>

      {[
        { tr: "Adı Soyadı", en: "Name – Surname", val: v.fullName },
        { tr: "Öğrenci No", en: "ID Number", val: v.studentNumber },
        { tr: "Fakültesi", en: "Faculty", val: v.faculty },
        { tr: "Bölümü", en: "Department", val: v.department },
        { tr: "Burs Durumu", en: "Scholarship Status", val: v.scholarship },
        { tr: "Adresi", en: "Postal Address", val: v.address },
        { tr: "Telefon No", en: "Phone", val: v.phone },
      ].map((row) => (
        <div key={row.tr} style={fieldRow}>
          <span style={labelTrStyle}>{row.tr}</span>
          <span style={labelEnStyle}>/ {row.en}</span>
          <span style={{ ...labelTrStyle, minWidth: 0, fontWeight: 400 }}>:</span>
          <span style={fillBlank}>{row.val}</span>
        </div>
      ))}

      <div style={reasonsTitleStyle}>
        Kayıt Silme Nedenleri <em style={{ fontWeight: 400, color: "#444" }}>/ Reasons of Cancelation:</em>
      </div>

      <div style={reasonRow}>
        {Check(v.reasonTransfer)}
        <span style={reasonText}>
          <b><span style={reasonInlineBlank}>{v.transferUniversity}</span> Üniversitesine yatay geçiş yaptım.</b>
          <span style={reasonEnStyle}>Transferring to another university (please mention the name of the university)</span>
        </span>
      </div>

      <div style={reasonRow}>
        {Check(v.reasonSFL)}
        <span style={reasonText}>
          <b>SFL&apos;de başarısızlık</b>
          <span style={reasonEnStyle}>Lack of success at SFL</span>
        </span>
      </div>

      <div style={reasonRow}>
        {Check(v.reasonFinancial)}
        <span style={reasonText}>
          <b>Mali nedenler</b>
          <span style={reasonEnStyle}>Financial issues</span>
        </span>
      </div>

      <div style={reasonRow}>
        {Check(v.reasonLYS)}
        <span style={reasonText}>
          <b>LYS ile <span style={reasonInlineBlank}>{v.lysUniversity}</span> Üniversitesine yerleştim.</b>
          <span style={reasonEnStyle}>Placed at another university through LYS</span>
        </span>
      </div>

      <div style={reasonRow}>
        {Check(v.reasonDissatisfaction)}
        <span style={reasonText}>
          <b>Memnuniyetsizlik (Nedeni) : <span style={reasonInlineBlank}>{v.dissatisfactionDetails}</span></b>
          <span style={reasonEnStyle}>Dissatisfaction (Please explain)</span>
        </span>
      </div>

      <div style={reasonRow}>
        {Check(v.reasonOther)}
        <span style={reasonText}>
          <b>Diğer (Açıklayınız) : <span style={reasonInlineBlank}>{v.otherDetails}</span></b>
          <span style={reasonEnStyle}>Others (Please explain)</span>
        </span>
      </div>

      <div style={{ ...reasonRow, marginTop: 18 }}>
        {Check(false)}
        <span style={reasonText}>
          <b>Dekan Onayı</b> <em style={{ color: "#444" }}>/ Approval of Dean</em>
        </span>
      </div>

      <div style={opinionLabelStyle}>
        Görüş <em style={opinionLabelEnStyle}>/ Opinion:</em>
      </div>
      <div style={opinionBoxStyle} />

      <div className="doc-footer" style={{ marginTop: 24 }}>
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
