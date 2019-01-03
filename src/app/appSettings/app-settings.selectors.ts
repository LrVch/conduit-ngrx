import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { AppSettingsState } from '@app/core/models/app-settings.model';

export const selectAppSettingsState = createFeatureSelector<AppState, AppSettingsState>('appSettings');

export const selectAppSettingsStateLanguage = createSelector(
    selectAppSettingsState,
  (articlesState: AppSettingsState) => articlesState.language
);

export const selectAppSettingsStateLanguages = createSelector(
  selectAppSettingsState,
(articlesState: AppSettingsState) => articlesState.languages
);
