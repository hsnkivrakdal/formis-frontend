import { getT } from "@/lib/lang-server";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export default async function InternshipPage() {
  const { T } = await getT();
  return (
    <PlaceholderPage
      title={T("Staj", "Internship")}
      description={T(
        "Staj başvurusu ve takip ekranı yakında. Backend uçları hazır olduğunda burası bağlanacak.",
        "Internship submission and tracking screen — coming soon. Will connect when backend endpoints are wired.",
      )}
    />
  );
}
