import { Action } from '@ngrx/store';

export enum AppSettingsActionTypes {
  LoadAppSettingss = '[AppSettings] Load AppSettingss'
}

export class LoadAppSettingss implements Action {
  readonly type = AppSettingsActionTypes.LoadAppSettingss;
}

export type AppSettingsActions = LoadAppSettingss;
