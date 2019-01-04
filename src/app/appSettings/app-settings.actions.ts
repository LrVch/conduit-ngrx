import { Action } from '@ngrx/store';
import { Language } from '@app/core/models/app-settings.model';

export enum AppSettingsActionTypes {
  AppSettingsChangeLanguage = '[AppSettings] Change Language',
  AppSettingsChangeHour = '[AppSettings] Change Hour',
  AppSettingsChangeTheme = '[AppSettings] Change Theme',
  AppSettingsChangeAutoNightMode = '[AppSettings] Change AutoNightMode'
}

export class AppSettingsChangeLanguage implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeLanguage;

  constructor(readonly payload: { language: Language }) { }
}

export class AppSettingsChangeHour implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeHour;

  constructor(readonly payload: { hour: number }) { }
}

export class AppSettingsChangeTheme implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeTheme;

  constructor(readonly payload: { theme: string }) { }
}

export class AppSettingsChangeAutoNightMode implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeAutoNightMode;

  constructor(readonly payload: { autoNightMode: boolean }) {}
}

export type AppSettingsActions =
  AppSettingsChangeLanguage
  | AppSettingsChangeHour
  | AppSettingsChangeTheme
  | AppSettingsChangeAutoNightMode;
