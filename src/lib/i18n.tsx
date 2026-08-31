import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ln", label: "Lingala" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const fr: Dict = {
  settings: "Paramètres",
  profile: "Profil",
  storage: "Stockage",
  report: "Signaler un problème",
  appearance: "Apparence",
  language: "Langue de l'application",
  notifications: "Notifications",
  close: "Fermer",
  back: "Retour",
  save: "Enregistrer",
  submit: "Soumettre",
  subscription: "ABONNEMENT",
  application: "APPLICATION",
  brandSection: "SAM FLASH",
  data: "DONNÉES ET INFORMATIONS",
  haptics: "Haptique",
  customize: "Personnaliser Sam flash",
  skills: "Compétences",
  advanced: "Avancé",
  voiceMode: "Ouvrir l'application en mode vocal",
  alwaysOn: "Toujours activé",
  suggestion: "Suggestion",
  advancedMode: "Mode avancé",
  sharedChats: "Conversations partagées",
  dataControls: "Contrôles de données",
  rate: "Évaluer l'application",
  terms: "Conditions d'utilisation",
  privacy: "Politique de confidentialité",
  signOut: "Se déconnecter",
  credits: "crédits disponibles",
  fullName: "Nom complet",
  email: "E-mail",
  creditsLabel: "Crédits",
  changeAvatar: "Modifier",
  cache: "Cache de l'application",
  clearCache: "Vider le cache",
  imagesGenerated: "Images générées",
  videosGenerated: "Vidéos générées",
  creditsLeft: "Crédits restants",
  rateTitle: "Votre avis compte",
  rateSub: "Attribuez une note à Sam flash 2.0",
  reviewPlaceholder: "Partagez votre expérience (facultatif)…",
  send: "Envoyer",
  cancel: "Annuler",
  thanks: "Merci pour votre évaluation !",
  saved: "Profil enregistré",
  saveError: "Enregistrement impossible",
  langChanged: "Langue mise à jour",
  tryPro: "Essayez Sam flash 2.0 Pro",
  tryProSub: "Premium Chat, Voix et Images",
  try: "Essayer",
};

const en: Dict = {
  settings: "Settings",
  profile: "Profile",
  storage: "Storage",
  report: "Report a problem",
  appearance: "Appearance",
  language: "App language",
  notifications: "Notifications",
  close: "Close",
  back: "Back",
  save: "Save",
  submit: "Submit",
  subscription: "SUBSCRIPTION",
  application: "APPLICATION",
  brandSection: "SAM FLASH",
  data: "DATA & INFORMATION",
  haptics: "Haptics",
  customize: "Customize Sam flash",
  skills: "Skills",
  advanced: "Advanced",
  voiceMode: "Open the app in voice mode",
  alwaysOn: "Always on",
  suggestion: "Suggestion",
  advancedMode: "Advanced mode",
  sharedChats: "Shared conversations",
  dataControls: "Data controls",
  rate: "Rate the app",
  terms: "Terms of use",
  privacy: "Privacy policy",
  signOut: "Sign out",
  credits: "credits available",
  fullName: "Full name",
  email: "Email",
  creditsLabel: "Credits",
  changeAvatar: "Change",
  cache: "App cache",
  clearCache: "Clear cache",
  imagesGenerated: "Generated images",
  videosGenerated: "Generated videos",
  creditsLeft: "Remaining credits",
  rateTitle: "Your opinion matters",
  rateSub: "Rate Sam flash 2.0",
  reviewPlaceholder: "Share your experience (optional)…",
  send: "Send",
  cancel: "Cancel",
  thanks: "Thanks for your rating!",
  saved: "Profile saved",
  saveError: "Could not save",
  langChanged: "Language updated",
  tryPro: "Try Sam flash 2.0 Pro",
  tryProSub: "Premium Chat, Voice and Images",
  try: "Try",
};

const es: Dict = {
  ...en,
  settings: "Ajustes",
  profile: "Perfil",
  storage: "Almacenamiento",
  report: "Informar de un problema",
  appearance: "Apariencia",
  language: "Idioma de la aplicación",
  notifications: "Notificaciones",
  close: "Cerrar",
  back: "Volver",
  save: "Guardar",
  submit: "Enviar",
  subscription: "SUSCRIPCIÓN",
  application: "APLICACIÓN",
  data: "DATOS E INFORMACIÓN",
  haptics: "Háptica",
  customize: "Personalizar Sam flash",
  skills: "Habilidades",
  advanced: "Avanzado",
  voiceMode: "Abrir la aplicación en modo voz",
  alwaysOn: "Siempre activo",
  suggestion: "Sugerencia",
  advancedMode: "Modo avanzado",
  sharedChats: "Conversaciones compartidas",
  dataControls: "Control de datos",
  rate: "Valorar la aplicación",
  terms: "Términos de uso",
  privacy: "Política de privacidad",
  signOut: "Cerrar sesión",
  credits: "créditos disponibles",
  fullName: "Nombre completo",
  email: "Correo",
  creditsLabel: "Créditos",
  changeAvatar: "Modificar",
  cache: "Caché de la aplicación",
  clearCache: "Vaciar caché",
  imagesGenerated: "Imágenes generadas",
  videosGenerated: "Vídeos generados",
  creditsLeft: "Créditos restantes",
  rateTitle: "Tu opinión importa",
  rateSub: "Valora Sam flash 2.0",
  send: "Enviar",
  cancel: "Cancelar",
  thanks: "¡Gracias por tu valoración!",
  saved: "Perfil guardado",
  saveError: "No se pudo guardar",
  langChanged: "Idioma actualizado",
};

const ln: Dict = {
  ...fr,
  settings: "Bibongisi",
  profile: "Profil",
  storage: "Ebombelo",
  appearance: "Bomonani",
  language: "Monoko ya application",
  save: "Kobomba",
  close: "Kokanga",
  back: "Kozonga",
  signOut: "Kobima",
  rate: "Kopesa note na application",
  terms: "Mibeko ya kosalela",
  privacy: "Politiki ya bosekseki",
  alwaysOn: "Efungwami ntango nyonso",
  suggestion: "Likanisi",
  advancedMode: "Mode ya likolo",
  thanks: "Matondi mpo na note na yo!",
  saved: "Profil ebombami",
  langChanged: "Monoko ebongwani",
};

const DICTS: Record<LangCode, Dict> = { fr, en, es, ln };

type I18nValue = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "samflash.lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => DICTS[lang][key] ?? fr[key] ?? key,
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
