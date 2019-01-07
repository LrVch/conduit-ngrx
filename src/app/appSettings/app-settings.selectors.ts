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
  (settingsState: AppSettingsState) => settingsState.theme
);

export const selectAppSettingsThemes = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.themes
);

export const selectAppSettingsAutoNightMode = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.autoNightMode
);

export const selectAppSettingsNightTheme = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.nightTheme
);

export const selectAppSettingsHour = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.hour
);

export const selectAppSettingsNightModeTo = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.nightModeto
);

export const selectAppSettingsNightModeFrom = createSelector(
  selectAppSettingsState,
  (settingsState: AppSettingsState) => settingsState.nightModefrom
);

export const selectAppSettingsIsNightHour = createSelector(
  selectAppSettingsAutoNightMode,
  selectAppSettingsHour,
  selectAppSettingsNightModeFrom,
  selectAppSettingsNightModeTo,
  (autoNightMode, hour, nightModefrom, nightModeto) => {
    const solid = nightModefrom < nightModeto;
    return solid ?
      autoNightMode && (hour >= nightModefrom && hour < nightModeto)
      :
      autoNightMode && (hour >= nightModefrom || hour < nightModeto);
  }
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
