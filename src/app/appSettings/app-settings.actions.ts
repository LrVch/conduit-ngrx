import { Action } from '@ngrx/store';
import { Language } from '@app/core/models/app-settings.model';

export enum AppSettingsActionTypes {
  AppSettingsChangeLanguage = '[ AppSettings] Change Language',
  AppSettingsChangeHour = '[ AppSettings] Change Hour',
}

export class AppSettingsChangeLanguage implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeLanguage;

  constructor(readonly payload: { language: Language }) { }
}

export class AppSettingsChangeHour implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeHour;

  constructor(readonly payload: { hour: number }) { }
}

export type AppSettingsActions =
  AppSettingsChangeLanguage
  | AppSettingsChangeHour;
