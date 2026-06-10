import { getT } from "@/lib/lang-server";
import { getStudentProfile } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";

export default async function ProfilePage() {
  const { T } = await getT();
  const p = await getStudentProfile();
  const row = (label: string, value: string) => (
    <div className="grid grid-cols-[180px_1fr] items-baseline gap-4 px-5 py-3 text-sm">
      <span className="text-ink-3 text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-7 md:p-9 flex flex-col gap-7">
      <header className="pb-5 border-b border-line">
        <h1 className="font-serif text-3xl tracking-tight font-medium">{T("Profilim", "My Profile")}</h1>
        <p className="text-ink-3 text-sm mt-1">{T("Auth servisinden alınan bilgiler.", "Information from the auth service.")}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{p.fullName}</CardTitle>
          <CardDescription>{p.department} · {p.faculty}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-line">
          {row(T("Öğrenci No", "Student ID"), p.studentNumber)}
          {row(T("Kimlik No", "Identity #"), p.identityNumber)}
          {row(T("Bölüm", "Department"), p.department)}
          {row(T("Fakülte", "Faculty"), p.faculty)}
          {row(T("Danışman", "Advisor"), p.advisor ?? "—")}
          {row(T("Dönem", "Semester"), p.semester)}
          {row(T("GNO", "GPA"), p.gpa)}
          {row(T("Telefon", "Phone"), p.phone)}
          {row(T("E-posta", "Email"), p.email)}
        </CardContent>
      </Card>
    </div>
  );
}
