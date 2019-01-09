import * as fromAuth from './auth.reducer';
import * as fromAuthSelectors from './auth.selectors';
import { getUser, getAuthErrors, getCredentials } from '@app/lib/testing';
import { AppState } from '@app/reducers';

describe('Auth selectores', () => {
  const user = getUser();
  const authErrors = getAuthErrors();
  const initialAuthState: fromAuth.AuthState = {
    loggedIn: false,
    loading: false,
    authErrors: {
      errors: {}
    },
    user: null,
    updatinInfo: false,
    returnUrl: null
  };
  const authState: fromAuth.AuthState = {
    ...initialAuthState,
    user,
    loggedIn: true,
    authErrors
  };
  const appState: AppState = { auth: authState } as AppState;

  describe('selectAuthLoggedIn', () => {
    it('should return "loggedIn" state)', () => {
      const result = fromAuthSelectors.selectAuthLoggedIn(appState);

      expect(result).toBe(true);
    });

    it('should return "loggedIn" state (projector)', () => {
      const result = fromAuthSelectors.selectAuthLoggedIn.projector(authState);

      expect(result).toBe(true);
    });
  });

  describe('selectAuthLoading', () => {
    it('should return "loading" state)', () => {
      const result = fromAuthSelectors.selectAuthLoading(appState);

      expect(result).toBe(false);
    });

    it('should return "loading" state (projector)', () => {
      const result = fromAuthSelectors.selectAuthLoading.projector(authState);

      expect(result).toBe(false);
    });
  });

  describe('selectAuthErrors', () => {
    it('should return "authErrors" state)', () => {
      const result = fromAuthSelectors.selectAuthErrors(appState);

      expect(result).toBe(authErrors);
    });

    it('should return "authErrors" state (projector)', () => {
      const result = fromAuthSelectors.selectAuthErrors.projector(authState);

      expect(result).toBe(authErrors);
    });
  });

  describe('selectUser', () => {
    it('should return "user" state)', () => {
      const result = fromAuthSelectors.selectUser(appState);

      expect(result).toBe(user);
    });

    it('should return "user" state (projector)', () => {
      const result = fromAuthSelectors.selectUser.projector(authState);

      expect(result).toBe(user);
    });
  });

  describe('selectUserUpdatingInfo', () => {
    it('should return "updatinInfo" state)', () => {
      const result = fromAuthSelectors.selectUserUpdatingInfo(appState);

      expect(result).toBe(false);
    });

    it('should return "updatinInfo" state (projector)', () => {
      const result = fromAuthSelectors.selectUserUpdatingInfo.projector(
        authState
      );

      expect(result).toBe(false);
    });
  });

  describe('selectReturnUrl', () => {
    it('should return "returnUrl" state)', () => {
      const result = fromAuthSelectors.selectReturnUrl(appState);

      expect(result).toBe(null);
    });

    it('should return "returnUrl" state (projector)', () => {
      const result = fromAuthSelectors.selectReturnUrl.projector(authState);

      expect(result).toBe(null);
    });
  });
});
