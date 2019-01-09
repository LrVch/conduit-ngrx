import * as fromAuth from './auth.reducer';
import {
  LoginSuccess,
  LoggedLocalStorage,
  LoggedLocalStorageRequest,
  LoginFail,
  LogoutConfirm,
  LogoutAction,
  LoginPageAttemptLogin,
  LoginPageClearAuthErrors,
  ClearAuthErrors,
  LoginPageSetAuthErrors,
  SetUpdateUserErrors,
  UpdateUserRequest,
  UpdateUserSuccess,
  UpdateUserFail,
  SetReturnUrl,
  ClearReturnStateFromRouteChange
} from './auth.actions';
import { getUser, getAuthErrors, getCredentials } from '@app/lib/testing';

describe('Auth Reducer', () => {
  const user = getUser();
  const authErrors = getAuthErrors();
  const errors = getAuthErrors();
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
  const credentials = getCredentials();

  describe('State changes', () => {
    it('should have an initial state', () => {
      const state = fromAuth.authReducer(initialAuthState, {
        type: '@@init'
      } as any);

      expect(state).toBe(initialAuthState);
    });

    it('should load user on success', () => {
      const init = { type: '@@init' } as any;
      const loginSuccess = new LoginSuccess({ user });

      const state = [init, loginSuccess].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should load user on localstorage logged success', () => {
      const init = { type: '@@init' } as any;
      const loggedLocalStorage = new LoggedLocalStorage({ user });

      const state = [init, loggedLocalStorage].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set "loggedIn" to true on "LoggedLocalStorageRequest"', () => {
      const init = { type: '@@init' } as any;
      const loggedLocalStorageRequest = new LoggedLocalStorageRequest();

      const state = [init, loggedLocalStorageRequest].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set "loggedIn" to true on "LoggedLocalStorageRequest"', () => {
      const init = { type: '@@init' } as any;
      const loggedLocalStorageRequest = new LoggedLocalStorageRequest();

      const state = [init, loggedLocalStorageRequest].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should logout user on "LoginFail" or "LogoutConfirm" or "LogoutAction"', () => {
      const init = { type: '@@init' } as any;
      const loginFail = new LoginFail({ authErrors });
      const logoutConfirm = new LogoutConfirm();
      const logoutAction = new LogoutAction();

      const state1 = [init, loginFail].reduce(
        fromAuth.authReducer,
        initialAuthState
      );
      const state2 = [init, logoutConfirm].reduce(
        fromAuth.authReducer,
        initialAuthState
      );
      const state3 = [init, logoutAction].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state1).toMatchSnapshot();
      expect(state2).toMatchSnapshot();
      expect(state3).toMatchSnapshot();
    });

    it('should reset auth error and set "loading" to true on "LoginPageAttemptLogin"', () => {
      const init = { type: '@@init' } as any;
      const loginPageAttemptLogin = new LoginPageAttemptLogin({
        authType: '',
        credentials
      });

      const state = [init, loginPageAttemptLogin].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should clear auth errors', () => {
      const init = { type: '@@init' } as any;
      const loginPageClearAuthErrors = new LoginPageClearAuthErrors();
      const clearAuthErrors = new ClearAuthErrors();

      const state1 = [init, loginPageClearAuthErrors].reduce(
        fromAuth.authReducer,
        initialAuthState
      );
      const state2 = [init, clearAuthErrors].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state1).toMatchSnapshot();
      expect(state2).toMatchSnapshot();
    });

    it('should set auth errors', () => {
      const init = { type: '@@init' } as any;
      const loginPageClearAuthErrors = new LoginPageSetAuthErrors({
        authErrors
      });
      const setUpdateUserErrors = new SetUpdateUserErrors({ authErrors });

      const state1 = [init, loginPageClearAuthErrors].reduce(
        fromAuth.authReducer,
        initialAuthState
      );
      const state2 = [init, setUpdateUserErrors].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state1).toMatchSnapshot();
      expect(state2).toMatchSnapshot();
    });

    it('should set "updatinInfo" to true on "UpdateUserRequest"', () => {
      const init = { type: '@@init' } as any;
      const updateUserRequest = new UpdateUserRequest({ user });

      const state1 = [init, updateUserRequest].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state1).toMatchSnapshot();
    });

    it('should set "updatinInfo" to false on "UpdateUserFail"', () => {
      const init = { type: '@@init' } as any;
      const updateUserFail = new UpdateUserFail({ errors });

      const state1 = [init, updateUserFail].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state1).toMatchSnapshot();
    });

    it('should set user on "UpdateUserSuccess"', () => {
      const init = { type: '@@init' } as any;
      const updateUserSuccess = new UpdateUserSuccess({ user });

      const state1 = [init, updateUserSuccess].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state1).toMatchSnapshot();
    });

    it('should set returnUrl on "SetReturnUrl"', () => {
      const init = { type: '@@init' } as any;
      const setReturnUrl = new SetReturnUrl({ returnUrl: 'returnUrl' });

      const state = [init, setReturnUrl].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should clear returnUrl on "ClearReturnStateFromRouteChange"', () => {
      const init = { type: '@@init' } as any;
      const clearReturnUrl = new ClearReturnStateFromRouteChange();

      const state = [init, clearReturnUrl].reduce(
        fromAuth.authReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });
  });
});
