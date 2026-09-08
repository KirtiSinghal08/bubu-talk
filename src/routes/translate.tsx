import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeftRight, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/bubu/site-footer";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { translateForKids } from "@/lib/bubu.functions";
import { LANGUAGES, languageByName } from "@/lib/languages";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Kid-Friendly Translate — BubuTalk" },
      {
        name: "description",
        content: "Translate words and sentences with easy pronunciation and a friendly learning tip from Bubu.",
      },
      { property: "og:title", content: "Kid-Friendly Translate — BubuTalk" },
      { property: "og:description", content: "Translations with simple pronunciation help for children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TranslatePage,
});

function speak(text: string, code: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = code;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function TranslatePage() {
  const translate = useServerFn(translateForKids);
  const [from, setFrom] = useState("English");
  const [to, setTo] = useState("Spanish");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ translation: string; pronounce: string; tip: string } | null>(null);

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await translate({ data: { text: text.trim(), from, to } });
      setResult(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Translation failed.");
    } finally {
      setBusy(false);
    }
  };

  const select = (value: string, onChange: (v: string) => void, id: string, label: string) => (
    <div className="flex-1">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground"
      >
        {LANGUAGES.map((l) => (
          <option key={l.name} value={l.name}>
            {l.flag} {l.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-extrabold text-ink">Translate with Bubu</h1>
        <p className="mt-3 text-muted-foreground">
          Type anything. Bubu gives the translation, how to say it, and a tiny tip to remember it.
        </p>

        <div className="bubu-card mt-8 p-6">
          <div className="flex items-end gap-3">
            {select(from, setFrom, "from", "From")}
            <Button
              variant="ghost"
              size="icon"
              className="mb-1"
              aria-label="Swap languages"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              <ArrowLeftRight />
            </Button>
            {select(to, setTo, "to", "To")}
          </div>

          <Textarea
            className="mt-4 min-h-28 rounded-xl"
            maxLength={600}
            placeholder="Where is the library?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={run} disabled={busy || !text.trim()} className="mt-4 rounded-2xl">
            {busy ? "Translating…" : "Translate"}
          </Button>

          {result && (
            <div className="mt-6 rounded-2xl bg-secondary p-5">
              <p className="text-xs font-bold tracking-wide text-primary uppercase">{to}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-ink">{result.translation}</p>
              {result.pronounce && <p className="mt-2 text-sm text-muted-foreground">Say it: {result.pronounce}</p>}
              {result.tip && <p className="mt-2 text-sm text-foreground/85">💡 {result.tip}</p>}
              <Button
                variant="outline"
                className="mt-4 rounded-xl bg-card"
                onClick={() => speak(result.translation, languageByName(to).code)}
              >
                <Volume2 className="mr-1 size-4" /> Hear it
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
