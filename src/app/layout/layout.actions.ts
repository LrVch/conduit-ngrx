import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  ShowMainLoader = '[Layout] Show Main Loader',
  HideMainLoader = '[Layout] Hide Main Loader',
}

export class ShowMainLoader implements Action {
  readonly type = LayoutActionTypes.ShowMainLoader;
}

export class HideMainLoader implements Action {
  readonly type = LayoutActionTypes.HideMainLoader;
}

export type LayoutActions = ShowMainLoader | HideMainLoader;
