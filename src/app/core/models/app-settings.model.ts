export const BLACK_THEME = 'BLACK-THEME';
export const DEFAULT_THEME = 'DEFAULT-THEME';
export const BLUE_THEME = 'BLUE-THEME';
export const NIGHT_MODE_THEME = BLACK_THEME;

export type Language = 'en' | 'ru';

export const ASIDE_MODE_PUSH = 'push';
export const ASIDE_MODE_OVER = 'over';
export type AsideOpenMode = 'push' | 'over';

export interface AppSettingsState {
  defaultLanguage: Language;
  language: Language;
  languages: Language[];
  hour: number;
  theme: string;
  themes: string[];
  autoNightMode: boolean;
  nightTheme: string;
  stickyHeader: boolean;
  asideOpenMode: AsideOpenMode;
  asideOpenModes: AsideOpenMode[];

//   pageAnimations: boolean;
//   pageAnimationsDisabled: boolean;
//   elementsAnimations: boolean;
}
