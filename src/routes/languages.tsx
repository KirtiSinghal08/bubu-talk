import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/bubu/site-footer";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/languages";

export const Route = createFileRoute("/languages")({
  head: () => ({
    meta: [
      { title: "Languages — Learn 12+ Languages with Bubu" },
      {
        name: "description",
        content: "Spanish, French, Hindi, Mandarin and more — pick a language and start speaking with Bubu today.",
      },
      { property: "og:title", content: "Languages — BubuTalk" },
      { property: "og:description", content: "Pick from 12+ languages and start speaking with Bubu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LanguagesPage,
});

function LanguagesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Pick a language to explore</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every language comes with playful conversation starters. Your child can switch any time inside the chat.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((l) => (
            <div key={l.name} className="bubu-card flex flex-col p-6">
              <span className="text-4xl">{l.flag}</span>
              <h2 className="mt-3 text-xl font-bold text-ink">{l.name}</h2>
              <p className="text-sm font-semibold text-primary">{l.native}</p>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{l.blurb}</p>
              <Button asChild className="mt-5 rounded-xl">
                <Link to="/talk" search={{ lang: l.name }}>
                  Talk in {l.name}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
