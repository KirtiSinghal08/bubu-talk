import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Gauge, Languages as LanguagesIcon, Mic, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { SiteFooter } from "@/components/bubu/site-footer";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — BubuTalk Language Learning for Kids" },
      {
        name: "description",
        content:
          "Live voice chat, adaptive lessons, kid-safe translation, streaks and a parents dashboard — everything inside BubuTalk.",
      },
      { property: "og:title", content: "Features — BubuTalk" },
      { property: "og:description", content: "Live voice chat, adaptive lessons and a parents dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Features,
});

const ITEMS = [
  { icon: Mic, title: "Talk with Bubu", text: "Real-time speaking practice with speech recognition and Bubu's voice." },
  { icon: LanguagesIcon, title: "12+ languages", text: "Switch language any time; Bubu adapts instantly." },
  { icon: BookOpen, title: "Kid-safe translation", text: "Translations with easy pronunciation and a learning tip." },
  { icon: Gauge, title: "Child dashboard", text: "Streaks, words learned, minutes practiced and saved words." },
  { icon: Users, title: "Parents dashboard", text: "Review conversations, set daily goals and follow progress." },
  { icon: Trophy, title: "Gentle goals", text: "Daily minute goals that celebrate effort, not perfection." },
  { icon: ShieldCheck, title: "Safety guardrails", text: "Bubu stays playful, kind and always age-appropriate." },
  { icon: Sparkles, title: "Adaptive replies", text: "Short sentences, English meaning in brackets, one question back." },
];

function Features() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Everything inside BubuTalk</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Built around one idea: children learn a language fastest when they actually speak it with someone friendly.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((i) => (
            <div key={i.title} className="bubu-card p-6">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <i.icon className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink">{i.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
            </div>
          ))}
        </div>
        <Button asChild size="lg" className="mt-12 rounded-2xl">
          <Link to="/talk">Try talking with Bubu</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
