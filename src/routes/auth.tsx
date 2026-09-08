import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import bubuAsset from "@/assets/bubu.png.asset.json";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — BubuTalk" },
      { name: "description", content: "Create a free BubuTalk account and start talking with Bubu in minutes." },
      { property: "og:title", content: "Sign in — BubuTalk" },
      { property: "og:description", content: "Create a free BubuTalk account for your family." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name || "Little Explorer" } },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Almost there! Check your email to confirm your account.");
        } else {
          navigate({ to: "/dashboard" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Google sign-in did not work. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div className="hidden lg:block">
          <img src={bubuAsset.url} alt="Bubu waving hello" className="animate-bubu-float w-full max-w-sm" />
          <h1 className="mt-4 text-3xl font-extrabold text-ink">Bubu can't wait to meet you!</h1>
          <p className="mt-2 text-muted-foreground">
            Create a free account to save streaks, words learned and every conversation.
          </p>
        </div>

        <div className="bubu-card p-7">
          <h2 className="text-2xl font-extrabold text-ink">
            {mode === "signup" ? "Create your free account" : "Welcome back"}
          </h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Child's first name</Label>
                <Input id="name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Mia" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Parent email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <Button type="submit" className="w-full rounded-2xl" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Get started free" : "Sign in"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full rounded-2xl" onClick={google}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to BubuTalk?"}{" "}
            <button
              type="button"
              className="font-bold text-primary"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
