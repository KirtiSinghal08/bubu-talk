import { Link } from "@tanstack/react-router";
import bubuAsset from "@/assets/bubu.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={bubuAsset.url} alt="Bubu mascot" className="size-9 rounded-lg bg-secondary object-cover" />
            <span className="font-display text-lg font-extrabold text-ink">
              Bubu<span className="text-primary">Talk</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A gentle AI language companion that talks, listens and grows with your child.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-ink">Learn</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/languages" className="hover:text-primary">Languages</Link></li>
            <li><Link to="/talk" className="hover:text-primary">Talk with Bubu</Link></li>
            <li><Link to="/translate" className="hover:text-primary">Translate</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-ink">Family</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/parents" className="hover:text-primary">Parents dashboard</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Child dashboard</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-ink">Safety first</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Kid-safe conversations, no ads, and parents can review every chat.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BubuTalk. Made for curious kids.
      </div>
    </footer>
  );
}
