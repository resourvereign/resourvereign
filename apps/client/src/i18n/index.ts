import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslations from './en.json';
import esTranslations from './es.json';

const resources = {
  en: enTranslations,
  es: esTranslations,
};

export const locales = Object.keys(resources) as (keyof typeof resources)[];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: false,
    supportedLngs: Object.keys(resources),
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
