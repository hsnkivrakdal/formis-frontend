"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Misc";
import { I } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface FormVals {
  ogrenciNo: string; tarih: string; adSoyad: string;
  donem: string; gno: string; telefon: string; eposta: string;
  fakulteKayit: string; konu: string; metin: string; havale: string;
}
const PROFILE = {
  ogrenciNo: "20210715042", adSoyad: "Elif Yılmaz",
  bolum: { tr: "Yönetim Bilişim Sistemleri", en: "Management Information Systems" },
  donem: "8", gno: "3.42", telefon: "+90 532 415 87 22", eposta: "elif.yilmaz@isik.edu.tr",
};

export default function NewPetitionPage() {
  const { lang, T } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  
  // 1. DÜZELTME: bolum alanını ana state'ten çıkardık çünkü türetilebilir bir veri.
  const [v, setV] = useState<FormVals>({
    ogrenciNo: PROFILE.ogrenciNo, tarih: today, adSoyad: PROFILE.adSoyad,
    donem: PROFILE.donem, gno: PROFILE.gno,
    telefon: PROFILE.telefon, eposta: PROFILE.eposta,
    fakulteKayit: "1", konu: "", metin: "", havale: "",
  });
  
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [hi, setHi] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.78);
  const [saved, setSaved] = useState(true);

  // 2. DÜZELTME: İlk useEffect tamamen silindi!
  // 3. DÜZELTME: useEffect artık senkronize setSaved(false) YAPMIYOR, sadece zamanlayıcıyı yönetiyor.
  useEffect(() => {
    if (saved) return; // Zaten kaydedildiyse işlem yapma
    const t = setTimeout(() => setSaved(true), 900); 
    return () => clearTimeout(t);
  }, [v, saved]);

  function set<K extends keyof FormVals>(k: K, val: FormVals[K]) {
    setSaved(false); // Kaydediliyor durumunu olay anında (synchronous) başlatıyoruz
    setV(s => ({ ...s, [k]: val }));
    setTouched(s => ({ ...s, [k]: true }));
    setHi(k as string); 
    setTimeout(() => setHi(h => h === k ? null : h), 1300);
  }

  // Bölüm verisini state yerine doğrudan dilden türetiyoruz
  const guncelBolum = PROFILE.bolum[lang];

  const errs: Partial<Record<keyof FormVals, string>> = {};
  if (!v.konu.trim()) errs.konu = T("Zorunlu alan", "Required");
  if (!v.metin.trim()) errs.metin = T("Zorunlu alan", "Required");
  if (v.eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.eposta)) errs.eposta = T("Geçerli bir e-posta girin", "Enter a valid email");
  if (v.telefon && !/^[+0-9\s()-]{7,}$/.test(v.telefon)) errs.telefon = T("Geçerli bir telefon numarası girin", "Enter a valid phone");
  const errCount = Object.keys(errs).length;

  const fmtDate = (d: string) => { if (!d) return ""; const [y, m, day] = d.split("-"); return `${day}/${m}/${y}`; };

  // Form verisini backend'e gönderirken bölümü eklemek istersen:
  // const payload = { ...v, bolum: guncelBolum };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(420px,1fr)_minmax(560px,1.1fr)] min-h-[calc(100vh-56px)]">
      {/* EDITOR */}
      <div className="bg-[var(--color-surface-2)] border-r border-[var(--color-line)] p-7 md:p-9 overflow-y-auto max-h-[calc(100vh-56px)]">
        <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[var(--color-line)]">
          <div>
            <Link href="/petitions" className="text-xs text-[var(--color-ink-3)] inline-block mb-1.5">← {T("Dilekçe türleri", "Petition types")}</Link>
            <h2 className="font-serif text-[22px] font-medium tracking-tight">{T("Genel Dilekçe Formu", "General Petition Form")}</h2>
            <div className="text-xs text-[var(--color-ink-3)] mt-0.5">{T("Otomatik kaydedildi", "Autosaved")} · <span className="font-mono">DLK-01-2026</span></div>
          </div>
          {/* v nesnesine guncelBolum'u de sayarak dinamik uzunluk veriyoruz */}
          <div className="font-mono text-xs text-[var(--color-ink-3)] tracking-wider">{Object.values(v).filter(Boolean).length + 1}/12 {T("alan", "fields")}</div>
        </div>

        {showErrors && errCount > 0 && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-md bg-amber-100 border border-amber-200 text-amber-900 text-xs dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200">
            {I.alert} {T(`${errCount} alan eksik veya hatalı.`, `${errCount} fields are missing or invalid.`)}
          </div>
        )}

        <Section num="01" title={T("Öğrenci Bilgileri", "Student Information")} hint={T("Profilinizden otomatik dolduruldu", "Auto-filled from your profile")}>
          <Field label={T("Öğrenci No", "Student ID")} required badge="PROFILE"><Input value={v.ogrenciNo} disabled /></Field>
          <Field label={T("Dilekçe Tarihi", "Petition Date")} required><Input type="date" value={v.tarih} onChange={e => set("tarih", e.target.value)} /></Field>
          <Field full label={T("Adı ve Soyadı", "Full Name")} required badge="PROFILE"><Input value={v.adSoyad} disabled /></Field>
          {/* v.bolum yerine doğrudan dilden türeyen guncelBolum değişkenini verdik */}
          <Field full label={T("Bölümü", "Department")} required badge="PROFILE"><Input value={guncelBolum} disabled /></Field>
          <Field label={T("Dönem Sayısı", "Semester #")} required badge="PROFILE"><Input value={v.donem} disabled /></Field>
          <Field label={T("GNO", "GPA")} required badge="PROFILE"><Input value={v.gno} disabled /></Field>
          <Field full label={T("Fakülte Kayıt Sayısı", "Faculty Enrollments")}><Input type="number" value={v.fakulteKayit} onChange={e => set("fakulteKayit", e.target.value)} /></Field>
          <Field label={T("Telefon", "Phone")} required err={(touched.telefon || showErrors) ? errs.telefon : null}>
            <Input value={v.telefon} onChange={e => set("telefon", e.target.value)} aria-invalid={!!errs.telefon} />
          </Field>
          <Field label={T("E-posta", "Email")} required err={(touched.eposta || showErrors) ? errs.eposta : null}>
            <Input type="email" value={v.eposta} onChange={e => set("eposta", e.target.value)} aria-invalid={!!errs.eposta} />
          </Field>
        </Section>

        <Section num="02" title={T("Dilekçe Metni", "Petition Body")} hint={T("Talebinizi açık ve gerekçeli olarak belirtin", "State your request clearly")}>
          <Field full label={T("Konu", "Subject")} required err={(touched.konu || showErrors) ? errs.konu : null}>
            <Input value={v.konu} onChange={e => set("konu", e.target.value)} placeholder={T("Örn. Tek ders sınavı talebi", "e.g. Single-course exam request")} aria-invalid={!!errs.konu} />
          </Field>
          <Field full label={T("Dilekçe metni", "Petition text")} required hint={<span className="font-mono text-[10.5px] text-[var(--color-ink-3)]">{v.metin.length}/1500</span>} err={(touched.metin || showErrors) ? errs.metin : null}>
            <Textarea value={v.metin} maxLength={1500} onChange={e => set("metin", e.target.value)} placeholder={T("Sayın ...,\n\nTalebim aşağıdaki gibidir...", "To whom it may concern,\n\nMy request is...")} aria-invalid={!!errs.metin} />
          </Field>
          <Field full label={T("Dekanlığa havale nedeni", "Reason for routing to Dean")}>
            <Input value={v.havale} onChange={e => set("havale", e.target.value)} />
          </Field>
        </Section>

        <Section num="03" title={T("Ekler", "Attachments")} hint={T("Transkript ve CCR otomatik eklenir", "Transcript and CCR auto-attached")}>
          <div className="col-span-2 border-2 border-dashed border-[var(--color-line-2)] rounded-lg p-5 text-center text-sm text-[var(--color-ink-3)] bg-[var(--color-surface)] cursor-pointer hover:border-[var(--color-accent)] transition-colors">
            <div className="grid place-items-center mb-1.5">{I.upload}</div>
            <div><b className="text-[var(--color-ink)] font-medium">{T("Dosya yükle", "Upload file")}</b> {T("veya sürükleyip bırakın", "or drag & drop")}</div>
            <div className="text-[11px] mt-1">PDF, JPG, PNG · {T("en fazla 10 MB", "max 10 MB")}</div>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 mt-1">
            {[{name:"Transkript.pdf", size:"212 KB", auto:true},{name:"CCR_2026.pdf", size:"94 KB", auto:true}].map((a, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] text-[12.5px]">
                {I.paper}
                <span className="font-medium">{a.name}</span>
                <span className="text-[var(--color-ink-3)] font-mono text-[11px]">{a.size}</span>
                {a.auto && <Badge tone="accent" className="ml-auto text-[9px]">{T("OTOMATİK", "AUTO")}</Badge>}
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-7 pt-5 border-t border-[var(--color-line)] flex items-center gap-2.5">
          <span className="text-xs text-[var(--color-ink-3)] flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", saved ? "bg-emerald-500" : "bg-amber-500")}></span>
            {saved ? T("Tüm değişiklikler kaydedildi", "All changes saved") : T("Kaydediliyor…", "Saving…")}
          </span>
          <div className="flex-1"></div>
          <Button>{I.save}{T("Taslağı Kaydet", "Save Draft")}</Button>
          <Button variant="primary" onClick={() => setShowErrors(true)}>{I.send}{T("Danışmana Gönder", "Send to Advisor")}</Button>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="bg-zinc-200 dark:bg-zinc-800 p-8 overflow-y-auto max-h-[calc(100vh-56px)] flex flex-col items-center gap-3.5">
        <div className="flex items-center gap-2 w-full max-w-[794px] text-xs text-[var(--color-ink-3)]">
          <span className="font-mono text-[10.5px] tracking-wider uppercase">{T("Canlı Önizleme — A4", "Live Preview — A4")}</span>
          <div className="flex-1"></div>
          <div className="inline-flex border border-[var(--color-line-2)] rounded overflow-hidden bg-[var(--color-surface)]">
            {[0.6, 0.78, 1].map(z => (
              <button key={z} onClick={() => setZoom(z)} className={cn("px-2 py-0.5 text-[11px] font-mono", Math.abs(zoom-z)<0.01 ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-ink-2)]")}>{Math.round(z*100)}%</button>
            ))}
          </div>
        </div>
        <div style={{transform:`scale(${zoom})`, transformOrigin:"top center", marginBottom: -((1-zoom)*1123) + "px"}}>
          <div className="a4">
            <div className="doc-head">
              <div className="uni">IŞIK ÜNİVERSİTESİ <span className="light">İKTİSADİ, İDARİ VE SESYAL BİLİMLER FAKÜLTESİ</span></div>
              <div className="doc-title">DİLEKÇE FORMU</div>
            </div>
            <div className="meta-grid">
              <DocRow lab="Öğrenci No" val={v.ogrenciNo} hi={hi==="ogrenciNo"} />
              <DocRow lab="Dilekçe tarihi" val={fmtDate(v.tarih)} hi={hi==="tarih"} />
              <DocRow lab="Adı ve Soyadı" val={v.adSoyad} hi={hi==="adSoyad"} />
              <DocRow lab="Fakülte kayıt sayısı" val={v.fakulteKayit} hi={hi==="fakulteKayit"} />
              {/* Önizlemede de guncelBolum kullanılıyor */}
              <DocRow lab="Bölümü" val={guncelBolum} hi={hi==="bolum"} />
              <span></span>
              <DocRow lab="Dönem / GNO" val={v.donem && v.gno ? `${v.donem} / ${v.gno}` : ""} hi={hi==="donem" || hi==="gno"} />
              <span></span>
              <DocRow lab="Tel No" val={v.telefon} hi={hi==="telefon"} />
              <span></span>
              <DocRow lab="E-posta" val={v.eposta} hi={hi==="eposta"} />
              <span></span>
            </div>
            <div className="body-label">Konu: {v.konu}</div>
            <div className={cn("body-box", !v.metin && "empty", hi==="metin" && "typing")}>
              {v.metin || "Bu alan, dilekçe metniniz girildikçe gerçek zamanlı doldurulacaktır…"}
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:16, fontSize:12.5, fontStyle:"italic"}}>
              <span>Not: Gerekçelerin devamı için ayrı bir sayfa kullanınız.</span>
              <span>Saygılarımla</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:28, fontSize:12.5}}>
              <span><b>Eki:</b> Transkript ve CCR</span>
              <span style={{borderBottom:"1px dotted #555", width:200, textAlign:"center", paddingBottom:2}}>(imza)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, hint, children }: { num: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3.5 pb-5 mb-5 border-b border-[var(--color-line)] last:border-none">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-wider text-[var(--color-ink-3)]">{num}</span>
        <span className="text-[13px] font-semibold">{title}</span>
        {hint && <span className="ml-auto text-[11.5px] text-[var(--color-ink-3)]">{hint}</span>}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}
function Field({ label, required, badge, full, hint, err, children }: { label: string; required?: boolean; badge?: string; full?: boolean; hint?: React.ReactNode; err?: string | null; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "col-span-2")}>
      <Label required={required} hint={<>{badge && <span className="font-mono text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-line)] text-[var(--color-ink-3)] px-1.5 py-px rounded font-medium">{badge}</span>}{hint}</>}>{label}</Label>
      {children}
      {err && <FieldError>{I.alert}{err}</FieldError>}
    </div>
  );
}
function DocRow({ lab, val, hi }: { lab: string; val?: string; hi?: boolean }) {
  return (
    <div className="meta-row">
      <span className="lab">{lab} :</span>
      <span className={cn("val", !val && "empty", hi && "typing")}>{val}</span>
    </div>
  );
}
