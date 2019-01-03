import { Action } from '@ngrx/store';
import { AppSettingsState } from '@app/core/models/app-settings.model';
import { AppSettingsActions, AppSettingsActionTypes } from './app-settings.actions';


export const initialState: AppSettingsState = {
  language: 'ru',
  languages: ['en', 'ru']
};

export function appSettingsReducer(
  state: AppSettingsState = initialState,
  action: AppSettingsActions
): AppSettingsState {
  switch (action.type) {
    case AppSettingsActionTypes.AppSettingsChangeLanguage:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
