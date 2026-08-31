/** Petit carillon type « Apple motion » joué via WebAudio (aucun fichier requis). */
export function playAppleChime() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    // Deux notes montantes (Mi5 → Si5), timbre doux
    [
      { f: 659.25, t: 0 },
      { f: 987.77, t: 0.12 },
    ].forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.9, now + t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.9);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + t);
      osc.stop(now + t + 1);
    });

    setTimeout(() => void ctx.close().catch(() => undefined), 1500);
  } catch {
    /* audio indisponible */
  }
}
