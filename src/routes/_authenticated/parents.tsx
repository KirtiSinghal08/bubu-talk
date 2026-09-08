import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES } from "@/lib/languages";

export const Route = createFileRoute("/_authenticated/parents")({
  head: () => ({
    meta: [
      { title: "Parents Dashboard — BubuTalk" },
      {
        name: "description",
        content: "Set daily goals, choose the learning language and review every conversation your child has with Bubu.",
      },
      { property: "og:title", content: "Parents Dashboard — BubuTalk" },
      { property: "og:description", content: "Goals, progress and full conversation history for parents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Parents,
});

function Parents() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["parents"],
    queryFn: async () => {
      const [profile, messages] = await Promise.all([
        supabase.from("profiles").select("*").maybeSingle(),
        supabase.from("chat_messages").select("role, content, language, created_at").order("created_at", { ascending: false }).limit(60),
      ]);
      return { profile: profile.data, messages: messages.data ?? [] };
    },
  });

  const [name, setName] = useState("");
  const [goal, setGoal] = useState(15);
  const [language, setLanguage] = useState("Spanish");
  const [age, setAge] = useState("");

  useEffect(() => {
    const p = data?.profile;
    if (!p) return;
    setName(p.display_name);
    setGoal(p.daily_goal_minutes);
    setLanguage(p.learning_language);
    setAge(p.learner_age ? String(p.learner_age) : "");
  }, [data?.profile]);

  const save = useMutation({
    mutationFn: async () => {
      const id = data?.profile?.id;
      if (!id) throw new Error("Profile not ready yet.");
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: name.trim().slice(0, 40) || "Little Explorer",
          daily_goal_minutes: Math.min(120, Math.max(5, goal)),
          learning_language: language,
          learner_age: age ? Math.min(18, Math.max(3, Number(age))) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved. Bubu will follow the new settings.");
      void qc.invalidateQueries({ queryKey: ["parents"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save."),
  });

  const p = data?.profile;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-ink">Parents dashboard</h1>
        <p className="mt-2 text-muted-foreground">Set the pace, pick the language, and read every conversation.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            ["Streak", `${p?.streak_days ?? 0} days`],
            ["Words learned", `${p?.words_learned ?? 0}`],
            ["Minutes practiced", `${p?.minutes_practiced ?? 0}`],
          ].map(([label, value]) => (
            <div key={label} className="bubu-card p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-display text-3xl font-extrabold text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="bubu-card p-6">
            <h2 className="text-xl font-bold text-ink">Learning settings</h2>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="child">Child's name</Label>
                <Input id="child" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" min={3} max={18} value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="goal">Daily goal (minutes)</Label>
                <Input
                  id="goal"
                  type="number"
                  min={5}
                  max={120}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="lang">Language to learn</Label>
                <select
                  id="lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={() => save.mutate()} disabled={save.isPending} className="rounded-2xl">
                {save.isPending ? "Saving…" : "Save settings"}
              </Button>
            </div>
          </div>

          <div className="bubu-card p-6">
            <h2 className="text-xl font-bold text-ink">Conversation history</h2>
            <p className="mt-1 text-sm text-muted-foreground">Newest first — nothing is hidden from you.</p>
            <div className="mt-4 max-h-[26rem] space-y-3 overflow-y-auto pr-1">
              {data?.messages.length ? (
                data.messages.map((m, i) => (
                  <div key={i} className="rounded-xl bg-secondary p-3 text-sm">
                    <p className="text-xs font-bold text-primary uppercase">
                      {m.role === "user" ? "Child" : "Bubu"} · {new Date(m.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 text-foreground/90">{m.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
