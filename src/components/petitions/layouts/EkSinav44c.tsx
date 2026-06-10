"use client";
import { useState, useTransition } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ekSinav44cSchema, type EkSinav44cValues } from "../schemas";
import { Section } from "../parts/Section";
import { Field } from "../parts/Field";
import { SaveStatus } from "../parts/SaveStatus";
import { PreviewFrame } from "../parts/PreviewFrame";
import { A4EkSinav44cView } from "../A4EkSinav44cView";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { I } from "@/components/ui/Icon";
import { useLang } from "@/lib/lang-client";
import type { StudentProfile } from "@/types/petition";
import { submitEkSinav44cPetition } from "@/app/(app)/petitions/new/actions";

interface Props {
  profile: StudentProfile;
  initialDate: string;
  code: string;
  formTypeId: number;
  semesterId: number;
  precursorId: number;
  formStatusId: number;
}

const MAX_COURSES = 15;

export function EkSinav44cLayout({ profile, initialDate, code, formTypeId, semesterId, precursorId, formStatusId }: Props) {
  const { T, lang } = useLang();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<EkSinav44cValues>({
    resolver: zodResolver(ekSinav44cSchema),
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
      yearStart: "",
      yearEnd: "",
      academicTerm: "",
      courses: [{ code: "", takenBefore: "" }],
    },
    mode: "onTouched",
  });

  const { register, control, watch, handleSubmit, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "courses" });
  const v = watch();
  // useFieldArray + watch reactivity sorunu için array'i ayrıca izle
  const watchedCourses = useWatch({ control, name: "courses" }) ?? [];
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
      const res = await submitEkSinav44cPetition({
        formTypeId,
        semesterId,
        formStatusId,
        precursorId,
        petitionDate: values.petitionDate,
        yearStart: values.yearStart,
        yearEnd: values.yearEnd,
        academicTerm: values.academicTerm,
        courses: values.courses,
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
            <h2 className="font-serif text-[22px] font-medium tracking-tight">{T("44/c Ek Sınavı Dilekçesi", "44/c Extra Exam Petition")}</h2>
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
          <Field full label={T("Bölüm / Program", "Department / Program")} required badge="PROFILE">
            <Input {...register("department")} disabled />
          </Field>
          <Field label={T("Telefon", "Phone")} required err={errMsg(errs.phone?.message)}>
            <Input {...register("phone")} aria-invalid={!!errs.phone} />
          </Field>
          <Field label={T("E-posta", "Email")} required err={errMsg(errs.email?.message)}>
            <Input type="email" {...register("email")} aria-invalid={!!errs.email} />
          </Field>
        </Section>

        <Section num="02" title={T("Akademik Dönem", "Academic Term")} hint={T("Hangi öğretim yılı/yarıyıl sonundayız?", "Which academic year and term?")}>
          <Field label={T("Yıl (başlangıç)", "Year (start)")} required err={errMsg(errs.yearStart?.message)}>
            <Input {...register("yearStart")} placeholder="2024" aria-invalid={!!errs.yearStart} />
          </Field>
          <Field label={T("Yıl (bitiş)", "Year (end)")} required err={errMsg(errs.yearEnd?.message)}>
            <Input {...register("yearEnd")} placeholder="2025" aria-invalid={!!errs.yearEnd} />
          </Field>
          <Field full label={T("Yarıyıl", "Term")} required err={errMsg(errs.academicTerm?.message)}>
            <Input {...register("academicTerm")} placeholder={T("Güz / Bahar / Yaz", "Fall / Spring / Summer")} aria-invalid={!!errs.academicTerm} />
          </Field>
        </Section>

        <Section num="03" title={T("Ek Sınava Girilecek Dersler", "Courses for Extra Exam")} hint={T("En fazla 15 ders ekleyebilirsin", "Max 15 courses")}>
          <div className="col-span-2 flex flex-col gap-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-ink-3 w-6 text-right">{i + 1}.</span>
                <Input
                  {...register(`courses.${i}.code` as const)}
                  placeholder={T("Ders Kodu (örn. MIS101)", "Course Code")}
                  className="flex-1"
                />
                <Input
                  {...register(`courses.${i}.takenBefore` as const)}
                  placeholder={T("Daha önce aldı? (Evet/Hayır)", "Taken before? (Yes/No)")}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={fields.length <= 1}
                  className="text-xs text-ink-3 hover:text-rose-600 px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label={T("Sil", "Remove")}
                >
                  {I.x}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ code: "", takenBefore: "" })}
              disabled={fields.length >= MAX_COURSES}
              className="mt-2 self-start px-3 py-1.5 text-xs rounded border border-line hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              + {T("Ders ekle", "Add course")} ({fields.length}/{MAX_COURSES})
            </button>
          </div>
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
        <A4EkSinav44cView
          lang={lang}
          data={{
            fullName: v.fullName ?? "",
            studentNumber: v.studentNumber ?? "",
            department: v.department ?? "",
            phone: v.phone ?? "",
            email: v.email ?? "",
            petitionDate: v.petitionDate ?? "",
            yearStart: v.yearStart ?? "",
            yearEnd: v.yearEnd ?? "",
            academicTerm: v.academicTerm ?? "",
            courses: watchedCourses,
          }}
        />
      </PreviewFrame>
    </form>
  );
}
