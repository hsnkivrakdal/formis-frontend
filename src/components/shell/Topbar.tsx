  "use client";
  import { useApp } from "@/lib/app-context";
  import { I } from "@/components/ui/Icon";
  import { cn } from "@/lib/cn";

  export function Topbar({ crumbs }: { crumbs: string[] }) {
    const { lang, setLang, theme, setTheme } = useApp();
    return (
      <div className="h-14 border-b border-line bg-surface sticky top-0 z-10 flex items-center px-7 gap-4">
        <nav className="flex items-center gap-2 text-[13px] text-ink-3">
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {i > 0 && <span className="opacity-50">/</span>}
              <span className={i === crumbs.length - 1 ? "text-ink font-medium" : ""}>{c}</span>
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="inline-flex border border-line-2 rounded-md overflow-hidden bg-surface-2">
            <button onClick={() => setLang("tr")} className={cn("px-2.5 py-1 text-[11.5px] font-semibold tracking-wide", lang === "tr" ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-ink-3)]")}>TR</button>
            <button onClick={() => setLang("en")} className={cn("px-2.5 py-1 text-[11.5px] font-semibold tracking-wide", lang === "en" ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-ink-3)]")}>EN</button>
          </div>
          <button className="grid place-items-center h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:border-line border border-transparent transition-colors" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Theme">
            {theme === "dark" ? I.sun : I.moon}
          </button>
          <button className="grid place-items-center h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:border-line border border-transparent transition-colors" title="Search">{I.search}</button>
          <button className="grid place-items-center h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:border-line border border-transparent transition-colors" title="Notifications">{I.bell}</button>
        </div>
      </div>
    );
  }
