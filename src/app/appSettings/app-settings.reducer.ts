import { AppSettingsState, NIGHT_MODE_THEME, DEFAULT_THEME } from '@app/core/models/app-settings.model';
import { AppSettingsActions, AppSettingsActionTypes } from './app-settings.actions';


export const initialState: AppSettingsState = {
  defaultLanguage: 'en',
  language: '',
  languages: ['en', 'ru'],
  hour: 0,
  theme: DEFAULT_THEME,
  nightTheme: NIGHT_MODE_THEME,
  autoNightMode: false,
  stickyHeader: false
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
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
