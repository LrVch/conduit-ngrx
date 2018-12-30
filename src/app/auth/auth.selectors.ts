import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AppState, AuthState>('auth');

export const selectAuthLoggedIn = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.loggedIn
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.loading
);

export const selectAuthErrors = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.authErrors
);

export const selectUser = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.user
);

export const selectUserUpdatingInfo = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.updatinInfo
);

export const selectReturnUrl = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.returnUrl
);
