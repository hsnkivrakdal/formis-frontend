import { Card, CardContent } from "@/components/ui/Card";
import { I } from "@/components/ui/Icon";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-3xl mx-auto p-7 md:p-9 flex flex-col gap-7">
      <header className="pb-5 border-b border-line">
        <h1 className="font-serif text-3xl tracking-tight font-medium">{title}</h1>
      </header>
      <Card>
        <CardContent className="p-9 flex flex-col items-center gap-3 text-center">
          <span className="text-ink-3">{I.briefcase}</span>
          <p className="text-sm text-ink-3 max-w-md">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
