import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ChevronRight, Share2, Sparkles, User } from "lucide-react";
import { submitToGallery } from "@/lib/community.functions";
import { getAdminAccess } from "@/lib/admin.functions";

import { useAuth } from "@/hooks/useAuth";
import { SettingsSheet } from "@/components/samflash/SettingsSheet";
import { PromptBar } from "@/components/samflash/PromptBar";
import { PlansSheet } from "@/components/samflash/PlansSheet";
import { useGenerations } from "@/hooks/useGenerations";
import { TIER_LABEL, formatSeconds } from "@/lib/quota";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Sam flash 2.0 — Studio de création IA" },
      {
        name: "description",
        content:
          "Studio Sam flash 2.0 : décrivez votre idée et générez des vidéos et images IA en quelques secondes.",
      },
      { property: "og:title", content: "Sam flash 2.0 — Studio de création IA" },
      {
        property: "og:description",
        content: "Décrivez votre idée et générez vidéos et images IA avec Sam flash 2.0.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppFeed,
});

function AppFeed() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { quota, items, loading: feedLoading, refresh } = useGenerations(!!session);
  const submit = useServerFn(submitToGallery);

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/" });
  }, [loading, session, navigate]);



  const share = async (id: string) => {
    try {
      await submit({ data: { id, consent: true } });
      toast.success("Création proposée à la galerie — en attente de modération");
    } catch {
      toast.error("Impossible de proposer cette création");
    }
  };


  return (
    <div className="min-h-screen bg-background pb-64" style={{ background: "var(--gradient-hero)" }}>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/60 px-4 py-3 backdrop-blur-xl">
        <Sparkles className="h-7 w-7 text-primary" />
        <div className="min-w-0">
          <span className="block text-xl font-semibold leading-tight tracking-tight">
            Sam flash 2.0
          </span>
          <span className="block text-[11px] leading-tight text-muted-foreground">
            powered by xai grok
          </span>
        </div>
        <button
          type="button"
          aria-label="Voir les abonnements"
          onClick={() => setPlansOpen(true)}
          className="ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Abonnement
        </button>
        <button
          type="button"
          aria-label="Ouvrir les paramètres"
          onClick={() => setSettingsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      <section className="px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
          {quota && quota.limit > 0 ? (
            <>
              <div className="flex items-center text-sm">
                <span className="font-medium">Quota du jour · {TIER_LABEL[quota.tier]}</span>
                <span className="ml-auto text-muted-foreground">
                  {formatSeconds(quota.used)} / {formatSeconds(quota.limit)}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, (quota.used / Math.max(1, quota.limit)) * 100)}%`,
                  }}
                />
              </div>
            </>
          ) : quota ? (
            <p className="text-sm text-muted-foreground">Générations illimitées sur votre offre.</p>
          ) : (
            <div className="h-10 animate-pulse rounded-xl bg-secondary/60" />
          )}
        </div>
      </section>

      <section className="pt-6">
        <div className="flex items-center gap-2 px-4">
          <h1 className="text-2xl font-semibold">Mes créations</h1>
          <Link
            to="/galerie"
            className="ml-auto rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
          >
            Galerie
          </Link>


          <button
            type="button"
            onClick={() => void refresh()}
            aria-label="Actualiser"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 px-4">
          {feedLoading && items.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] animate-pulse rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
                />
              ))
            : items.map((g) => (
                <div
                  key={g.id}
                  className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
                >
                  {g.media_url ? (
                    <img
                      src={g.media_url}
                      alt={g.prompt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                      {g.status === "processing" ? "Génération en cours…" : g.error_message ?? g.prompt}
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label="Proposer à la galerie communautaire"
                    onClick={() => void share(g.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-md"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-background/70 px-2 py-1 text-[11px] line-clamp-2 backdrop-blur-md">
                    {g.prompt}
                  </div>
                </div>
              ))}
          {!feedLoading && items.length === 0 && (
            <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">
              Aucune création pour l'instant. Décrivez votre idée ci-dessous.
            </p>
          )}
        </div>
      </section>

      <PromptBar
        quota={quota}
        onGenerated={() => void refresh()}
        onQuotaExceeded={() => setPlansOpen(true)}
      />
      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
      {plansOpen && <PlansSheet onClose={() => setPlansOpen(false)} />}
    </div>
  );
}

