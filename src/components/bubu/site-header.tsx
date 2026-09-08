import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import bubuAsset from "@/assets/bubu.png.asset.json";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/parents", label: "Parents" },
  { to: "/languages", label: "Languages" },
  { to: "/translate", label: "Translate" },
  { to: "/talk", label: "Talk with Bubu" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={bubuAsset.url} alt="Bubu mascot" className="size-10 rounded-xl bg-secondary object-cover" />
          <span className="leading-none">
            <span className="font-display text-xl font-extrabold text-ink">
              Bubu<span className="text-primary">Talk</span>
            </span>
            <span className="block text-xs text-muted-foreground">Learn. Talk. Grow.</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/dashboard">My dashboard</Link>
              </Button>
              <Button onClick={signOut} variant="outline" className="rounded-full">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full px-5">
                <Link to="/auth">Get Started Free</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-border/60 px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
