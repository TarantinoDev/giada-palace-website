import { ui, languages, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first && first in languages && first !== 'it') return first as Lang;
  return 'it';
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => {
    const dict = ui[lang] as unknown as Record<string, string>;
    const fallback = ui.it as unknown as Record<string, string>;
    return dict[key] ?? fallback[key] ?? key;
  };
}

/**
 * Swap the locale prefix on a pathname.
 * Strips any existing /en|de|fr/ prefix, then prepends the target locale.
 * IT has no prefix (default locale, prefixDefaultLocale: false).
 */
export function getPathWithLang(currentPath: string, targetLang: Lang): string {
  const clean = currentPath.replace(/^\/(en|de|fr)(\/|$)/, '/') || '/';
  if (targetLang === 'it') return clean;
  return clean === '/' ? `/${targetLang}/` : `/${targetLang}${clean}`;
}
