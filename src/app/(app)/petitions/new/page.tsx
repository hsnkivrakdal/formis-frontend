import Link from "next/link";
import { getT } from "@/lib/lang-server";
import { getStudentProfile } from "@/lib/api";
import { getFormTypeByLayout } from "@/lib/api/formTypes";
import { getActiveSemester } from "@/lib/api/semesters";
import { getPrecursorsByFormType } from "@/lib/api/formContents";
import { FormStatuses } from "@/lib/api/formStatuses";
import { PetitionEditor } from "@/components/petitions/PetitionEditor";
import type { LayoutKey } from "@/types/petition";

interface SearchParams {
  layout?: string;
}

const VALID: LayoutKey[] = ["general", "cancellation", "ek-sinav-44c", "mazeret-sinavi-final", "ilisik-kesme"];

function isLayoutKey(v: string | undefined): v is LayoutKey {
  return typeof v === "string" && (VALID as string[]).includes(v);
}

function pickInitialStatusId(statuses: { id: number; formStatusName: string }[]): number {
  const initial = statuses.find((s) => /pending|submit|gönder|beklem|review|incel/i.test(s.formStatusName));
  return (initial ?? statuses[0])?.id ?? 0;
}

export default async function NewPetitionPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { T } = await getT();
  const sp = await searchParams;
  const layoutKey: LayoutKey = isLayoutKey(sp.layout) ? sp.layout : "general";

  const [profile, formType, semester, statuses] = await Promise.all([
    getStudentProfile(),
    getFormTypeByLayout(layoutKey),
    getActiveSemester(),
    FormStatuses.list(),
  ]);

  if (!formType) {
    return <MissingLookup label={T(`Form tipi bulunamadı: ${layoutKey}`, `Form type not found: ${layoutKey}`)} />;
  }
  if (!semester) {
    return <MissingLookup label={T("Aktif sömestir tanımlı değil", "No active semester defined")} />;
  }

  const precursors = await getPrecursorsByFormType(formType.id);
  const precursor = precursors[0];
  if (!precursor) {
    return <MissingLookup label={T("Bu form tipi için FormContentPrecursor tanımlı değil", "No precursor for this form type")} />;
  }

  const formStatusId = pickInitialStatusId(statuses);
  if (!formStatusId) {
    return <MissingLookup label={T("FormStatus tanımlı değil", "No FormStatus defined")} />;
  }

  const today = new Date().toISOString().slice(0, 10);
  const code = `${formType.typeName.slice(0, 3).toUpperCase()}-NEW-${today.replace(/-/g, "").slice(2)}`;

  return (
    <div>
      <div className="px-7 md:px-9 pt-5">
        <Link href="/petitions" className="text-xs text-ink-3 inline-block">
          ← {T("Dilekçe türleri", "Petition types")}
        </Link>
      </div>
      <PetitionEditor
        layoutKey={layoutKey}
        profile={profile}
        initialDate={today}
        code={code}
        formTypeId={formType.id}
        semesterId={semester.id}
        precursorId={precursor.id}
        formStatusId={formStatusId}
      />
    </div>
  );
}

function MissingLookup({ label }: { label: string }) {
  return (
    <div className="max-w-2xl mx-auto p-9 text-sm text-ink-3 border border-line rounded-lg bg-surface m-9">
      ⚠ {label}
    </div>
  );
}
