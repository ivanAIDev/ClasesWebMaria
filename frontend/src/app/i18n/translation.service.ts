import { Injectable, signal, computed } from '@angular/core';
import { TRANSLATIONS, LANGUAGES, Lang, LangOption } from './translations';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly STORAGE_KEY = 'webclases_lang';

  readonly currentLang = signal<Lang>(this.getInitialLang());
  readonly languages: LangOption[] = LANGUAGES;

  readonly currentLangOption = computed(() =>
    LANGUAGES.find(l => l.code === this.currentLang()) || LANGUAGES[0]
  );

  setLang(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  t(key: string): string {
    return TRANSLATIONS[this.currentLang()]?.[key] ?? key;
  }

  private getInitialLang(): Lang {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Lang | null;
    if (stored && TRANSLATIONS[stored]) return stored;

    // Detect browser language
    const browserLang = navigator.language?.split('-')[0] as Lang;
    if (browserLang && TRANSLATIONS[browserLang]) return browserLang;

    return 'es';
  }
}
