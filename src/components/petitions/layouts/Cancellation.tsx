"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancellationSchema, type CancellationValues } from "../schemas";
import { Section } from "../parts/Section";
import { Field } from "../parts/Field";
import { SaveStatus } from "../parts/SaveStatus";
import { PreviewFrame } from "../parts/PreviewFrame";
import { A4GeneralView } from "../A4GeneralView";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { I } from "@/components/ui/Icon";
import { useLang } from "@/lib/lang-client";
import type { StudentProfile } from "@/types/petition";
import { submitCancellationPetition } from "@/app/(app)/petitions/new/actions";

interface Props {
  profile: StudentProfile;
  initialDate: string;
  code: string;
  formTypeId: number;
  semesterId: number;
  precursorId: number;
  formStatusId: number;
}

export function CancellationLayout({ profile, initialDate, code, formTypeId, semesterId, precursorId, formStatusId }: Props) {
  const { T, lang } = useLang();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CancellationValues>({
    resolver: zodResolver(cancellationSchema),
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
      courseCode: "",
      courseName: "",
      courseInstructor: "",
      reason: "",
    },
    mode: "onTouched",
  });

  const { register, control, watch, handleSubmit, formState } = form;
  const v = watch();
  const errs = formState.errors;
  const errMsg = (code?: string) => {
    if (!code) return null;
    if (code === "required") return T("Zorunlu alan", "Required");
    if (code === "email-invalid") return T("Geçerli bir e-posta girin", "Enter a valid email");
    if (code === "phone-invalid") return T("Geçerli bir telefon numarası girin", "Enter a valid phone");
    return T("Hatalı değer", "Invalid value");
  };

  const [hi, setHi] = useState<string | null>(null);
  const touch = (k: string) => {
    setHi(k);
    setTimeout(() => setHi((cur) => (cur === k ? null : cur)), 1300);
  };

  const saved = !formState.isDirty || formState.isSubmitSuccessful;

  const onSubmit = handleSubmit((values) => {
    setSubmitError(null);
    startTransition(async () => {
      const res = await submitCancellationPetition({
        formTypeId,
        semesterId,
        formStatusId,
        precursorId,
        petitionDate: values.petitionDate,
        courseCode: values.courseCode,
        courseName: values.courseName,
        courseInstructor: values.courseInstructor ?? "",
        reason: values.reason,
      });
      if (!res.ok) setSubmitError(res.error ?? T("Bilinmeyen hata", "Unknown error"));
    });
  });

  // A4 view için body composer (server action ile uyumlu)
  const a4Subject = v.courseCode || v.courseName
    ? `${T("Ders Bırakma", "Course Cancellation")}: ${v.courseCode || "—"}${v.courseName ? ` — ${v.courseName}` : ""}`
    : T("Ders Bırakma", "Course Cancellation");
  const a4BodyLines = [
    v.courseCode ? `${T("Ders kodu", "Course code")}: ${v.courseCode}` : "",
    v.courseName ? `${T("Ders adı", "Course name")}: ${v.courseName}` : "",
    v.courseInstructor ? `${T("Öğretim üyesi", "Instructor")}: ${v.courseInstructor}` : "",
  ].filter(Boolean).join("\n");
  const a4Body = v.reason ? `${a4BodyLines}\n\n${v.reason}` : a4BodyLines;

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 xl:grid-cols-[minmax(420px,1fr)_minmax(560px,1.1fr)] min-h-[calc(100vh-56px)]"
    >
      <div className="bg-surface-2 border-r border-line p-7 md:p-9 overflow-y-auto max-h-[calc(100vh-56px)]">
        <header className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-line">
          <div>
            <h2 className="font-serif text-[22px] font-medium tracking-tight">{T("Ders Bırakma Dilekçesi", "Course Cancellation Petition")}</h2>
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
              render={({ field }) => (
                <Input type="date" {...field} onChange={(e) => { field.onChange(e); touch("petitionDate"); }} />
              )}
            />
          </Field>
          <Field full label={T("Adı ve Soyadı", "Full Name")} required badge="PROFILE">
            <Input {...register("fullName")} disabled />
          </Field>
          <Field full label={T("Bölümü", "Department")} required badge="PROFILE">
            <Input {...register("department")} disabled />
          </Field>
          <Field label={T("Dönem Sayısı", "Semester #")} required badge="PROFILE">
            <Input {...register("semester")} disabled />
          </Field>
          <Field label={T("GNO", "GPA")} required badge="PROFILE">
            <Input {...register("gpa")} disabled />
          </Field>
          <Field label={T("Telefon", "Phone")} required err={errMsg(errs.phone?.message)}>
            <Input {...register("phone")} aria-invalid={!!errs.phone} onFocus={() => touch("phone")} />
          </Field>
          <Field label={T("E-posta", "Email")} required err={errMsg(errs.email?.message)}>
            <Input type="email" {...register("email")} aria-invalid={!!errs.email} onFocus={() => touch("email")} />
          </Field>
        </Section>

        <Section num="02" title={T("Bırakılacak Ders", "Course to Drop")} hint={T("Bırakmak istediğin dersin bilgileri", "Information about the course")}>
          <Field label={T("Ders Kodu", "Course Code")} required err={errMsg(errs.courseCode?.message)}>
            <Input {...register("courseCode")} placeholder={T("Örn. MIS101", "e.g. MIS101")} aria-invalid={!!errs.courseCode} onFocus={() => touch("courseCode")} />
          </Field>
          <Field label={T("Ders Adı", "Course Name")} required err={errMsg(errs.courseName?.message)}>
            <Input {...register("courseName")} placeholder={T("Örn. İş Sistemlerine Giriş", "e.g. Intro to Business Systems")} aria-invalid={!!errs.courseName} onFocus={() => touch("courseName")} />
          </Field>
          <Field full label={T("Öğretim Üyesi", "Instructor")}>
            <Input {...register("courseInstructor")} placeholder={T("Örn. Doç. Dr. ...", "e.g. Assoc. Prof. ...")} onFocus={() => touch("courseInstructor")} />
          </Field>
        </Section>

        <Section num="03" title={T("Gerekçe", "Reason")} hint={T("Bırakma nedeninizi açıklayın", "Explain your reason for dropping")}>
          <Field
            full
            label={T("Açıklama", "Explanation")}
            required
            hint={<span className="font-mono text-[10.5px] text-ink-3">{(v.reason ?? "").length}/1500</span>}
            err={errMsg(errs.reason?.message)}
          >
            <Textarea
              {...register("reason")}
              maxLength={1500}
              placeholder={T("Bu dersi şu sebeplerle bırakmak istiyorum…", "I want to drop this course because…")}
              aria-invalid={!!errs.reason}
              onFocus={() => touch("reason")}
            />
          </Field>
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
        <A4GeneralView
          lang={lang}
          hi={hi}
          data={{
            studentNumber: v.studentNumber ?? "",
            petitionDate: v.petitionDate ?? "",
            fullName: v.fullName ?? "",
            facultyEnrollments: v.facultyEnrollments ?? "",
            department: v.department ?? "",
            semester: v.semester ?? "",
            gpa: v.gpa ?? "",
            phone: v.phone ?? "",
            email: v.email ?? "",
            subject: a4Subject,
            body: a4Body,
          }}
        />
      </PreviewFrame>
    </form>
  );
}
