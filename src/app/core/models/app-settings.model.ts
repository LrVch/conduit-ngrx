import { RouteAnimationChangeType } from '@app/core';

export const BLACK_THEME = 'BLACK-THEME';
export const DEFAULT_THEME = 'DEFAULT-THEME';
export const BLUE_THEME = 'BLUE-THEME';
export const NIGHT_MODE_THEME = BLACK_THEME;

export type Language = 'en' | 'ru' | string;

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
  effectiveTheme: string;
  autoNightMode: boolean;
  nightModeto: number;
  nightModefrom: number;
  nightTheme: string;
  stickyHeader: boolean;
  asideOpenMode: AsideOpenMode;
  asideOpenModes: AsideOpenMode[];
  routeAnimationEnabled: boolean;
  routeAnimationsChangeType: RouteAnimationChangeType;
  routeAnimationsChangeTypes: RouteAnimationChangeType[];
}
