"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Forms } from "@/lib/api/forms";
import { FormContents } from "@/lib/api/formContents";
import { Students } from "@/lib/api/students";
import { FormEkSinav44cDetails } from "@/lib/api/formEkSinav44cDetails";
import { FormEkSinav44cCourses } from "@/lib/api/formEkSinav44cCourses";
import { FormMazeretSinaviFinalDetails } from "@/lib/api/formMazeretSinaviFinalDetails";
import { FormIlisikKesmeDetails } from "@/lib/api/formIlisikKesmeDetails";
import { DEV_IDENTITY_NUMBER } from "@/lib/api/services";
import type { CreateFormDto } from "@/types/petition";

interface CoreInput {
  formTypeId: number;
  semesterId: number;
  formStatusId: number;
  precursorId: number;
  petitionDate: string;
  subject: string;
  body: string;
  routeReason: string;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

interface CoreSuccess { ok: true; formId: number }
interface CoreFailure { ok: false; error: string }
type CoreResult = CoreSuccess | CoreFailure;

async function submitFormCore(input: CoreInput): Promise<CoreResult> {
  try {
    if (!DEV_IDENTITY_NUMBER) throw new Error("DEV_IDENTITY_NUMBER yok");
    const student = await Students.byIdentity(DEV_IDENTITY_NUMBER);

    const newContent = await FormContents.create({
      formContentDescription: input.body || input.subject,
      contentPrecursorId: input.precursorId,
    });

    const advisorParts = [student.departmentMemberTitle, student.departmentMemberFirstName, student.departmentMemberLastName]
      .filter((p): p is string => !!p && p.trim().length > 0);
    const advisorFullName = advisorParts.join(" ");

    const dto: CreateFormDto = {
      formTypeId: input.formTypeId,
      semesterId: input.semesterId,
      formContentId: newContent.id,
      formStatusId: input.formStatusId,
      studentId: student.id,
      studentNumber: student.studentNumber,
      studentName: student.firstName,
      studentSurname: student.lastName,
      studentPhone: student.phone,
      studentFaculty: student.facultyName,
      studentDepartment: student.departmentName,
      numOfSemesters: student.numOfSemesters,
      studentEmail: student.email,
      studentAdvisor: advisorFullName,
      formDate: input.petitionDate,
      scholarshipStatus: student.scholarship,
      studentAddress: student.address,
      studentSignature: null,
      studentGpa: student.overallGpa,
      subject: input.subject,
      body: input.body,
      routeReason: input.routeReason,
    };

    const newForm = await Forms.create(dto);
    return { ok: true, formId: newForm.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

function finish(): never {
  revalidatePath("/petitions");
  revalidatePath("/");
  redirect("/petitions");
}

// ----- General -----

export interface GeneralPetitionInput {
  formTypeId: number;
  semesterId: number;
  formStatusId: number;
  precursorId: number;
  petitionDate: string;
  subject: string;
  body: string;
}

export async function submitGeneralPetition(input: GeneralPetitionInput): Promise<SubmitResult> {
  const res = await submitFormCore({ ...input, routeReason: "" });
  if (!res.ok) return res;
  finish();
}

// ----- Cancellation -----

export interface CancellationPetitionInput {
  formTypeId: number;
  semesterId: number;
  formStatusId: number;
  precursorId: number;
  petitionDate: string;
  courseCode: string;
  courseName: string;
  courseInstructor: string;
  reason: string;
}

export async function submitCancellationPetition(input: CancellationPetitionInput): Promise<SubmitResult> {
  const subject = `Ders Bırakma: ${input.courseCode} — ${input.courseName}`;
  const headerLines = [
    `Ders kodu: ${input.courseCode}`,
    `Ders adı: ${input.courseName}`,
    input.courseInstructor ? `Öğretim üyesi: ${input.courseInstructor}` : null,
  ].filter(Boolean);
  const body = `${headerLines.join("\n")}\n\n${input.reason}`;

  const res = await submitFormCore({
    formTypeId: input.formTypeId,
    semesterId: input.semesterId,
    formStatusId: input.formStatusId,
    precursorId: input.precursorId,
    petitionDate: input.petitionDate,
    subject,
    body,
    routeReason: "",
  });
  if (!res.ok) return res;
  finish();
}

// ----- Ek Sınav 44/c — Multi-step (Form + Detail + Courses) -----

export interface EkSinav44cPetitionInput {
  formTypeId: number;
  semesterId: number;
  formStatusId: number;
  precursorId: number;
  petitionDate: string;
  yearStart: string;
  yearEnd: string;
  academicTerm: string;
  courses: { code: string; takenBefore: string }[];
}

export async function submitEkSinav44cPetition(input: EkSinav44cPetitionInput): Promise<SubmitResult> {
  const subject = `44/c Ek Sınavı — ${input.yearStart}-${input.yearEnd} ${input.academicTerm}`;

  // Step 1: Form yarat → FormId al
  const formRes = await submitFormCore({
    formTypeId: input.formTypeId,
    semesterId: input.semesterId,
    formStatusId: input.formStatusId,
    precursorId: input.precursorId,
    petitionDate: input.petitionDate,
    subject,
    body: "",
    routeReason: "",
  });
  if (!formRes.ok) return formRes;

  try {
    // Step 2: Detail yarat (FormId ile)
    await FormEkSinav44cDetails.create({
      id: 0,
      formId: formRes.formId,
      yearStart: input.yearStart,
      yearEnd: input.yearEnd,
      academicTerm: input.academicTerm,
    });

    // Step 3: Courses — paralel POST
    const filled = input.courses.filter((c) => c.code.trim().length > 0);
    await Promise.all(
      filled.map((c, i) =>
        FormEkSinav44cCourses.create({
          id: 0,
          formId: formRes.formId,
          sortOrder: i + 1,
          courseCode: c.code.trim(),
          takenBefore: c.takenBefore.trim(),
        }),
      ),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Form yaratıldı (${formRes.formId}) ama detay POST başarısız: ${msg}` };
  }

  finish();
}

// ----- Mazeret Sınavı (Final) — Multi-step (Form + Detail) -----

export interface MazeretSinaviFinalPetitionInput {
  formTypeId: number;
  semesterId: number;
  formStatusId: number;
  precursorId: number;
  petitionDate: string;
  faculty: string;
  excuseDates: string;
  courseCodesAndSections: string;
  excuseDetails: string;
  attachedDocuments: string;
  hasHealthReport: boolean;
  healthReportInstitution: string;
  healthReportDate: string; // YYYY-MM-DD (form input)
  healthReportDuration: string;
}

export async function submitMazeretSinaviFinalPetition(input: MazeretSinaviFinalPetitionInput): Promise<SubmitResult> {
  const subject = `Mazeret Sınavı (Final) — ${input.excuseDates}`;

  const formRes = await submitFormCore({
    formTypeId: input.formTypeId,
    semesterId: input.semesterId,
    formStatusId: input.formStatusId,
    precursorId: input.precursorId,
    petitionDate: input.petitionDate,
    subject,
    body: "",
    routeReason: "",
  });
  if (!formRes.ok) return formRes;

  try {
    // healthReportDate YYYY-MM-DD → ISO datetime (UTC midnight)
    const healthReportDateIso = input.healthReportDate
      ? new Date(`${input.healthReportDate}T00:00:00Z`).toISOString()
      : "";

    await FormMazeretSinaviFinalDetails.create({
      id: 0,
      formId: formRes.formId,
      faculty: input.faculty,
      excuseDates: input.excuseDates,
      courseCodesAndSections: input.courseCodesAndSections,
      excuseDetails: input.excuseDetails,
      attachedDocuments: input.attachedDocuments,
      hasHealthReport: input.hasHealthReport,
      healthReportInstitution: input.healthReportInstitution,
      healthReportDate: healthReportDateIso,
      healthReportDuration: input.healthReportDuration,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Form yaratıldı (${formRes.formId}) ama detay POST başarısız: ${msg}` };
  }

  finish();
}

// ----- İlişik Kesme — Multi-step (Form + Detail) -----

export interface IlisikKesmePetitionInput {
  formTypeId: number;
  semesterId: number;
  formStatusId: number;
  precursorId: number;
  petitionDate: string;
  faculty: string;
  scholarship: string;
  address: string;
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

export async function submitIlisikKesmePetition(input: IlisikKesmePetitionInput): Promise<SubmitResult> {
  const subject = `İlişik Kesme — ${input.faculty}`;

  const formRes = await submitFormCore({
    formTypeId: input.formTypeId,
    semesterId: input.semesterId,
    formStatusId: input.formStatusId,
    precursorId: input.precursorId,
    petitionDate: input.petitionDate,
    subject,
    body: "",
    routeReason: "",
  });
  if (!formRes.ok) return formRes;

  try {
    await FormIlisikKesmeDetails.create({
      id: 0,
      formId: formRes.formId,
      faculty: input.faculty,
      scholarship: input.scholarship,
      address: input.address,
      reasonTransfer: input.reasonTransfer,
      transferUniversity: input.transferUniversity,
      reasonSFL: input.reasonSFL,
      reasonFinancial: input.reasonFinancial,
      reasonLYS: input.reasonLYS,
      lysUniversity: input.lysUniversity,
      reasonDissatisfaction: input.reasonDissatisfaction,
      dissatisfactionDetails: input.dissatisfactionDetails,
      reasonOther: input.reasonOther,
      otherDetails: input.otherDetails,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Form yaratıldı (${formRes.formId}) ama detay POST başarısız: ${msg}` };
  }

  finish();
}
