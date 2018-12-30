import { TestBed } from '@angular/core/testing';
import { getArticle, getSomeErrors, getProfile, getUser, getComment, getComments, getArticles } from '@app/lib/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { Mock, provideMagicalMock } from 'angular-testing-library';

import {
    ArticlesService,
    ProfilesService,
    Errors,
    Profile,
    TagsService,
    User
} from '../core';
import * as fromProfileActions from './profile.actions';
import { ProfileEffects } from './profile.effects';
import * as fromRoot from '../reducers';
import * as fromAuthActions from '../auth/auth.actions';
import * as fromProfile from './profile.reducer';
import { Store, StoreModule, combineReducers, Action } from '@ngrx/store';
import { NotificationService } from '../core/services/notification.service';

describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: ProfileEffects;
    let profilesService: Mock<ProfilesService>;
    let store: Store<fromProfile.ProfileState>;
    let notificationService: Mock<NotificationService>;
    let errors: Errors;
    let profile: Profile;
    let user: User;


    beforeEach(() => {
        errors = getSomeErrors();
        profile = getProfile();
        user = getUser();
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromProfile.profileReducer),
                }),
            ],
            providers: [
                ProfileEffects,
                provideMockActions(() => actions$),
                provideMagicalMock(ProfilesService),
                provideMagicalMock(NotificationService),
                provideMagicalMock(TagsService)
            ],
        });

        effects = TestBed.get(ProfileEffects);
        profilesService = TestBed.get(ProfilesService);
        store = TestBed.get(Store);
        notificationService = TestBed.get(NotificationService);

        spyOn(store, 'dispatch').and.callThrough();
        spyOn(store, 'select').and.callThrough();
        spyOn(console, 'error'); // .and.callThrough();
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('taggleFollowUserProfile$', () => {
        it('should return "SetFollowingProfile" if user isn\'t logged in', () => {
            const action = new fromProfileActions.ProfileToggleFollowingRequest({ profile });
            const result = new fromProfileActions.SetFollowingProfile({ profile });

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.taggleFollowUserProfile$).toBeObservable(expected);
        });

        it('should return "ProfileUnFollowingRequest" if profile is followed already', () => {
            const action = new fromProfileActions.ProfileToggleFollowingRequest({ profile });
            const result = new fromProfileActions.ProfileUnFollowingRequest({ profile });
            profile.following = true;

            store.dispatch(new fromAuthActions.LoginSuccess({ user }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.taggleFollowUserProfile$).toBeObservable(expected);
        });

        it('should return "ProfileFollowingRequest" if profile isn\'t followed', () => {
            const action = new fromProfileActions.ProfileToggleFollowingRequest({ profile });
            const result = new fromProfileActions.ProfileFollowingRequest({ profile });

            store.dispatch(new fromAuthActions.LoginSuccess({ user }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.taggleFollowUserProfile$).toBeObservable(expected);
        });
    });

    describe('setFollowingProfile$', () => {
        it('should return "LogoutAction" on "SetFollowingProfile"', () => {
            const action = new fromProfileActions.SetFollowingProfile({ profile });
            const result = new fromAuthActions.LogoutAction();

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.setFollowingProfile$).toBeObservable(expected);
        });
    });

    describe('clearReturnStateFromRouteChange$', () => {
        it('should return "ClearFavoritingArticle" on "ClearReturnStateFromRouteChange"', () => {
            const action = new fromAuthActions.ClearReturnStateFromRouteChange();
            const result = new fromProfileActions.ClearFollowingProfile();

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.clearReturnStateFromRouteChange$).toBeObservable(expected);
        });
    });

    describe('loginSuccessProfile$', () => {
        it('should return "FavoriteArticleRequest" on "LoginSuccess"', () => {
            const action = new fromAuthActions.LoginSuccess({ user });
            const result = new fromProfileActions.ProfileFollowingRequest({ profile });

            store.dispatch(new fromProfileActions.SetFollowingProfile({ profile }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.loginSuccessProfile$).toBeObservable(expected);
        });
    });

    describe('profileFollowing$', () => {
        it('should call API to follow user(show notification) and return a "ProfileToggleFollowingSuccess", on success', () => {
            const action = new fromProfileActions.ProfileFollowingRequest({ profile });
            const result = new fromProfileActions.ProfileToggleFollowingSuccess({ profile, showNotification: true });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { profile } });
            const expected = cold('--c', { c: result });

            profilesService.follow.and.returnValue(response);

            expect(effects.profileFollowing$).toBeObservable(expected);
        });

        it('should call API to follow user(show notification) and return a "ProfileToggleFollowingSuccess", on success', () => {
            const action = new fromProfileActions.ProfileFollowingRequest({ profile });
            const result = new fromProfileActions.ProfileToggleFollowingSuccess({ profile, showNotification: false });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { profile } });
            const expected = cold('--c', { c: result });

            store.dispatch(new fromProfileActions.SetFollowingProfile({ profile }));

            profilesService.follow.and.returnValue(response);

            expect(effects.profileFollowing$).toBeObservable(expected);
        });

        it('should call API to follow user(show notification) and return a "ProfileToggleFollowingFail", on fail', () => {
            const action = new fromProfileActions.ProfileFollowingRequest({ profile });
            const result = new fromProfileActions.ProfileToggleFollowingFail({ showNotification: true });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            profilesService.follow.and.returnValue(response);

            expect(effects.profileFollowing$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });

        it('should call API to follow user(don\'t show notification) and return a "ProfileToggleFollowingFail", on fail', () => {
            const action = new fromProfileActions.ProfileFollowingRequest({ profile });
            const result = new fromProfileActions.ProfileToggleFollowingFail({ showNotification: false });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            store.dispatch(new fromProfileActions.SetFollowingProfile({ profile }));

            profilesService.follow.and.returnValue(response);

            expect(effects.profileFollowing$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('profileToggleFollowingSuccess$', () => {
        it('should show notification on "ProfileToggleFollowingSuccess"', (done) => {
            const action = new fromProfileActions.ProfileToggleFollowingSuccess({ profile });

            actions$ = of(action);

            effects.profileToggleFollowingSuccess$.subscribe(res => {
                expect(notificationService.success).toHaveBeenCalledWith(
                    { message: 'Added to your favorites authors' }
                );
                done();
            }, done, done);
        });

    });

    describe('profileToggleFollowingFail$', () => {
        it('should show notification on "ProfileToggleFollowingFail"', (done) => {
            const action = new fromProfileActions.ProfileToggleFollowingFail({ showNotification: true });

            actions$ = of(action);

            effects.profileToggleFollowingFail$.subscribe(res => {
                expect(notificationService.error).toHaveBeenCalledWith(
                    { message: 'Can\'t add author to your favorites' }
                );
                done();
            }, done, done);
        });
    });
});

