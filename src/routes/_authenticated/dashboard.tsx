import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame, MessageCircleHeart, Sparkles, Timer } from "lucide-react";
import bubuAsset from "@/assets/bubu.png.asset.json";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — BubuTalk" },
      { name: "description", content: "See your streak, words learned and minutes practiced with Bubu." },
      { property: "og:title", content: "My Dashboard — BubuTalk" },
      { property: "og:description", content: "Track streaks, words and practice minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [profile, words, messages, progress] = await Promise.all([
        supabase.from("profiles").select("*").maybeSingle(),
        supabase.from("vocab_words").select("word, translation, language").order("created_at", { ascending: false }).limit(8),
        supabase.from("chat_messages").select("id", { count: "exact", head: true }),
        supabase.from("lesson_progress").select("lesson, language, score").order("completed_at", { ascending: false }).limit(5),
      ]);
      return {
        profile: profile.data,
        words: words.data ?? [],
        messageCount: messages.count ?? 0,
        progress: progress.data ?? [],
      };
    },
  });

  const p = data?.profile;
  const goal = p?.daily_goal_minutes ?? 15;
  const minutes = p?.minutes_practiced ?? 0;
  const todayPct = Math.min(100, Math.round(((minutes % goal) / goal) * 100));

  const stats = [
    { icon: Flame, label: "Day streak", value: p?.streak_days ?? 0 },
    { icon: Sparkles, label: "Words learned", value: p?.words_learned ?? 0 },
    { icon: Timer, label: "Minutes practiced", value: minutes },
    { icon: MessageCircleHeart, label: "Messages with Bubu", value: data?.messageCount ?? 0 },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="bubu-card flex flex-wrap items-center gap-5 p-6">
          <img src={bubuAsset.url} alt="Bubu cheering" className="animate-bubu-float size-24" />
          <div>
            <h1 className="text-3xl font-extrabold text-ink">Hi {p?.display_name ?? "friend"}! 👋</h1>
            <p className="mt-1 text-muted-foreground">
              You're learning <strong>{p?.learning_language ?? "Spanish"}</strong>. Bubu is ready when you are.
            </p>
          </div>
          <Button asChild className="ml-auto rounded-2xl px-6">
            <Link to="/talk">Talk with Bubu</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bubu-card p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                <s.icon className="size-5" />
              </span>
              <p className="mt-3 font-display text-3xl font-extrabold text-ink">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="bubu-card p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-ink">Today's goal</h2>
            <p className="mt-1 text-sm text-muted-foreground">{goal} minutes of happy talking</p>
            <Progress value={todayPct} className="mt-4" />
            <p className="mt-2 text-sm font-semibold text-primary">{todayPct}% complete</p>

            <h3 className="mt-8 text-lg font-bold text-ink">Recent lessons</h3>
            {data?.progress.length ? (
              <ul className="mt-3 space-y-2">
                {data.progress.map((l, i) => (
                  <li key={i} className="flex justify-between rounded-xl bg-secondary px-4 py-2 text-sm">
                    <span className="font-semibold text-ink">{l.lesson}</span>
                    <span className="text-muted-foreground">
                      {l.language} · {l.score}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No lessons yet — every chat with Bubu counts as practice.
              </p>
            )}
          </div>

          <div className="bubu-card p-6">
            <h2 className="text-xl font-bold text-ink">My word box</h2>
            {data?.words.length ? (
              <ul className="mt-3 space-y-2">
                {data.words.map((w, i) => (
                  <li key={i} className="rounded-xl bg-secondary px-4 py-2 text-sm">
                    <span className="font-bold text-ink">{w.word}</span>{" "}
                    <span className="text-muted-foreground">— {w.translation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Words you save while chatting will appear here.
              </p>
            )}
            <Button asChild variant="outline" className="mt-5 w-full rounded-xl">
              <Link to="/translate">Look up a word</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
