import { Action } from '@ngrx/store';
import { User, Errors } from '../core';
import { AuthActions, AuthActionTypes } from './auth.actions';


export interface AuthState {
  loggedIn: boolean;
  loading: boolean;
  updatinInfo: boolean;
  authErrors: Errors;
  user: User;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  loading: false,
  authErrors: {
    errors: {}
  },
  user: null,
  updatinInfo: false
};

export function authReducer(
  state: AuthState = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginSuccess:
    case AuthActionTypes.LoggedLocalStorage:
      return {
        ...state,
        user: action.payload.user,
        loggedIn: true,
        loading: false
      };
    case AuthActionTypes.LoggedLocalStorageRequest:
      return {
        ...state,
        loggedIn: true,
      };
    case AuthActionTypes.LoginFail:
    case AuthActionTypes.LogoutConfirm:
    case AuthActionTypes.LogoutAction:
      return {
        ...state,
        loggedIn: false,
        user: null,
        loading: false
      };
    case AuthActionTypes.LoginPageAttemptLogin:
      return {
        ...state,
        loading: true,
        authErrors: {
          errors: {}
        }
      };
    case AuthActionTypes.LoginPageClearAuthErrors:
    case AuthActionTypes.ClearAuthErrors:
      return {
        ...state,
        authErrors: {
          errors: {}
        }
      };
    case AuthActionTypes.LoginPageSetAuthErrors:
    case AuthActionTypes.SetUpdateUserErrors:
      const { authErrors } = action.payload;
      return {
        ...state,
        authErrors
      };
    case AuthActionTypes.UpdateUserRequest:
      return {
        ...state,
        updatinInfo: true,
        authErrors: {
          errors: {}
        }
      };
    case AuthActionTypes.UpdateUserSuccess:
      return {
        ...state,
        updatinInfo: false,
        user: action.payload.user
      };
    case AuthActionTypes.UpdateUserFail:
      return {
        ...state,
        updatinInfo: false
      };
    default:
      return state;
  }
}

