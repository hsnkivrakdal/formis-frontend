"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ilisikKesmeSchema, type IlisikKesmeValues } from "../schemas";
import { Section } from "../parts/Section";
import { Field } from "../parts/Field";
import { SaveStatus } from "../parts/SaveStatus";
import { PreviewFrame } from "../parts/PreviewFrame";
import { A4IlisikKesmeView } from "../A4IlisikKesmeView";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { I } from "@/components/ui/Icon";
import { useLang } from "@/lib/lang-client";
import type { StudentProfile } from "@/types/petition";
import { submitIlisikKesmePetition } from "@/app/(app)/petitions/new/actions";

interface Props {
  profile: StudentProfile;
  initialDate: string;
  code: string;
  formTypeId: number;
  semesterId: number;
  precursorId: number;
  formStatusId: number;
}

export function IlisikKesmeLayout({ profile, initialDate, code, formTypeId, semesterId, precursorId, formStatusId }: Props) {
  const { T, lang } = useLang();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<IlisikKesmeValues>({
    resolver: zodResolver(ilisikKesmeSchema),
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
      scholarship: profile.scholarship ?? "",
      address: profile.address ?? "",
      reasonTransfer: false,
      transferUniversity: "",
      reasonSFL: false,
      reasonFinancial: false,
      reasonLYS: false,
      lysUniversity: "",
      reasonDissatisfaction: false,
      dissatisfactionDetails: "",
      reasonOther: false,
      otherDetails: "",
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
      const res = await submitIlisikKesmePetition({
        formTypeId,
        semesterId,
        formStatusId,
        precursorId,
        petitionDate: values.petitionDate,
        faculty: values.faculty,
        scholarship: values.scholarship ?? "",
        address: values.address,
        reasonTransfer: values.reasonTransfer,
        transferUniversity: values.transferUniversity ?? "",
        reasonSFL: values.reasonSFL,
        reasonFinancial: values.reasonFinancial,
        reasonLYS: values.reasonLYS,
        lysUniversity: values.lysUniversity ?? "",
        reasonDissatisfaction: values.reasonDissatisfaction,
        dissatisfactionDetails: values.dissatisfactionDetails ?? "",
        reasonOther: values.reasonOther,
        otherDetails: values.otherDetails ?? "",
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
            <h2 className="font-serif text-[22px] font-medium tracking-tight">{T("İlişik Kesme Dilekçesi", "Withdrawal Petition")}</h2>
            <div className="text-xs text-ink-3 mt-0.5">
              {saved ? T("Otomatik kaydedildi", "Autosaved") : T("Kaydediliyor…", "Saving…")} · <span className="font-mono">{code}</span>
            </div>
          </div>
        </header>

        <Section num="01" title={T("Öğrenci Bilgileri", "Student Information")} hint={T("Profilinden otomatik dolduruldu", "Auto-filled from your profile")}>
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
          <Field full label={T("Fakülte", "Faculty")} required err={errMsg(errs.faculty?.message)}>
            <Input {...register("faculty")} aria-invalid={!!errs.faculty} />
          </Field>
          <Field full label={T("Bölüm", "Department")} required badge="PROFILE">
            <Input {...register("department")} disabled />
          </Field>
          <Field full label={T("Burs Durumu", "Scholarship Status")}>
            <Input {...register("scholarship")} placeholder={T("Örn. %50, %100, Yok", "e.g. 50%, 100%, None")} />
          </Field>
          <Field full label={T("Adres", "Postal Address")} required err={errMsg(errs.address?.message)}>
            <Textarea {...register("address")} rows={2} aria-invalid={!!errs.address} />
          </Field>
          <Field label={T("Telefon", "Phone")} required err={errMsg(errs.phone?.message)}>
            <Input {...register("phone")} aria-invalid={!!errs.phone} />
          </Field>
          <Field label={T("E-posta", "Email")} required err={errMsg(errs.email?.message)}>
            <Input type="email" {...register("email")} aria-invalid={!!errs.email} />
          </Field>
        </Section>

        <Section num="02" title={T("Kayıt Silme Nedenleri", "Reasons for Withdrawal")} hint={T("Sebep(ler)i işaretle, gerekirse açıklama ekle", "Check the reason(s), add detail if needed")}>
          <div className="col-span-2 flex flex-col gap-3">
            <ReasonRow id="reasonTransfer" register={register} checked={v.reasonTransfer}
              labelTr={T("Yatay geçiş yaptım", "Transferring to another university")}
              detailInput={
                <Input
                  {...register("transferUniversity")}
                  placeholder={T("Yatay geçiş yapılan üniversite adı", "Name of the destination university")}
                  disabled={!v.reasonTransfer}
                />
              }
            />
            <ReasonRow id="reasonSFL" register={register} checked={v.reasonSFL}
              labelTr={T("SFL'de başarısızlık", "Lack of success at SFL")}
            />
            <ReasonRow id="reasonFinancial" register={register} checked={v.reasonFinancial}
              labelTr={T("Mali nedenler", "Financial issues")}
            />
            <ReasonRow id="reasonLYS" register={register} checked={v.reasonLYS}
              labelTr={T("LYS ile başka üniversiteye yerleştim", "Placed at another university through LYS")}
              detailInput={
                <Input
                  {...register("lysUniversity")}
                  placeholder={T("Yerleştiğin üniversite", "Destination university")}
                  disabled={!v.reasonLYS}
                />
              }
            />
            <ReasonRow id="reasonDissatisfaction" register={register} checked={v.reasonDissatisfaction}
              labelTr={T("Memnuniyetsizlik", "Dissatisfaction")}
              detailInput={
                <Input
                  {...register("dissatisfactionDetails")}
                  placeholder={T("Nedeni", "Please explain")}
                  disabled={!v.reasonDissatisfaction}
                />
              }
            />
            <ReasonRow id="reasonOther" register={register} checked={v.reasonOther}
              labelTr={T("Diğer", "Other")}
              detailInput={
                <Input
                  {...register("otherDetails")}
                  placeholder={T("Açıklama", "Please explain")}
                  disabled={!v.reasonOther}
                />
              }
            />
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
        <A4IlisikKesmeView
          lang={lang}
          data={{
            fullName: v.fullName ?? "",
            studentNumber: v.studentNumber ?? "",
            faculty: v.faculty ?? "",
            department: v.department ?? "",
            scholarship: v.scholarship ?? "",
            address: v.address ?? "",
            phone: v.phone ?? "",
            petitionDate: v.petitionDate ?? "",
            reasonTransfer: v.reasonTransfer ?? false,
            transferUniversity: v.transferUniversity ?? "",
            reasonSFL: v.reasonSFL ?? false,
            reasonFinancial: v.reasonFinancial ?? false,
            reasonLYS: v.reasonLYS ?? false,
            lysUniversity: v.lysUniversity ?? "",
            reasonDissatisfaction: v.reasonDissatisfaction ?? false,
            dissatisfactionDetails: v.dissatisfactionDetails ?? "",
            reasonOther: v.reasonOther ?? false,
            otherDetails: v.otherDetails ?? "",
          }}
        />
      </PreviewFrame>
    </form>
  );
}

function ReasonRow({
  id,
  register,
  checked,
  labelTr,
  detailInput,
}: {
  id: keyof IlisikKesmeValues;
  register: ReturnType<typeof useForm<IlisikKesmeValues>>["register"];
  checked: boolean;
  labelTr: string;
  detailInput?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          {...register(id)}
          className="h-4 w-4 accent-accent"
        />
        <span className={`text-sm ${checked ? "text-ink font-medium" : "text-ink-2"}`}>{labelTr}</span>
      </label>
      {detailInput ? <div className="ml-6">{detailInput}</div> : null}
    </div>
  );
}
