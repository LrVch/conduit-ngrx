import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { AppSettingsState } from '@app/core/models/app-settings.model';

export const selectAppSettingsState = createFeatureSelector<AppState, AppSettingsState>('appSettings');

export const selectAppSettingsStateAll = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState
);

export const selectAppSettingsTheme = createSelector(
  selectAppSettingsState,
  settings => settings.theme
);

export const selectAppSettingsThemes = createSelector(
  selectAppSettingsState,
  settings => settings.themes
);

export const selectAppSettingsAutoNightMode = createSelector(
  selectAppSettingsState,
  settings => settings.autoNightMode
);

export const  selectAppSettingsNightTheme = createSelector(
  selectAppSettingsState,
  settings => settings.nightTheme
);

export const selectAppSettingsHour = createSelector(
  selectAppSettingsState,
  settings => settings.hour
);

export const selectAppSettingsIsNightHour = createSelector(
  selectAppSettingsAutoNightMode,
  selectAppSettingsHour,
  (autoNightMode, hour) => autoNightMode && (hour >= 21 || hour <= 7)
);

export const selectAppSettingsStateLanguage = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.language
);

export const selectAppSettingsDefaultLanguage = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.defaultLanguage
);

export const selectAppSettingsStateLanguages = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.languages
);

export const selectAppSettingsEffectiveTheme = createSelector(
  selectAppSettingsTheme,
  selectAppSettingsNightTheme,
  selectAppSettingsIsNightHour,
  (theme, nightTheme, isNightHour) =>
    (isNightHour ? nightTheme : theme).toLowerCase()
);

export const selectAppSettingsStickyHeader = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.stickyHeader
);

export const selectAppSettingsAsideOpenMode = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.asideOpenMode
);

export const selectAppSettingsAsideOpenModes = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.asideOpenModes
);
