"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mazeretSinaviFinalSchema, type MazeretSinaviFinalValues } from "../schemas";
import { Section } from "../parts/Section";
import { Field } from "../parts/Field";
import { SaveStatus } from "../parts/SaveStatus";
import { PreviewFrame } from "../parts/PreviewFrame";
import { A4MazeretSinaviFinalView } from "../A4MazeretSinaviFinalView";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { I } from "@/components/ui/Icon";
import { useLang } from "@/lib/lang-client";
import type { StudentProfile } from "@/types/petition";
import { submitMazeretSinaviFinalPetition } from "@/app/(app)/petitions/new/actions";

interface Props {
  profile: StudentProfile;
  initialDate: string;
  code: string;
  formTypeId: number;
  semesterId: number;
  precursorId: number;
  formStatusId: number;
}

export function MazeretSinaviFinalLayout({ profile, initialDate, code, formTypeId, semesterId, precursorId, formStatusId }: Props) {
  const { T, lang } = useLang();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<MazeretSinaviFinalValues>({
    resolver: zodResolver(mazeretSinaviFinalSchema),
    defaultValues: {
      studentNumber: profile.studentNumber,
      petitionDate: initialDate,
      fullName: profile.fullName,
      department: profile.department,
      semester: profile.semester,
      gpa: profile.gpa,
      facultyEnrollments: "1",
      phone: profile.phone,
      email: profile.email,
      faculty: profile.faculty ?? "",
      excuseDates: "",
      courseCodesAndSections: "",
      excuseDetails: "",
      attachedDocuments: "",
      hasHealthReport: false,
      healthReportInstitution: "",
      healthReportDate: "",
      healthReportDuration: "",
    },
    mode: "onTouched",
  });

  const { register, control, watch, handleSubmit, formState } = form;
  const v = watch();
  const errs = formState.errors;
  const errMsg = (errCode?: string) => {
    if (!errCode) return null;
    if (errCode === "required") return T("Zorunlu alan", "Required");
    if (errCode === "email-invalid") return T("Geçerli bir e-posta girin", "Enter a valid email");
    if (errCode === "phone-invalid") return T("Geçerli bir telefon numarası girin", "Enter a valid phone");
    return T("Hatalı değer", "Invalid value");
  };

  const saved = !formState.isDirty || formState.isSubmitSuccessful;

  const onSubmit = handleSubmit((values) => {
    setSubmitError(null);
    startTransition(async () => {
      const res = await submitMazeretSinaviFinalPetition({
        formTypeId,
        semesterId,
        formStatusId,
        precursorId,
        petitionDate: values.petitionDate,
        faculty: values.faculty,
        excuseDates: values.excuseDates,
        courseCodesAndSections: values.courseCodesAndSections,
        excuseDetails: values.excuseDetails,
        attachedDocuments: values.attachedDocuments ?? "",
        hasHealthReport: values.hasHealthReport,
        healthReportInstitution: values.healthReportInstitution ?? "",
        healthReportDate: values.healthReportDate ?? "",
        healthReportDuration: values.healthReportDuration ?? "",
      });
      if (!res.ok) setSubmitError(res.error ?? T("Bilinmeyen hata", "Unknown error"));
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 xl:grid-cols-[minmax(420px,1fr)_minmax(560px,1.1fr)] min-h-[calc(100vh-56px)]"
    >
      <div className="bg-surface-2 border-r border-line p-7 md:p-9 overflow-y-auto max-h-[calc(100vh-56px)]">
        <header className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-line">
          <div>
            <h2 className="font-serif text-[22px] font-medium tracking-tight">{T("Mazeret Sınavı (Final) Dilekçesi", "Excuse Exam (Final) Petition")}</h2>
            <div className="text-xs text-ink-3 mt-0.5">
              {saved ? T("Otomatik kaydedildi", "Autosaved") : T("Kaydediliyor…", "Saving…")} · <span className="font-mono">{code}</span>
            </div>
          </div>
        </header>

        <Section num="01" title={T("Öğrenci Bilgileri", "Student Information")} hint={T("Profilinizden otomatik dolduruldu", "Auto-filled from your profile")}>
          <Field label={T("Öğrenci No", "Student ID")} required badge="PROFILE">
            <Input {...register("studentNumber")} disabled />
          </Field>
          <Field label={T("Dilekçe Tarihi", "Petition Date")} required err={errMsg(errs.petitionDate?.message)}>
            <Controller
              control={control}
              name="petitionDate"
              render={({ field }) => <Input type="date" {...field} />}
            />
          </Field>
          <Field full label={T("Adı ve Soyadı", "Full Name")} required badge="PROFILE">
            <Input {...register("fullName")} disabled />
          </Field>
          <Field label={T("Telefon", "Phone")} required err={errMsg(errs.phone?.message)}>
            <Input {...register("phone")} aria-invalid={!!errs.phone} />
          </Field>
          <Field label={T("E-posta", "Email")} required err={errMsg(errs.email?.message)}>
            <Input type="email" {...register("email")} aria-invalid={!!errs.email} />
          </Field>
          <Field full label={T("Fakülte (Dekanlığına)", "Faculty (Dean's Office)")} required err={errMsg(errs.faculty?.message)}>
            <Input {...register("faculty")} placeholder={T("Örn. İİSBF", "e.g. FEAS")} aria-invalid={!!errs.faculty} />
          </Field>
        </Section>

        <Section num="02" title={T("Mazeret Bilgileri", "Excuse Information")} hint={T("Mazerete konu olan ders ve tarihler", "Courses and dates of the excuse")}>
          <Field full label={T("Tarih(ler)", "Date(s)")} required err={errMsg(errs.excuseDates?.message)}>
            <Input {...register("excuseDates")} placeholder={T("Örn. 12 Haziran 2026 — 14 Haziran 2026", "e.g. June 12, 2026 — June 14, 2026")} aria-invalid={!!errs.excuseDates} />
          </Field>
          <Field full label={T("Ders kodları ve şubeleri", "Course codes and sections")} required err={errMsg(errs.courseCodesAndSections?.message)}>
            <Input {...register("courseCodesAndSections")} placeholder={T("Örn. MIS101-A, MIS202-B", "e.g. MIS101-A, MIS202-B")} aria-invalid={!!errs.courseCodesAndSections} />
          </Field>
          <Field
            full
            label={T("Olayın detaylı açıklaması", "Detailed explanation of the incident")}
            required
            hint={<span className="font-mono text-[10.5px] text-ink-3">{(v.excuseDetails ?? "").length}/1500</span>}
            err={errMsg(errs.excuseDetails?.message)}
          >
            <Textarea
              {...register("excuseDetails")}
              maxLength={1500}
              placeholder={T("Tarih, saat ve mazeret sebebini ayrıntılı şekilde anlat…", "Provide a detailed account of the date, time and reason…")}
              aria-invalid={!!errs.excuseDetails}
            />
          </Field>
          <Field full label={T("Ekte verilen belgeler", "Attached documents")}>
            <Textarea {...register("attachedDocuments")} placeholder={T("Örn.\n1. Sağlık raporu\n2. Ulaşım bileti", "e.g.\n1. Medical report\n2. Travel ticket")} rows={3} />
          </Field>
        </Section>

        <Section num="03" title={T("Sağlık Raporu (varsa)", "Health Report (if any)")} hint={T("Mazeret gerekçen sağlık ise doldur", "Fill if the excuse is health-related")}>
          <div className="col-span-2 flex items-center gap-2 mb-3">
            <input
              id="hasHealthReport"
              type="checkbox"
              {...register("hasHealthReport")}
              className="h-4 w-4 accent-accent"
            />
            <label htmlFor="hasHealthReport" className="text-sm text-ink-2 cursor-pointer">
              {T("Sağlık raporum var, aşağıdaki bilgileri ekledim", "I have a health report, I am filling the section below")}
            </label>
          </div>
          {v.hasHealthReport ? (
            <>
              <Field full label={T("Rapor alınan kurumun açık adı", "Issuing institution")}>
                <Input {...register("healthReportInstitution")} placeholder={T("Örn. Acıbadem Maslak Hastanesi", "e.g. Memorial Şişli Hospital")} />
              </Field>
              <Field label={T("Raporun imzalandığı tarih", "Date of signature")}>
                <Controller
                  control={control}
                  name="healthReportDate"
                  render={({ field }) => <Input type="date" {...field} />}
                />
              </Field>
              <Field label={T("Rapor süresi", "Duration")}>
                <Input {...register("healthReportDuration")} placeholder={T("Örn. 7 gün", "e.g. 7 days")} />
              </Field>
            </>
          ) : null}
        </Section>

        {submitError && (
          <div className="mt-4 px-3 py-2 rounded-md bg-rose-100 border border-rose-200 text-rose-900 text-xs dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-200">
            {I.alert} {submitError}
          </div>
        )}

        <div className="mt-7 pt-5 border-t border-line flex items-center gap-2.5">
          <SaveStatus
            saved={saved}
            savedLabel={T("Tüm değişiklikler kaydedildi", "All changes saved")}
            savingLabel={T("Kaydediliyor…", "Saving…")}
          />
          <div className="flex-1" />
          <Button type="button" disabled={isPending}>{I.save}{T("Taslağı Kaydet", "Save Draft")}</Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? T("Gönderiliyor…", "Submitting…") : <>{I.send}{T("Danışmana Gönder", "Send to Advisor")}</>}
          </Button>
        </div>
      </div>

      <PreviewFrame label={T("Canlı Önizleme — A4", "Live Preview — A4")}>
        <A4MazeretSinaviFinalView
          lang={lang}
          data={{
            fullName: v.fullName ?? "",
            studentNumber: v.studentNumber ?? "",
            phone: v.phone ?? "",
            email: v.email ?? "",
            petitionDate: v.petitionDate ?? "",
            faculty: v.faculty ?? "",
            excuseDates: v.excuseDates ?? "",
            courseCodesAndSections: v.courseCodesAndSections ?? "",
            excuseDetails: v.excuseDetails ?? "",
            attachedDocuments: v.attachedDocuments ?? "",
            hasHealthReport: v.hasHealthReport ?? false,
            healthReportInstitution: v.healthReportInstitution ?? "",
            healthReportDate: v.healthReportDate ?? "",
            healthReportDuration: v.healthReportDuration ?? "",
          }}
        />
      </PreviewFrame>
    </form>
  );
}
