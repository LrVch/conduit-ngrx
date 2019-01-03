import { AppSettingsState } from '@app/core/models/app-settings.model';
import { AppSettingsActions, AppSettingsActionTypes } from './app-settings.actions';


export const initialState: AppSettingsState = {
  defaultLanguage: 'en',
  language: '',
  languages: ['en', 'ru'],
  hour: 0
};

export function appSettingsReducer(
  state: AppSettingsState = initialState,
  action: AppSettingsActions
): AppSettingsState {
  switch (action.type) {
    case AppSettingsActionTypes.AppSettingsChangeLanguage:
    case AppSettingsActionTypes.AppSettingsChangeHour:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
