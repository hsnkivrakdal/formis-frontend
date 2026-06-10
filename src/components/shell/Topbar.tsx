import { getT } from "@/lib/lang-server";
import { I } from "@/components/ui/Icon";
import { LangSwitcher } from "./LangSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Crumbs } from "./Crumbs";
import { buildCrumbMap } from "./crumb-map";

export async function Topbar() {
  const { lang, T } = await getT();
  const map = buildCrumbMap(T);

  return (
    <div className="h-14 border-b border-line bg-surface sticky top-0 z-10 flex items-center px-7 gap-4">
      <Crumbs map={map} />
      <div className="ml-auto flex items-center gap-2">
        <LangSwitcher current={lang} />
        <ThemeToggle />
        <button
          className="grid place-items-center h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:border-line border border-transparent transition-colors"
          aria-label={T("Ara", "Search")}
        >
          {I.search}
        </button>
        <button
          className="grid place-items-center h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:border-line border border-transparent transition-colors"
          aria-label={T("Bildirimler", "Notifications")}
        >
          {I.bell}
        </button>
      </div>
    </div>
  );
}
