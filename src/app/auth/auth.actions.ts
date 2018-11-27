import { Action } from '@ngrx/store';
import { Credentials } from '../core/models/credentials.model';
import { User, Errors } from '../core';

export enum AuthActionTypes {
  LoginPageAttemptLogin = '[Login Page] Attempt Login',
  LoginSuccess = '[Auth API] Login success',
  LoginFail = '[Auth API] Login fail',
  LoginAttemptCopmlete = '[Auth API] Login Attempt Copmlete',
  LoginPageSetAuthErrors = '[Auth API] Set Auth Errors',
  LoginPageClearAuthErrors = '[Login Page] Clear Auth Errors',
  LoggedLocalStorageRequest = '[LocalStorage] Login success Request',
  LoggedLocalStorage = '[LocalStorage] Login success',
  ClearAuthErrors = '[Login Page] Clear Auth Errors',
  SettingsPageLogoutAction = '[Settings Page] Logout',
  LogoutConfirm = '[Auth] Logout Confirm',
  LogoutAction = '[Auth] Logout',

  UpdateUserRequest = '[Auth API] Update User Request',
  UpdateUserSuccess = '[Auth API] Update User Success',
  UpdateUserFail = '[Auth API] Update User Fail',
  SetUpdateUserErrors = '[Auth API] Set Update User Errors'
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;

  constructor(public payload: { user: User }) { }
}

export class LoggedLocalStorage implements Action {
  readonly type = AuthActionTypes.LoggedLocalStorage;

  constructor(public payload: { user: User }) { }
}

export class LoggedLocalStorageRequest implements Action {
  readonly type = AuthActionTypes.LoggedLocalStorageRequest;
}

export class LoginFail implements Action {
  readonly type = AuthActionTypes.LoginFail;

  constructor(public payload: { authErrors: Errors }) { }
}

export class LoginAttemptCopmlete implements Action {
  readonly type = AuthActionTypes.LoginAttemptCopmlete;
}

export class SettingsPageLogoutAction implements Action {
  readonly type = AuthActionTypes.SettingsPageLogoutAction;

  constructor(public payload: { question: string }) { }
}

export class LogoutConfirm implements Action {
  readonly type = AuthActionTypes.LogoutConfirm;
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class LoginPageAttemptLogin implements Action {
  readonly type = AuthActionTypes.LoginPageAttemptLogin;

  constructor(public payload: { authType: string, credentials: Credentials }) { }
}

export class LoginPageClearAuthErrors implements Action {
  readonly type = AuthActionTypes.LoginPageClearAuthErrors;
}

export class ClearAuthErrors implements Action {
  readonly type = AuthActionTypes.ClearAuthErrors;
}


export class LoginPageSetAuthErrors implements Action {
  readonly type = AuthActionTypes.LoginPageSetAuthErrors;

  constructor(public payload: { authErrors: Errors }) { }
}

export class SetUpdateUserErrors implements Action {
  readonly type = AuthActionTypes.SetUpdateUserErrors;

  constructor(public payload: { authErrors: Errors }) { }
}

export class UpdateUserRequest implements Action {
  readonly type = AuthActionTypes.UpdateUserRequest;

  constructor(public payload: { user: User }) { }
}

export class UpdateUserSuccess implements Action {
  readonly type = AuthActionTypes.UpdateUserSuccess;

  constructor(public payload: { user: User }) { }
}

export class UpdateUserFail implements Action {
  readonly type = AuthActionTypes.UpdateUserFail;

  constructor(public payload: { errors: Errors }) { }
}

export type AuthActions =
  LoginSuccess
  | LoginFail
  | SettingsPageLogoutAction
  | LogoutConfirm
  | LogoutAction
  | LoginAttemptCopmlete
  | LoginPageAttemptLogin
  | LoggedLocalStorage
  | LoggedLocalStorageRequest
  | LoginPageClearAuthErrors
  | ClearAuthErrors
  | LoginPageSetAuthErrors
  | UpdateUserRequest
  | UpdateUserSuccess
  | UpdateUserFail
  | SetUpdateUserErrors;


