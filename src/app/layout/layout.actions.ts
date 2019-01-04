import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  ShowMainLoader = '[Layout] Show Main Loader',
  HideMainLoader = '[Layout] Hide Main Loader',
  ToggleSideNav = '[Layout] Toggle Side Nav',
}

export class ShowMainLoader implements Action {
  readonly type = LayoutActionTypes.ShowMainLoader;
}

export class HideMainLoader implements Action {
  readonly type = LayoutActionTypes.HideMainLoader;
}

export class ToggleSideNav implements Action {
  readonly type = LayoutActionTypes.ToggleSideNav;

  constructor(readonly payload?: { close?: boolean }) { }
}


export type LayoutActions =
  ShowMainLoader
  | HideMainLoader
  | ToggleSideNav;
