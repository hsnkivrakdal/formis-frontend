import { z } from "zod";
import type { LayoutKey } from "@/types/petition";

const phoneRe = /^[+0-9\s()-]{7,}$/;

const profileBase = {
  studentNumber: z.string(),
  petitionDate: z.string().min(1),
  fullName: z.string(),
  department: z.string(),
  semester: z.string(),
  gpa: z.string(),
  facultyEnrollments: z.string(),
  phone: z.string().regex(phoneRe, { message: "phone-invalid" }),
  email: z.string().email({ message: "email-invalid" }),
} as const;

export const generalSchema = z.object({
  ...profileBase,
  subject: z.string().min(1, { message: "required" }),
  body: z.string().min(1, { message: "required" }).max(1500),
});

export type GeneralValues = z.infer<typeof generalSchema>;

export const cancellationSchema = z.object({
  ...profileBase,
  courseCode: z.string().min(1, { message: "required" }),
  courseName: z.string().min(1, { message: "required" }),
  courseInstructor: z.string().optional().default(""),
  reason: z.string().min(1, { message: "required" }).max(1500),
});

export type CancellationValues = z.infer<typeof cancellationSchema>;

// --- Phase A stub schemas — real fields will be added in Phase B/C/D ---

const courseRowSchema = z.object({
  code: z.string(),
  takenBefore: z.string(),
});

export const ekSinav44cSchema = z.object({
  ...profileBase,
  yearStart: z.string().min(4, { message: "required" }),
  yearEnd: z.string().min(4, { message: "required" }),
  academicTerm: z.string().min(1, { message: "required" }),
  courses: z.array(courseRowSchema).min(1).max(15),
});
export type EkSinav44cValues = z.infer<typeof ekSinav44cSchema>;

export const mazeretSinaviFinalSchema = z.object({
  ...profileBase,
  faculty: z.string().min(1, { message: "required" }),
  excuseDates: z.string().min(1, { message: "required" }),
  courseCodesAndSections: z.string().min(1, { message: "required" }),
  excuseDetails: z.string().min(1, { message: "required" }).max(1500),
  attachedDocuments: z.string().optional().default(""),
  hasHealthReport: z.boolean().default(false),
  healthReportInstitution: z.string().optional().default(""),
  healthReportDate: z.string().optional().default(""),
  healthReportDuration: z.string().optional().default(""),
});
export type MazeretSinaviFinalValues = z.infer<typeof mazeretSinaviFinalSchema>;

export const ilisikKesmeSchema = z.object({
  ...profileBase,
  faculty: z.string().min(1, { message: "required" }),
  scholarship: z.string().optional().default(""),
  address: z.string().min(1, { message: "required" }),
  reasonTransfer: z.boolean().default(false),
  transferUniversity: z.string().optional().default(""),
  reasonSFL: z.boolean().default(false),
  reasonFinancial: z.boolean().default(false),
  reasonLYS: z.boolean().default(false),
  lysUniversity: z.string().optional().default(""),
  reasonDissatisfaction: z.boolean().default(false),
  dissatisfactionDetails: z.string().optional().default(""),
  reasonOther: z.boolean().default(false),
  otherDetails: z.string().optional().default(""),
});
export type IlisikKesmeValues = z.infer<typeof ilisikKesmeSchema>;

export function schemaFor(key: LayoutKey) {
  switch (key) {
    case "general":
      return generalSchema;
    case "cancellation":
      return cancellationSchema;
    case "ek-sinav-44c":
      return ekSinav44cSchema;
    case "mazeret-sinavi-final":
      return mazeretSinaviFinalSchema;
    case "ilisik-kesme":
      return ilisikKesmeSchema;
  }
}
