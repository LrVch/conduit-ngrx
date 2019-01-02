import { Action } from '@ngrx/store';
import { AppSettingsState } from '@app/core/models/app-settings.model';


export const initialState: AppSettingsState = {
  language: 'en',
};

export function appSettingsReducer(state = initialState, action: Action): AppSettingsState {
  switch (action.type) {

    default:
      return state;
  }
}
