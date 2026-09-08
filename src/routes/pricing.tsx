import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteFooter } from "@/components/bubu/site-footer";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BubuTalk Plans for Families" },
      {
        name: "description",
        content: "Start free with daily practice, or unlock unlimited talking, all languages and family reports.",
      },
      { property: "og:title", content: "Pricing — BubuTalk" },
      { property: "og:description", content: "Free daily practice, or unlimited talking for the whole family." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Explorer",
    price: "Free",
    note: "Great for first steps",
    perks: ["10 minutes of talking a day", "3 languages", "Basic progress tracking", "Kid-safe translation"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Adventurer",
    price: "$9",
    note: "per month, 1 child",
    perks: ["Unlimited talking with Bubu", "All 12+ languages", "Saved words & streaks", "Full parents dashboard"],
    cta: "Choose Adventurer",
    highlight: true,
  },
  {
    name: "Family",
    price: "$16",
    note: "per month, up to 4 children",
    perks: ["Everything in Adventurer", "Up to 4 child profiles", "Weekly family report", "Priority support"],
    cta: "Choose Family",
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-center text-4xl font-extrabold text-ink sm:text-5xl">Simple plans for growing families</h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Cancel any time. Every plan keeps conversations private and ad-free.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="bubu-card flex flex-col p-7"
              style={p.highlight ? { boxShadow: "var(--shadow-float)", borderColor: "var(--primary)" } : undefined}
            >
              {p.highlight && (
                <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Most loved
                </span>
              )}
              <h2 className="text-xl font-bold text-ink">{p.name}</h2>
              <p className="mt-3 font-display text-4xl font-extrabold text-ink">{p.price}</p>
              <p className="text-sm text-muted-foreground">{p.note}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2 text-foreground/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {perk}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7 rounded-2xl" variant={p.highlight ? "default" : "outline"}>
                <Link to="/auth">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices shown are examples for this launch page — tell us your real prices and we'll update them.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
