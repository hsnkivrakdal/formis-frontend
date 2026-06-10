import { getT } from "@/lib/lang-server";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export default async function SchedulePage() {
  const { T } = await getT();
  return (
    <PlaceholderPage
      title={T("Hocaların Programı", "Faculty Schedule")}
      description={T(
        "Haftalık ders ve sınav programı görüntüleyici yakında.",
        "Weekly course and exam schedule viewer — coming soon.",
      )}
    />
  );
}
