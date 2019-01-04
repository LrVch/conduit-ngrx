import {
  AppSettingsState,
  NIGHT_MODE_THEME,
  DEFAULT_THEME,
  BLUE_THEME,
  BLACK_THEME,
  Language,
  ASIDE_MODE_PUSH,
  ASIDE_MODE_OVER
} from '@app/core/models/app-settings.model';
import { AppSettingsActions, AppSettingsActionTypes } from './app-settings.actions';


export const initialState: AppSettingsState = {
  defaultLanguage: 'en',
  language: '' as Language,
  languages: ['en', 'ru'],
  hour: 0,
  theme: DEFAULT_THEME,
  themes: [DEFAULT_THEME, BLUE_THEME, BLACK_THEME],
  nightTheme: NIGHT_MODE_THEME,
  autoNightMode: false,
  stickyHeader: true,
  asideOpenMode: ASIDE_MODE_PUSH,
  asideOpenModes: [ASIDE_MODE_PUSH, ASIDE_MODE_OVER]
};

export function appSettingsReducer(
  state: AppSettingsState = initialState,
  action: AppSettingsActions
): AppSettingsState {
  switch (action.type) {
    case AppSettingsActionTypes.AppSettingsChangeLanguage:
    case AppSettingsActionTypes.AppSettingsChangeHour:
    case AppSettingsActionTypes.AppSettingsChangeTheme:
    case AppSettingsActionTypes.AppSettingsChangeAutoNightMode:
    case AppSettingsActionTypes.AppSettingsChangeStickyHeader:
    case AppSettingsActionTypes.AppSettingsChangeAsideOpenMode:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
