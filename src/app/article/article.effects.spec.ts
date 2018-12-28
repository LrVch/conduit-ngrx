import { TestBed } from '@angular/core/testing';
import { getArticle, getSomeErrors, getProfile, getUser, getComment, getComments } from '../lib/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { Mock, provideMagicalMock } from 'angular-testing-library';

import {
    ArticlesService,
    ProfilesService,
    CommentsService,
    Article,
    Errors,
    Profile,
    User,
    Comment
} from '../core';
import {
    ArticleDeleteConfirmationRequest,
    ArticleDeleteConfirmation,
    ArticleLoadSuccess,
    ArticleDeleteSuccess,
    ArticleDeleteFail,
    ArticleToggleFollowingRequest,
    SetFollowingProfile,
    ArticleUnFollowingRequest,
    ArticleFollowingRequest,
    ClearFollowingProfile,
    ArticleToggleFollowingSuccess,
    ArticleToggleFollowingFail,
    ArticleCommentsSuccess,
    ArticleCommentsRequest,
    ArticleCommentsFail,
    ArticleCommentAddSuccess,
    ArticleCommentAddRequest,
    ArticleCommentAddFail,
    ArticleCommentDeleteRequest,
    ArticleCommentDeleteSuccess,
    ArticleCommentDeleteFail
} from './article.actions';
import { ArticleEffects } from './article.effects';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '../reducers';
import * as fromArticle from './article.reducer';
import * as fromAuth from '../auth/auth.reducer';
import * as fromAuthActions from '../auth/auth.actions';
import { Store, StoreModule, combineReducers, Action } from '@ngrx/store';
import { DialogService } from '../core/services/dialog.service';
import { NotificationService } from '../core/services/notification.service';
import { HideMainLoader, ShowMainLoader } from '../layout/layout.actions';

describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: ArticleEffects;
    let articlesService: Mock<ArticlesService>;
    let profilesService: Mock<ProfilesService>;
    let commentsService: Mock<CommentsService>;
    let dialog: Mock<DialogService>;
    let router: Mock<Router>;
    let store: Store<fromArticle.ArticleState>;
    let route: ActivatedRoute;
    let notificationService: Mock<NotificationService>;
    let article: Article;
    let errors: Errors;
    let profile: Profile;
    let user: User;
    let comment: Comment;
    let comments: Comment[];

    class MockRoute {
        snapshot = {
            queryParams: {}
        };
    }

    beforeEach(() => {
        article = getArticle();
        errors = getSomeErrors();
        profile = getProfile();
        user = getUser();
        comment = getComment();
        comments = getComments(3);
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromArticle.articleReducer, fromAuth.authReducer),
                }),
            ],
            providers: [
                ArticleEffects,
                provideMockActions(() => actions$),
                provideMagicalMock(ArticlesService),
                provideMagicalMock(Router),
                provideMagicalMock(ProfilesService),
                provideMagicalMock(CommentsService),
                provideMagicalMock(DialogService),
                provideMagicalMock(NotificationService),
                { provide: ActivatedRoute, useClass: MockRoute }
            ],
        });

        effects = TestBed.get(ArticleEffects);
        articlesService = TestBed.get(ArticlesService);
        dialog = TestBed.get(DialogService);
        router = TestBed.get(Router);
        store = TestBed.get(Store);
        route = TestBed.get(ActivatedRoute);
        profilesService = TestBed.get(ProfilesService);
        commentsService = TestBed.get(CommentsService);
        notificationService = TestBed.get(NotificationService);

        spyOn(store, 'dispatch').and.callThrough();
        spyOn(store, 'select').and.callThrough();
        spyOn(console, 'error'); // .and.callThrough();
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('articleDeleteConfirmationRequest$', () => {
        it('should show confirmation dialog and return a "ArticleDeleteConfirmation" on confirm', () => {
            const action = new ArticleDeleteConfirmationRequest({ article, question: 'question' });
            const result = new ArticleDeleteConfirmation({ article });

            actions$ = hot('-a', { a: action });
            const response = cold('-b|', { b: true });
            const expected = cold('--c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));

            dialog.confirmation.and.returnValue({
                afterClosed() {
                    return response;
                }
            });

            expect(effects.articleDeleteConfirmationRequest$).toBeObservable(expected);
        });
    });

    describe('deleteArticle$', () => {
        it('should call articles API to delete article and return a "ArticleDeleteSuccess", on success', () => {
            const action = new ArticleDeleteConfirmation({ article });
            const result = new ArticleDeleteSuccess({ article });

            actions$ = hot('-a', { a: action });
            const response = cold('-b|', { b: null });
            const expected = cold('--c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));
            articlesService.destroy.and.returnValue(response);

            expect(effects.deleteArticle$).toBeObservable(expected);
        });

        it('should call articles API to delete article and return a "ArticleDeleteFail", on fail', () => {
            const action = new ArticleDeleteConfirmation({ article });
            const result = new ArticleDeleteFail({ errors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('--c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));
            articlesService.destroy.and.returnValue(response);

            expect(effects.deleteArticle$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('articleDeleteRequest$', () => {
        it('should show main loader on "ArticleDeleteConfirmation"', (done) => {
            const action = new ArticleDeleteConfirmation({ article });

            actions$ = of(action);

            effects.articleDeleteRequest$.subscribe(res => {
                expect(store.dispatch).toHaveBeenCalledWith(new ShowMainLoader());
                done();
            }, done, done);
        });

    });

    describe('articleDeleteSuccess$', () => {
        it('should navigate user to prfile page on "ArticleDeleteSuccess"', (done) => {
            const action = new ArticleDeleteSuccess({ article });

            actions$ = of(action);

            effects.articleDeleteSuccess$.subscribe(res => {
                expect(router.navigate).toHaveBeenCalledWith(['/profile', article.author.username]);
                done();
            }, done, done);
        });

    });

    describe('articleDeleteFail$', () => {
        it('should hide main loader on "ArticleDeleteFail"', (done) => {
            const action = new ArticleDeleteFail({ errors });

            actions$ = of(action);

            effects.articleDeleteFail$.subscribe(res => {
                expect(store.dispatch).toHaveBeenCalledWith(new HideMainLoader());
                done();
            }, done, done);
        });

    });

    describe('toggleFollowUserArticle$', () => {
        it('should return "SetFollowingProfile" if user isn\'t logged in', () => {
            const action = new ArticleToggleFollowingRequest({ profile });
            const result = new SetFollowingProfile({ profile });

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.toggleFollowUserArticle$).toBeObservable(expected);
        });

        it('should return "ArticleUnFollowingRequest" if the user is followed already', () => {
            const action = new ArticleToggleFollowingRequest({ profile });
            const result = new ArticleUnFollowingRequest({ profile });
            profile.following = true;

            store.dispatch(new fromAuthActions.LoginSuccess({ user }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.toggleFollowUserArticle$).toBeObservable(expected);
        });

        it('should return "ArticleFollowingRequest" if the user is followed already', () => {
            const action = new ArticleToggleFollowingRequest({ profile });
            const result = new ArticleFollowingRequest({ profile });

            store.dispatch(new fromAuthActions.LoginSuccess({ user }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.toggleFollowUserArticle$).toBeObservable(expected);
        });

    });

    describe('setFollowingProfile$', () => {
        it('should return "LogoutAction" on "SetFollowingProfile"', () => {
            const action = new SetFollowingProfile({ profile });
            const result = new fromAuthActions.LogoutAction();

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.setFollowingProfile$).toBeObservable(expected);
        });
    });

    describe('clearReturnStateFromRouteChange$', () => {
        it('should return "ClearFollowingProfile" on "ClearReturnStateFromRouteChange"', () => {
            const action = new fromAuthActions.ClearReturnStateFromRouteChange();
            const result = new ClearFollowingProfile();

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.clearReturnStateFromRouteChange$).toBeObservable(expected);
        });
    });

    describe('loginSuccessArticle$', () => {
        it('should return "ArticleFollowingRequest" on "LoginSuccess"', () => {
            const action = new fromAuthActions.LoginSuccess({ user });
            const result = new ArticleFollowingRequest({ profile });

            store.dispatch(new SetFollowingProfile({ profile }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.loginSuccessArticle$).toBeObservable(expected);
        });
    });

    describe('articleFollowing$', () => {
        it('should call API to follow user(show notification) and return a "ArticleToggleFollowingSuccess", on success', () => {
            const action = new ArticleFollowingRequest({ profile });
            const result = new ArticleToggleFollowingSuccess({ profile, showNotification: true });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { profile } });
            const expected = cold('--c', { c: result });

            profilesService.follow.and.returnValue(response);

            expect(effects.articleFollowing$).toBeObservable(expected);
        });

        it('should call API to follow user(don\'t show notification) and return a "ArticleToggleFollowingSuccess", on success', () => {
            const action = new ArticleFollowingRequest({ profile });
            const result = new ArticleToggleFollowingSuccess({ profile, showNotification: false });

            store.dispatch(new SetFollowingProfile({ profile }));

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { profile } });
            const expected = cold('--c', { c: result });

            profilesService.follow.and.returnValue(response);

            expect(effects.articleFollowing$).toBeObservable(expected);
        });

        it('should call API to follow user(show notification) and return a "ArticleToggleFollowingFail", on fail', () => {
            const action = new ArticleFollowingRequest({ profile });
            const result = new ArticleToggleFollowingFail({ showNotification: true });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            profilesService.follow.and.returnValue(response);

            expect(effects.articleFollowing$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });

        it('should call API to follow user(don\'t show notification) and return a "ArticleToggleFollowingFail", on fail', () => {
            const action = new ArticleFollowingRequest({ profile });
            const result = new ArticleToggleFollowingFail({ showNotification: false });

            store.dispatch(new SetFollowingProfile({ profile }));

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            profilesService.follow.and.returnValue(response);

            expect(effects.articleFollowing$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('aricleUnFollowing$', () => {
        it('should call API to unfollow user and return a "ArticleToggleFollowingSuccess", on success', () => {
            const action = new ArticleUnFollowingRequest({ profile });
            const result = new ArticleToggleFollowingSuccess({ profile });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { profile } });
            const expected = cold('--c', { c: result });

            profilesService.unfollow.and.returnValue(response);

            expect(effects.aricleUnFollowing$).toBeObservable(expected);
        });

        it('should call API to follow user and return a "ArticleToggleFollowingFail", on fail', () => {
            const action = new ArticleUnFollowingRequest({ profile });
            const result = new ArticleToggleFollowingFail();

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            profilesService.unfollow.and.returnValue(response);

            expect(effects.aricleUnFollowing$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('articleToggleFollowingSuccess$', () => {
        it('should show notification on "ArticleToggleFollowingSuccess"', (done) => {
            const action = new ArticleToggleFollowingSuccess({ profile });

            actions$ = of(action);

            effects.articleToggleFollowingSuccess$.subscribe(res => {
                expect(notificationService.success).toHaveBeenCalledWith(
                    { message: 'Added to your favorites authors' }
                );
                done();
            }, done, done);
        });

    });

    describe('articleToggleFollowingFail$', () => {
        it('should show notification on "ArticleToggleFollowingFail"', (done) => {
            const action = new ArticleToggleFollowingFail({ showNotification: true });

            actions$ = of(action);

            effects.articleToggleFollowingFail$.subscribe(res => {
                expect(notificationService.error).toHaveBeenCalledWith(
                    { message: 'Can\'t add author to your favorites' }
                );
                done();
            }, done, done);
        });
    });

    describe('loadComments$', () => {
        it('should call API to add comments and return a "ArticleCommentsSuccess", on success', () => {
            const action = new ArticleCommentsRequest({ slug: 'slug' });
            const result = new ArticleCommentsSuccess({ comments });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: comments });
            const expected = cold('--c', { c: result });

            commentsService.getAll.and.returnValue(response);

            expect(effects.loadComments$).toBeObservable(expected);
        });

        it('should call API to add comments and return a "ArticleCommentsFail", on fail', () => {
            const action = new ArticleCommentsRequest({ slug: 'slug' });
            const result = new ArticleCommentsFail({ errors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, errors);
            const expected = cold('-----c', { c: result });

            commentsService.getAll.and.returnValue(response);

            expect(effects.loadComments$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('addComment$', () => {
        it('should call API to add comment and return a "ArticleCommentAddSuccess", on success', () => {
            const action = new ArticleCommentAddRequest({ comment: 'comment' });
            const result = new ArticleCommentAddSuccess({ comment });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: comment });
            const expected = cold('--c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));

            commentsService.add.and.returnValue(response);

            expect(effects.addComment$).toBeObservable(expected);
        });

        it('should call API to add comment and return a "ArticleCommentAddFail", on fail', () => {
            const action = new ArticleCommentAddRequest({ comment: 'comment' });
            const result = new ArticleCommentAddFail({ errors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, errors);
            const expected = cold('-----c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));

            commentsService.add.and.returnValue(response);

            expect(effects.addComment$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('deleteComment$', () => {
        it('should call API to delete comment and return a "ArticleCommentAddSuccess", on success', () => {
            const action = new ArticleCommentDeleteRequest({ comment });
            const result = new ArticleCommentDeleteSuccess({ id: comment.id });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: comment });
            const expected = cold('--c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));

            commentsService.destroy.and.returnValue(response);

            expect(effects.deleteComment$).toBeObservable(expected);
        });

        it('should call API to delete comment and return a "ArticleCommentDeleteFail", on fail', () => {
            const action = new ArticleCommentDeleteRequest({ comment });
            const result = new ArticleCommentDeleteFail({ errors, id: comment.id });

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, errors);
            const expected = cold('-----c', { c: result });

            store.dispatch(new ArticleLoadSuccess({ article }));

            commentsService.destroy.and.returnValue(response);

            expect(effects.deleteComment$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });
});

