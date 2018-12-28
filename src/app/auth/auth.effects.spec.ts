import { TestBed } from '@angular/core/testing';
import { getCredentials, getUser, getAuthErrors } from '../lib/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { Mock, provideMagicalMock } from 'angular-testing-library';

import { User, UserService, JwtService, Errors, ErrorsObj } from '../core';
import {
    LoginPageAttemptLogin,
    LoginSuccess,
    LoginFail,
    LoginPageSetAuthErrors,
    LogoutConfirm,
    UpdateUserSuccess,
    UpdateUserRequest,
    UpdateUserFail,
    SetUpdateUserErrors,
    SettingsPageLogoutAction,
    LoggedLocalStorageRequest,
    LoggedLocalStorage,
    AuthAttemptToGetUser,
    LogoutAction,
    SetReturnUrl,
} from './auth.actions';
import { AuthEffects } from './auth.effects';
import { MatDialog } from '@angular/material';
import { Credentials } from '../core/models/credentials.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HideMainLoader } from '../layout/layout.actions';
import * as fromRoot from '../reducers';
import * as fromAuth from './auth.reducer';
import { Store, StoreModule, combineReducers, Action } from '@ngrx/store';
import { SetReturnArticlesConfig, ResetConfig } from '../articles/articles.actions';
import { ArticlesConfigState } from '../articles/articlesConfig.reducer';

describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: AuthEffects;
    let userService: Mock<UserService>;
    let matDialog: Mock<MatDialog>;
    let credentials: Credentials;
    let jwtService: Mock<JwtService>;
    let router: Mock<Router>;
    let store: Store<fromAuth.AuthState>;
    let user: User;
    let route: ActivatedRoute;

    const config: ArticlesConfigState = {
        type: 'all',
        filters: {
            tag: '',
            offset: 0,
            limit: 10,
            pageIndex: 0,
            author: '',
            favorited: ''
        }
    };

    class MockRoute {
        snapshot = {
            queryParams: {}
        };
    }

    beforeEach(() => {
        credentials = getCredentials();
        user = getUser();
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromAuth.authReducer),
                }),
            ],
            providers: [
                AuthEffects,
                provideMockActions(() => actions$),
                provideMagicalMock(UserService),
                provideMagicalMock(MatDialog),
                provideMagicalMock(JwtService),
                provideMagicalMock(Router),
                { provide: ActivatedRoute, useClass: MockRoute }
            ],
        });

        effects = TestBed.get(AuthEffects);
        userService = TestBed.get(UserService);
        matDialog = TestBed.get(MatDialog);
        jwtService = TestBed.get(JwtService);
        router = TestBed.get(Router);
        store = TestBed.get(Store);
        route = TestBed.get(ActivatedRoute);

        spyOn(store, 'dispatch').and.callThrough();
        spyOn(store, 'select').and.callThrough();
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loginAttempt$', () => {
        it('should call user API and return a LoginSuccess, with user, on success', () => {
            const action = new LoginPageAttemptLogin({ authType: '', credentials });
            const result = new LoginSuccess({ user });

            actions$ = hot('-a', { a: action });
            const response = cold('-b|', { b: user });
            const expected = cold('--c', { c: result });
            userService.attemptAuth.and.returnValue(response);

            expect(effects.loginAttempt$).toBeObservable(expected);
        });

        it('should call user API and return a LoginFail, with errors, on error', () => {
            const authErrors = getAuthErrors();
            const action = new LoginPageAttemptLogin({ authType: '', credentials });
            const result = new LoginFail({ authErrors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, authErrors);
            const expected = cold('--c', { c: result });
            userService.attemptAuth.and.returnValue(response);

            expect(effects.loginAttempt$).toBeObservable(expected);
        });
    });

    describe('loginSuccess$', () => {
        it('should redirect user to the return url and save token to localstorage after successful login', (done) => {
            const returnUrl = 'returnUrl';
            const setReturnUrlAction = new SetReturnUrl({ returnUrl });
            const loginSuccess = new LoginSuccess({ user });

            store.dispatch(setReturnUrlAction);

            actions$ = of(loginSuccess);

            effects.loginSuccess$.subscribe(([action, url]) => {
                expect(action).toEqual(loginSuccess);
                expect(url).toBe(returnUrl);
                expect(jwtService.saveToken).toHaveBeenCalledWith(user.token);
                expect(router.navigateByUrl).toHaveBeenCalledWith(returnUrl);
                done();
            }, done, done);
        });

        it('should redirect user to the home page and save token to localstorage after successful login', (done) => {
            const returnUrl = null;
            const setReturnUrlAction = new SetReturnUrl({ returnUrl });
            const loginSuccess = new LoginSuccess({ user });

            store.dispatch(setReturnUrlAction);

            actions$ = of(loginSuccess);

            effects.loginSuccess$.subscribe(([action, url]) => {
                expect(action).toEqual(loginSuccess);
                expect(url).toBe(returnUrl);
                expect(jwtService.saveToken).toHaveBeenCalledWith(user.token);
                expect(router.navigateByUrl).toHaveBeenCalledWith('/');
                done();
            }, done, done);
        });
    });

    describe('loginFail$', () => {
        it('should destroy localstorage data, and dispath "LoginPageSetAuthErrors" and "HideMainLoader" after fail login', done => {
            const authErrors = getAuthErrors();
            const action = new LoginFail({ authErrors });

            actions$ = of(action);

            effects.loginFail$.subscribe(() => {
                expect(jwtService.destroyUseData).toHaveBeenCalled();
                expect(store.dispatch).toHaveBeenCalledWith(new LoginPageSetAuthErrors({ authErrors }));
                expect(store.dispatch).toHaveBeenCalledWith(new HideMainLoader());
                done();
            }, done, done);
        });
    });

    describe('logoutConfirm$', () => {
        it('should destroy localstorage data, and redirect user to "login" after confirm logout', done => {
            const action = new LogoutConfirm();

            actions$ = of(action);

            effects.logoutConfirm$.subscribe(() => {
                expect(jwtService.destroyUseData).toHaveBeenCalled();
                expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
                done();
            }, done, done);
        });
    });

    describe('logout$', () => {
        it(`should destroy localstorage data, and redirect user to "login" after confirm logout,
            and save previous page url in query params`, done => {
                const action = new LogoutAction();

                // store.dispatch(new ResetConfig());

                actions$ = of(action);

                effects.logout$.subscribe(() => {
                    expect(jwtService.destroyUseData).toHaveBeenCalled();
                    expect(store.dispatch).toHaveBeenCalledWith(new SetReturnUrl({ returnUrl: undefined }));
                    expect(store.dispatch).toHaveBeenCalledWith(new SetReturnArticlesConfig({ config }));
                    expect(router.navigate).toHaveBeenCalledWith(['login']);
                    done();
                }, done, done);
            });

        it(`should destroy localstorage data, and redirect user to "register" after confirm logout,
            and save previous page url in query params`, done => {
                const action = new LogoutAction({ path: 'register' });

                actions$ = of(action);

                effects.logout$.subscribe(() => {
                    expect(jwtService.destroyUseData).toHaveBeenCalled();
                    expect(store.dispatch).toHaveBeenCalledWith(new SetReturnUrl({ returnUrl: undefined }));
                    expect(store.dispatch).toHaveBeenCalledWith(new SetReturnArticlesConfig({ config }));
                    expect(router.navigate).toHaveBeenCalledWith(['register']);
                    done();
                }, done, done);
            });
    });

    describe('updateInfo$', () => {
        it('should call user API and return a UpdateUserSuccess, with user, on user info update success', () => {
            const action = new UpdateUserRequest({ user });
            const result = new UpdateUserSuccess({ user });

            actions$ = hot('-a', { a: action });
            const response = cold('-b|', { b: user });
            const expected = cold('--c', { c: result });
            userService.update.and.returnValue(response);

            expect(effects.updateInfo$).toBeObservable(expected);
        });

        it('should call user API and return a UpdateUserFail, with errors, on user info update fail', () => {
            const errors = getAuthErrors();
            const action = new UpdateUserRequest({ user });
            const result = new UpdateUserFail({ errors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('--c', { c: result });
            userService.update.and.returnValue(response);

            expect(effects.updateInfo$).toBeObservable(expected);
        });
    });

    describe('updateInfoFail$', () => {
        it('should set errors, on user info update fail', () => {
            const errors = getAuthErrors();
            const action = new UpdateUserFail({ errors });
            const result = new SetUpdateUserErrors({ authErrors: errors });

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.updateInfoFail$).toBeObservable(expected);
        });
    });

    describe('settingPageLogout$', () => {
        it('should show logout confirm modal and return a "LogoutConfirm", on confirmation success', () => {
            const action = new SettingsPageLogoutAction({ question: '' });
            const result = new LogoutConfirm();

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: true });
            const expected = cold('--c', { c: result });
            matDialog.open.and.returnValue({
                afterClosed() {
                    return response;
                }
            });

            expect(effects.settingPageLogout$).toBeObservable(expected);
        });

        it('should show logout confirm modal and not return a "LogoutConfirm", on confirmation reject', done => {
            const action = new SettingsPageLogoutAction({ question: '' });
            let actionWasEmitted = false;

            actions$ = of(action);
            matDialog.open.and.returnValue({
                afterClosed() {
                    return of(false);
                }
            });

            effects.settingPageLogout$.subscribe(a => {
                actionWasEmitted = true;
                expect(actionWasEmitted).toBe(false);
                done();
            }, done, () => {
                expect(actionWasEmitted).toBe(false);
                done();
            });
        });
    });

    describe('init$', () => {
        it('should call "jwtService.getToken" and return a LoginFail, if there is no token in localstorage', (done) => {
            const action: Action = { type: 'init' };
            const authErrors: Errors = new ErrorsObj({ type: 'token', body: ['token not found'] });
            const result = new LoginFail({ authErrors });

            actions$ = of(action);
            jwtService.getToken.and.returnValue(null);

            effects.init$.subscribe(a => {
                expect(a).toEqual(result);
                expect(jwtService.getToken).toHaveBeenCalled();
                done();
            }, done, done);
        });

        it('should call "jwtService.getToken" and dispatch a "LoggedLocalStorageRequest", if there is a token in localstorage', (done) => {
            const action: Action = { type: 'init' };
            const result = new AuthAttemptToGetUser();

            actions$ = of(action);
            jwtService.getToken.and.returnValue('token');

            effects.init$.subscribe(a => {
                expect(a).toEqual(result);
                expect(jwtService.getToken).toHaveBeenCalled();
                done();
            }, done, done);
        });
    });

    describe('getUserFromApi$', () => {
        it('should call user API and return a LoggedLocalStorage, with user, on success', () => {
            const action = new AuthAttemptToGetUser();
            const result = new LoggedLocalStorage({ user });

            actions$ = hot('-a', { a: action });
            const response = cold('-b|', { b: { user } });
            const expected = cold('--c', { c: result });
            userService.getUser.and.returnValue(response);

            expect(effects.getUserFromApi$).toBeObservable(expected);
        });

        it('should call user API and return a LoginFail, with errors, on error', () => {
            const authErrors = getAuthErrors();
            const action = new AuthAttemptToGetUser();
            const result = new LoginFail({ authErrors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, authErrors);
            const expected = cold('--c', { c: result });
            userService.getUser.and.returnValue(response);

            expect(effects.getUserFromApi$).toBeObservable(expected);
        });
    });

    describe('setUserAsLogged$', () => {
        it('should dispatch a "LoggedLocalStorageRequest", if jwt token in localstorage', (done) => {
            const action = new AuthAttemptToGetUser();

            actions$ = of(action);

            effects.setUserAsLogged$.subscribe(a => {
                expect(store.dispatch).toHaveBeenCalledWith(new LoggedLocalStorageRequest());
                done();
            }, done, done);
        });
    });
});

