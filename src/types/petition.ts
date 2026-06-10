export type Locale = "tr" | "en";

export type LayoutKey = "general" | "cancellation" | "ek-sinav-44c" | "mazeret-sinavi-final" | "ilisik-kesme";

export type PetitionStatus = "draft" | "review" | "approved" | "rejected";

// =======================
// UI-facing types (used by pages/components)
// =======================

export interface PetitionSummary {
  id: string;
  code: string;
  layoutKey: LayoutKey;
  subject: string;
  status: PetitionStatus;
  updatedAt: string;
}

export interface StudentProfile {
  identityNumber: string;
  studentNumber: string;
  fullName: string;
  department: string;
  faculty: string;
  advisor: string | null;
  semester: string;
  gpa: string;
  phone: string;
  email: string;
  scholarship: string;
  address: string;
}

// =======================
// Backend DTOs (match SQL schema; enrichment fields are guaranteed by backend joins)
// =======================

export interface StudentDto {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
  standingId: number;
  standingName: string;
  departmentId: number;
  departmentName: string;
  facultyId: number;
  facultyName: string;
  userId: number;
  identityNumber: string;
  email: string;
  phone: string;
  userRole: string;
  departmentMemberId: number | null;
  departmentMemberUserId: number | null;
  departmentMemberFirstName: string | null;
  departmentMemberLastName: string | null;
  departmentMemberTitle: string | null;
  overallCompletedEcts: number;
  programCompletedEcts: number;
  overallGpa: number;
  programGpa: number;
  numOfSemesters: number;
  status: boolean;
  scholarship: string;
  address: string;
  signature: string | null;
}

export interface FormTypeDto {
  id: number;
  typeName: string;
  formLanguage: string;
  formDepartment: number;
  layoutKey: LayoutKey;
}

export interface FormStatusDto {
  id: number;
  formStatusName: string;
}

export interface SemesterDto {
  id: number;
  semesterName: string;
  isActive: boolean;
  semesterYears: string;
}

export interface FormContentPrecursorDto {
  id: number;
  formContentPrecursorDescription: string;
  formTypeId: number;
  value: string;
  check: boolean;
}

export interface FormContentDto {
  id: number;
  formContentDescription: string;
  contentPrecursorId: number;
}

export interface CreateFormContentDto {
  formContentDescription: string;
  contentPrecursorId: number;
}

export interface UpdateFormContentDto extends CreateFormContentDto {
  id: number;
}

export interface FormDto {
  id: number;
  formTypeId: number;
  semesterId: number;
  formContentId: number;
  formStatusId: number;
  studentId: number;
  studentNumber: string;
  studentName: string;
  studentSurname: string;
  studentPhone: string;
  studentFaculty: string;
  studentDepartment: string;
  numOfSemesters: number;
  studentEmail: string;
  studentAdvisor: string;
  formDate: string;
  scholarshipStatus: string;
  studentAddress: string;
  studentSignature: string | null;
  studentGpa: number;
  subject: string;
  body: string;
  routeReason: string;
  // Enrichment fields — backend join'leri ile her zaman dolu gelir:
  formTypeName: string;
  layoutKey: LayoutKey;
  formStatusName: string;
  semesterName: string;
}

export interface CreateFormDto {
  formTypeId: number;
  semesterId: number;
  formContentId: number;
  formStatusId: number;
  studentId: number;
  studentNumber: string;
  studentName: string;
  studentSurname: string;
  studentPhone: string;
  studentFaculty: string;
  studentDepartment: string;
  numOfSemesters: number;
  studentEmail: string;
  studentAdvisor: string;
  formDate: string;
  scholarshipStatus: string;
  studentAddress: string;
  studentSignature: string | null;
  studentGpa: number;
  subject: string;
  body: string;
  routeReason: string;
}

export interface UpdateFormDto extends CreateFormDto {
  id: number;
}

// ===== Layout-spesifik detay DTO'ları =====

// --- 44/c Ek Sınavı ---

export interface FormEkSinav44cDetailDto {
  id: number;
  formId: number;
  yearStart: string;
  yearEnd: string;
  academicTerm: string;
}

export interface CreateFormEkSinav44cDetailDto {
  id: number; // backend görmezden gelir (IDENTITY); 0 gönder
  formId: number;
  yearStart: string;
  yearEnd: string;
  academicTerm: string;
}

export interface FormEkSinav44cCourseDto {
  id: number;
  formId: number;
  sortOrder: number;
  courseCode: string;
  takenBefore: string;
}

export interface CreateFormEkSinav44cCourseDto {
  id: number;
  formId: number;
  sortOrder: number;
  courseCode: string;
  takenBefore: string;
}

// --- Mazeret Sınavı (Final) ---

export interface FormMazeretSinaviFinalDetailDto {
  id: number;
  formId: number;
  faculty: string;
  excuseDates: string;
  courseCodesAndSections: string;
  excuseDetails: string;
  attachedDocuments: string;
  hasHealthReport: boolean;
  healthReportInstitution: string | null;
  healthReportDate: string | null;
  healthReportDuration: string | null;
}

export interface CreateFormMazeretSinaviFinalDetailDto {
  id: number;
  formId: number;
  faculty: string;
  excuseDates: string;
  courseCodesAndSections: string;
  excuseDetails: string;
  attachedDocuments: string;
  hasHealthReport: boolean;
  healthReportInstitution: string;
  healthReportDate: string; // ISO datetime
  healthReportDuration: string;
}

// --- İlişik Kesme ---

export interface FormIlisikKesmeDetailDto {
  id: number;
  formId: number;
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

export interface CreateFormIlisikKesmeDetailDto {
  id: number;
  formId: number;
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
