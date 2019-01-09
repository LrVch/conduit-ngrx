import { Action } from '@ngrx/store';
import { Language, AsideOpenMode } from '@app/core/models/app-settings.model';
import { RouteAnimationChangeType } from '@app/core';

export enum AppSettingsActionTypes {
  AppSettingsChangeLanguage = '[AppSettings] Change Language',
  AppSettingsChangeHour = '[AppSettings] Change Hour',
  AppSettingsChangeTheme = '[AppSettings] Change Theme',
  AppSettingsChangeAutoNightMode = '[AppSettings] Change AutoNightMode',
  AppSettingsChangeStickyHeader = '[AppSettings] Change Sticky Header',
  AppSettingsChangeAsideOpenMode = '[AppSettings] Change Aside Open Mode',
  AppSettingsChangeNightModeFrom = '[AppSettings] Change Night Mode From',
  AppSettingsChangeNightModeTo = '[AppSettings] Change Night Mode To',
  AppSettingsUpdateEffectiveTheme = '[AppSettings] Update Effective Theme',
  AppSettingsChangeRouteAnimationEnabled = '[AppSettings] Change Route Animation Enabled',
  AppSettingsChangeRouteAnimationType = '[AppSettings] Change Route Animation Type'
}

export class AppSettingsChangeLanguage implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeLanguage;

  constructor(readonly payload: { language: Language }) {}
}

export class AppSettingsChangeHour implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeHour;

  constructor(readonly payload: { hour: number }) {}
}

export class AppSettingsChangeTheme implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeTheme;

  constructor(readonly payload: { theme: string }) {}
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

export class AppSettingsChangeNightModeFrom implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeNightModeFrom;

  constructor(readonly payload: { nightModefrom: number }) {}
}

export class AppSettingsChangeNightModeTo implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeNightModeTo;

  constructor(readonly payload: { nightModeto: number }) {}
}

export class AppSettingsUpdateEffectiveTheme implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsUpdateEffectiveTheme;

  constructor(readonly payload: { effectiveTheme: string }) {}
}

export class AppSettingsChangeRouteAnimationEnabled implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeRouteAnimationEnabled;

  constructor(readonly payload: { routeAnimationEnabled: boolean }) {}
}

export class AppSettingsChangeRouteAnimationType implements Action {
  readonly type = AppSettingsActionTypes.AppSettingsChangeRouteAnimationType;

  constructor(
    readonly payload: { routeAnimationsChangeType: RouteAnimationChangeType }
  ) {}
}

export type AppSettingsActions =
  | AppSettingsChangeLanguage
  | AppSettingsChangeHour
  | AppSettingsChangeTheme
  | AppSettingsChangeAutoNightMode
  | AppSettingsChangeStickyHeader
  | AppSettingsChangeAsideOpenMode
  | AppSettingsChangeNightModeFrom
  | AppSettingsChangeNightModeTo
  | AppSettingsUpdateEffectiveTheme
  | AppSettingsChangeRouteAnimationEnabled
  | AppSettingsChangeRouteAnimationType;
