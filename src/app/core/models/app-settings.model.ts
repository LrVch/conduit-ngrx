export const NIGHT_MODE_THEME = 'BLACK-THEME';

export type Language = 'en' | 'ru';

export interface AppSettingsState {
  defaultLanguage: string;
  language: string;
  languages: string[];
//   theme: string;
//   autoNightMode: boolean;
//   nightTheme: string;
//   stickyHeader: boolean;
//   pageAnimations: boolean;
//   pageAnimationsDisabled: boolean;
//   elementsAnimations: boolean;
//   hour: number;
}
