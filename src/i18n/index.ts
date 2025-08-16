import type { SectionKey, Translation } from "@/types";
import { Language } from "@/validators/lang";

// COUNTRY
export const TITLE_PREFIX: Translation = {
  es: "Sueldos del Gobierno de",
  en: "Salaries of the Government of",
  fr: "Salaires du Gouvernement de",
  pt: "Salários do Governo de",
  de: "Gehälter der Regierung von",
};

export const DESCRIPTION_TEMPLATE: Translation = {
  es: "Listado de sueldos del Gobierno de {{name}}, actualizado a {{date}}",
  en: "A listing of Government salaries of {{name}}, updated {{date}}",
  fr: "Liste des salaires du Gouvernement de {{name}}, mise à jour le {{date}}",
  pt: "Lista de salários do Governo de {{name}}, atualizado em {{date}}",
  de: "Liste der Gehälter der Regierung von {{name}}, aktualisiert am {{date}}",
};

// HEADER
export const LANGUAGE_NAMES: Record<Language, Translation> = {
  en: {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    de: "German",
  },
  es: {
    en: "Inglés",
    es: "Español",
    fr: "Francés",
    pt: "Portugués",
    de: "Alemán",
  },
  fr: {
    en: "Anglais",
    es: "Espagnol",
    fr: "Français",
    pt: "Portugais",
    de: "Allemand",
  },
  pt: {
    en: "Inglês",
    es: "Espanhol",
    fr: "Francês",
    pt: "Português",
    de: "Alemão",
  },
  de: {
    en: "Englisch",
    es: "Spanisch",
    fr: "Französisch",
    pt: "Portugiesisch",
    de: "Deutsch",
  },
};

// FOOTER
export const FOOTER_MESSAGE: Translation = {
  es: "Ayuda a mejorar la precisión - verifica y contribuye con la data pública",
  en: "Help improve accuracy - verify and contribute to public data",
  fr: "Aidez à améliorer la précision - vérifiez et contribuez au data public",
  pt: "Ajude a melhorar a precisão - verifique e contribua para o data público",
  de: "Helfen Sie die Genauigkeit zu verbessern - überprüfen und tragen Sie zur data bei",
};

// OFFICIALS
export const SECTION_TITLES: Record<SectionKey, Translation> = {
  executive: {
    es: "Ejecutivo",
    en: "Executive",
    fr: "Exécutif",
    pt: "Executivo",
    de: "Exekutive",
  },
  royalty: {
    es: "Casa Real",
    en: "Royal Family",
    fr: "Famille Royale",
    pt: "Família Real",
    de: "Königshaus",
  },
  ministers: {
    es: "Ministros",
    en: "Ministers",
    fr: "Ministres",
    pt: "Ministros",
    de: "Minister",
  },
  deputies: {
    es: "Diputados",
    en: "Deputies",
    fr: "Députés",
    pt: "Deputados",
    de: "Abgeordnete",
  },
  senate: {
    es: "Senado",
    en: "Senate",
    fr: "Sénat",
    pt: "Senado",
    de: "Senat",
  },
  officials: {
    en: "Officials",
    es: "Funcionarios",
    fr: "Fonctionnaires",
    pt: "Funcionários",
    de: "Beamte",
  },
};

export const TEXT_TRANSLATION: Record<string, Translation> = {
  budget: {
    en: "Budget",
    es: "Presupuesto",
    fr: "Budget",
    pt: "Orçamento",
    de: "Haushalt",
  },
  GDP: {
    en: "GDP",
    es: "PIB",
    fr: "PIB",
    pt: "PIB",
    de: "BIP",
  },
  ministries: {
    en: "Ministries",
    es: "Ministerios",
    fr: "Ministères",
    pt: "Ministérios",
    de: "Ministerien",
  },
  stats: {
    en: "Stats",
    es: "Estadísticas",
    fr: "Statistiques",
    pt: "Estatísticas",
    de: "Statistiken",
  },
};
