import { useRef, useState } from "react";
import { Plus, Image as ImageIcon, Video, Smile, ArrowUp, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateMedia } from "@/lib/generation.functions";
import { formatSeconds } from "@/lib/quota";

const chip = (active: boolean) =>
  `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active ? "bg-foreground text-background" : "text-muted-foreground"
  }`;

type Props = {
  quota?: { used: number; limit: number; remaining: number } | null;
  onGenerated?: () => void;
  onQuotaExceeded?: () => void;
};

export function PromptBar({ quota, onGenerated, onQuotaExceeded }: Props) {
  const [res, setRes] = useState("720p");
  const [dur, setDur] = useState("6s");
  const [ratio, setRatio] = useState("2:3");
  const [mode, setMode] = useState<"image" | "video">("video");
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => inputRef.current?.focus();
  const generate = useServerFn(generateMedia);

  const submit = async () => {
    const prompt = text.trim();
    if (!prompt || busy) return;
    setBusy(true);
    setSent(
      mode === "video"
        ? `Génération vidéo ${res} · ${dur} · ${ratio}…`
        : `Génération image ${res} · ${ratio}…`,
    );
    try {
      const result = await generate({
        data: { prompt, mediaType: mode, resolution: res, duration: dur, aspectRatio: ratio },
      });
      if (result.ok) {
        setText("");
        setSent("Génération terminée");
        onGenerated?.();
      } else if (result.reason === "quota") {

        setSent("Quota journalier atteint");
        onQuotaExceeded?.();
      } else {
        setSent(result.message ?? "Génération impossible");
      }
    } catch (error) {
      setSent(error instanceof Error ? error.message : "Génération impossible");
    } finally {
      setBusy(false);
      setTimeout(() => setSent(null), 2600);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-4">
      {sent && (
        <div className="mx-auto mb-2 w-fit rounded-full bg-card px-4 py-2 text-sm animate-fade-in">
          {sent}
        </div>
      )}
      {quota && (
        <div className="mx-auto mb-2 w-fit rounded-full bg-secondary/70 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-xl">
          Reste {formatSeconds(quota.remaining)} / {formatSeconds(quota.limit)} aujourd'hui
        </div>
      )}
      <div className="mb-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/80 p-1 backdrop-blur-xl">
          {["480p", "720p", "1080p"].map((r) => (
            <button key={r} type="button" onClick={() => setRes(r)} className={chip(res === r)}>
              {r}
            </button>
          ))}
        </div>
        {mode === "video" && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/80 p-1 backdrop-blur-xl">
            {["6s", "10s"].map((d) => (
              <button key={d} type="button" onClick={() => setDur(d)} className={chip(dur === d)}>
                {d}
              </button>
            ))}
          </div>
        )}
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/80 p-1 backdrop-blur-xl">
          {["2:3", "1:1", "16:9"].map((r) => (
            <button key={r} type="button" onClick={() => setRatio(r)} className={chip(ratio === r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-border bg-card/60 p-3 backdrop-blur-2xl">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
          }}
          placeholder={
            mode === "video" ? "Décrivez la vidéo à créer (Généré par l'IA)" : "Décrivez l'image à créer"
          }
          className="w-full bg-transparent px-2 pb-3 text-[17px] outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Ajouter"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary"
          >
            <Plus className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
            <button
              type="button"
              aria-label="Image"
              onClick={() => {
                setMode("image");
                focusInput();
              }}
              className={`flex items-center gap-2 rounded-full px-3 py-2 ${
                mode === "image" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              <ImageIcon className="h-5 w-5" />
              {mode === "image" && <span className="text-sm font-medium">Image</span>}
            </button>
            <button
              type="button"
              aria-label="Vidéo"
              onClick={() => {
                setMode("video");
                focusInput();
              }}
              className={`flex items-center gap-2 rounded-full px-3 py-2 ${
                mode === "video" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              <Video className="h-5 w-5" />
              {mode === "video" && <span className="text-sm font-medium">Vidéo</span>}
            </button>
            <button
              type="button"
              aria-label="Emoji"
              className="rounded-full px-3 py-2 text-muted-foreground"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Envoyer"
            onClick={() => void submit()}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            disabled={!text.trim() || busy}
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
