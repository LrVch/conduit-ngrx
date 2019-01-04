export const NIGHT_MODE_THEME = 'BLACK-THEME';
export const DEFAULT_THEME = 'DEFAULT-THEME';
export const BLUE_THEME = 'BLUE-THEME';

export type Language = 'en' | 'ru';

export interface AppSettingsState {
  defaultLanguage: string;
  language: string;
  languages: string[];
  hour: number;
  theme: string;
  autoNightMode: boolean;
  nightTheme: string;
  stickyHeader: boolean;
//   pageAnimations: boolean;
//   pageAnimationsDisabled: boolean;
//   elementsAnimations: boolean;
}
