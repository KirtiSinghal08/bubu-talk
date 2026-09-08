import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Mic, ShieldCheck, Sparkle, Star } from "lucide-react";
import bubuAsset from "@/assets/bubu.png.asset.json";
import { SiteFooter } from "@/components/bubu/site-footer";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/languages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BubuTalk — Live AI Language Buddy for Kids" },
      {
        name: "description",
        content:
          "Meet Bubu, a friendly AI companion who talks live with your child in 12+ languages. Lessons, translation and a parents dashboard.",
      },
      { property: "og:title", content: "BubuTalk — Live AI Language Buddy for Kids" },
      {
        property: "og:description",
        content: "Real-time talking practice in 12+ languages, with progress tracking parents can trust.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    icon: Mic,
    title: "Live talking practice",
    text: "Bubu listens, replies out loud and keeps the conversation going in real time.",
  },
  {
    icon: Sparkle,
    title: "Adaptive lessons",
    text: "Every chat adjusts to your child's level, favourite topics and pace.",
  },
  {
    icon: ShieldCheck,
    title: "Kid-safe by design",
    text: "No ads, no strangers. Parents can review every conversation.",
  },
  {
    icon: HeartHandshake,
    title: "Family progress",
    text: "Streaks, words learned and minutes practiced in one calm dashboard.",
  },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="bubu-hero-bg">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-extrabold tracking-widest text-primary uppercase">
              Learn. Talk. &amp; Grow with Bubu.
            </span>
            <h1 className="mt-6 text-5xl font-extrabold text-ink sm:text-6xl">
              Where Children <span className="bubu-gradient-text">Discover</span> the World Through Language
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Meet Bubu — your child's personal AI language companion. Conversational, adaptive and genuinely engaging
              across 12+ languages.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-2xl px-7 text-base">
                <Link to="/talk">
                  Start Learning Free <ArrowRight className="ml-1 size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl bg-card px-7 text-base">
                <Link to="/parents">For Parents</Link>
              </Button>
            </div>
            <dl className="mt-12 flex flex-wrap gap-10">
              {[
                ["500,000+", "Young Learners"],
                ["12+", "Languages"],
                ["98%", "Parent Approval"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-3xl font-extrabold text-ink">{value}</dt>
                  <dd className="text-sm text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="bubu-card absolute -top-6 -left-4 z-10 hidden w-44 p-4 sm:block">
              <p className="text-xs font-semibold text-primary">Today's Streak</p>
              <p className="font-display text-2xl font-extrabold text-ink">21 Days</p>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div className="h-2 w-4/5 rounded-full bg-primary" />
              </div>
            </div>
            <div className="bubu-card p-6" style={{ boxShadow: "var(--shadow-float)" }}>
              <img src={bubuAsset.url} alt="Bubu, the BubuTalk mascot, reading a book" className="animate-bubu-float w-full" />
              <p className="mt-2 font-display text-xl font-extrabold text-ink">Bubu</p>
              <p className="text-sm text-muted-foreground">Your language companion</p>
              <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-ink">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-4 fill-sunny text-sunny" />
                ))}
                <span className="ml-1 text-muted-foreground">4.9 / 5</span>
              </p>
            </div>
            <div className="bubu-card absolute -right-3 top-1/3 hidden px-4 py-2 text-sm font-bold text-primary sm:block">
              12+ Languages
            </div>
            <div
              className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-primary p-4 text-primary-foreground sm:block"
              style={{ boxShadow: "var(--shadow-float)" }}
            >
              <p className="text-xs opacity-90">Words Learned</p>
              <p className="font-display text-2xl font-extrabold">247</p>
              <p className="text-xs opacity-90">This week alone</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center text-4xl font-extrabold text-ink">Everything a curious child needs</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          A complete learning home: live conversation, lessons, translation help and calm reporting for grown-ups.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bubu-card p-6">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <f.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="bubu-card p-8">
          <h2 className="text-3xl font-extrabold text-ink">12+ languages, one friendly voice</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {LANGUAGES.map((l) => (
              <span key={l.name} className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-ink">
                {l.flag} {l.name}
              </span>
            ))}
          </div>
          <Button asChild className="mt-8 rounded-2xl">
            <Link to="/languages">Explore languages</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
