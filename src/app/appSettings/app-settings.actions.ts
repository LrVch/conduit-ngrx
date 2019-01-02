import { Action } from '@ngrx/store';
import { Language } from '@app/core/models/app-settings.model';

export enum AppSettingsActionTypes {
  AppSettingsChangeLanguage = '[ AppSettings] Change Language',
}

export class AppSettingsChangeLanguage implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeLanguage;

  constructor(readonly payload: { language: Language }) {}
}

export type AppSettingsActions =
AppSettingsChangeLanguage;
