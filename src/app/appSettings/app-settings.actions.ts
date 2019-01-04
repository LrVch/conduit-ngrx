import { Action } from '@ngrx/store';
import { Language, AsideOpenMode } from '@app/core/models/app-settings.model';

export enum AppSettingsActionTypes {
  AppSettingsChangeLanguage = '[AppSettings] Change Language',
  AppSettingsChangeHour = '[AppSettings] Change Hour',
  AppSettingsChangeTheme = '[AppSettings] Change Theme',
  AppSettingsChangeAutoNightMode = '[AppSettings] Change AutoNightMode',
  AppSettingsChangeStickyHeader = '[AppSettings] Change Sticky Header',
  AppSettingsChangeAsideOpenMode = '[AppSettings] Change Aside Open Mode'
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

export class AppSettingsChangeStickyHeader implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeStickyHeader;

  constructor(readonly payload: { stickyHeader: boolean }) {}
}

export class AppSettingsChangeAsideOpenMode implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeAsideOpenMode;

  constructor(readonly payload: { asideOpenMode: AsideOpenMode }) {}
}

export type AppSettingsActions =
  AppSettingsChangeLanguage
  | AppSettingsChangeHour
  | AppSettingsChangeTheme
  | AppSettingsChangeAutoNightMode
  | AppSettingsChangeStickyHeader
  | AppSettingsChangeAsideOpenMode;
