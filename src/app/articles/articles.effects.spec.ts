import { TestBed } from '@angular/core/testing';
import { getArticle, getSomeErrors, getProfile, getUser, getComment, getComments, getArticles } from '@app/lib/testing';
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
    Comment,
    TagsService
} from '@app/core';
import * as fromArticlesActions from './articles.actions';
import { ArticlesEffects } from './articles.effects';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '@app/reducers';
import * as fromArticles from './articles.reducer';
import * as fromAuth from '@app/auth/auth.reducer';
import * as fromAuthActions from '@app/auth/auth.actions';
import { Store, StoreModule, combineReducers, Action } from '@ngrx/store';
import { DialogService } from '@app/core/services/dialog.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HideMainLoader, ShowMainLoader } from '@app/layout/layout.actions';

describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: ArticlesEffects;
    let articlesService: Mock<ArticlesService>;
    let store: Store<fromArticles.ArticlesState>;
    let notificationService: Mock<NotificationService>;
    let article: Article;
    let errors: Errors;
    let profile: Profile;
    let user: User;
    let comment: Comment;
    let comments: Comment[];
    let tagsService: Mock<TagsService>;
    let articles: Article[];

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
        articles = getArticles(3);
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromArticles.articlesReducer, fromAuth.authReducer),
                }),
            ],
            providers: [
                ArticlesEffects,
                provideMockActions(() => actions$),
                provideMagicalMock(ArticlesService),
                provideMagicalMock(NotificationService),
                provideMagicalMock(TagsService)
            ],
        });

        effects = TestBed.get(ArticlesEffects);
        articlesService = TestBed.get(ArticlesService);
        store = TestBed.get(Store);
        notificationService = TestBed.get(NotificationService);
        tagsService = TestBed.get(TagsService);

        spyOn(store, 'dispatch').and.callThrough();
        spyOn(store, 'select').and.callThrough();
        spyOn(console, 'error'); // .and.callThrough();
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadArticles$', () => {
        it('should call API to load article and return a "LoadArticlesLoaded", on success', () => {
            const a = {
                items: {
                    '0': getArticle('0'),
                    '1': getArticle('1')
                },
                ids: ['0', '1'],
                articlesCount: 2
            };
            const responseArticles = [getArticle('0'), getArticle('1')];
            const action = new fromArticlesActions.LoadArticlesRequest();
            const result = new fromArticlesActions.LoadArticlesLoaded({ articles: a });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { articles: responseArticles, articlesCount: 2 } });
            const expected = cold('--c', { c: result });

            articlesService.query.and.returnValue(response);

            expect(effects.loadArticles$).toBeObservable(expected);
        });

        it('should call API to load article and return a "LoadArticlesFail", on fail', () => {
            const action = new fromArticlesActions.LoadArticlesRequest();
            const result = new fromArticlesActions.LoadArticlesFail();

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, errors);
            const expected = cold('-----c', { c: result });

            articlesService.query.and.returnValue(response);

            expect(effects.loadArticles$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('loadTags$', () => {
        it('should return a "LoadTagsLoaded", if tags was in store', () => {
            const tags = ['one', 'two'];
            const action = new fromArticlesActions.LoadTagsRequest();
            const result = new fromArticlesActions.LoadTagsLoaded({ tags });

            store.dispatch(new fromArticlesActions.LoadTagsLoaded({ tags }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-c', { c: result });

            expect(effects.loadTags$).toBeObservable(expected);
        });

        it('should call API to load tage and return a "LoadTagsLoaded", on success', () => {
            const tags = ['one', 'two'];
            const action = new fromArticlesActions.LoadTagsRequest();
            const result = new fromArticlesActions.LoadTagsLoaded({ tags });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: tags });
            const expected = cold('--c', { c: result });

            tagsService.getAll.and.returnValue(response);

            expect(effects.loadTags$).toBeObservable(expected);
        });

        it('should call API to load tage and return a "LoadTagsFail", on fail', () => {
            const tags = ['one', 'two'];
            const action = new fromArticlesActions.LoadTagsRequest();
            const result = new fromArticlesActions.LoadTagsFail();

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, errors);
            const expected = cold('-----c', { c: result });

            tagsService.getAll.and.returnValue(response);

            expect(effects.loadTags$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('taggleFavoriteArticle$', () => {
        it('should return "SetFollowingProfile" if user isn\'t logged in', () => {
            const action = new fromArticlesActions.ToggleArticleFavoriteRequest({ article });
            const result = new fromArticlesActions.SetFavoritingArticle({ article });

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.taggleFavoriteArticle$).toBeObservable(expected);
        });

        it('should return "UnFavoriteArticleRequest" if the article is favorited already', () => {
            const action = new fromArticlesActions.ToggleArticleFavoriteRequest({ article });
            const result = new fromArticlesActions.UnFavoriteArticleRequest({ article });
            article.favorited = true;

            store.dispatch(new fromAuthActions.LoginSuccess({ user }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.taggleFavoriteArticle$).toBeObservable(expected);
        });

        it('should return "FavoriteArticleRequest" if the article isn\'t favorited', () => {
            const action = new fromArticlesActions.ToggleArticleFavoriteRequest({ article });
            const result = new fromArticlesActions.FavoriteArticleRequest({ article });

            store.dispatch(new fromAuthActions.LoginSuccess({ user }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.taggleFavoriteArticle$).toBeObservable(expected);
        });

    });

    describe('setFavoritingArticle$', () => {
        it('should return "LogoutAction" on "SetFollowingProfile"', () => {
            const action = new fromArticlesActions.SetFavoritingArticle({ article });
            const result = new fromAuthActions.LogoutAction();

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.setFavoritingArticle$).toBeObservable(expected);
        });
    });

    describe('clearReturnStateFromRouteChange$', () => {
        it('should return "ClearFavoritingArticle" on "ClearReturnStateFromRouteChange"', () => {
            const action = new fromAuthActions.ClearReturnStateFromRouteChange();
            const result = new fromArticlesActions.ClearFavoritingArticle();

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.clearReturnStateFromRouteChange$).toBeObservable(expected);
        });
    });

    describe('loginSuccessArticle$', () => {
        it('should return "FavoriteArticleRequest" on "LoginSuccess"', () => {
            const action = new fromAuthActions.LoginSuccess({ user });
            const result = new fromArticlesActions.FavoriteArticleRequest({ article });

            store.dispatch(new fromArticlesActions.SetFavoritingArticle({ article }));

            actions$ = hot('-a', { a: action });
            const expected = cold('-b', { b: result });

            expect(effects.loginSuccessArticle$).toBeObservable(expected);
        });
    });

    describe('favoriteArticle$', () => {
        it('should call API to favorite article(show notification) and return a "ToggleArticleFavoriteSuccess", on success', () => {
            const action = new fromArticlesActions.FavoriteArticleRequest({ article });
            const result = new fromArticlesActions.ToggleArticleFavoriteSuccess({ article, showNotification: true });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { article } });
            const expected = cold('--c', { c: result });

            articlesService.favorite.and.returnValue(response);

            expect(effects.favoriteArticle$).toBeObservable(expected);
        });

        it('should call API to favorite article(don\'t show notification) and return a "ToggleArticleFavoriteSuccess", on success', () => {
            const action = new fromArticlesActions.FavoriteArticleRequest({ article });
            const result = new fromArticlesActions.ToggleArticleFavoriteSuccess({ article, showNotification: false });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { article } });
            const expected = cold('--c', { c: result });

            store.dispatch(new fromArticlesActions.SetFavoritingArticle({ article }));

            articlesService.favorite.and.returnValue(response);

            expect(effects.favoriteArticle$).toBeObservable(expected);
        });

        it('should call API to favorite article(show notification) and return a "ToggleArticleFavoriteFail", on fail', () => {
            const action = new fromArticlesActions.FavoriteArticleRequest({ article });
            const result = new fromArticlesActions.ToggleArticleFavoriteFail({ article, showNotification: true });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            articlesService.favorite.and.returnValue(response);

            expect(effects.favoriteArticle$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });

        it('should call API to favorite article(don\'t show notification) and return a "ToggleArticleFavoriteFail", on fail', () => {
            const action = new fromArticlesActions.FavoriteArticleRequest({ article });
            const result = new fromArticlesActions.ToggleArticleFavoriteFail({ article, showNotification: false });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            store.dispatch(new fromArticlesActions.SetFavoritingArticle({ article }));

            articlesService.favorite.and.returnValue(response);

            expect(effects.favoriteArticle$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('unFavoriteArticle$', () => {
        it('should call API to unfavorite article and return a "ToggleArticleFavoriteSuccess", on success', () => {
            const action = new fromArticlesActions.UnFavoriteArticleRequest({ article });
            const result = new fromArticlesActions.ToggleArticleFavoriteSuccess({ article });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: { article } });
            const expected = cold('--c', { c: result });

            articlesService.unfavorite.and.returnValue(response);

            expect(effects.unFavoriteArticle$).toBeObservable(expected);
        });

        it('should call API to unfavorite article and return a "ToggleArticleFavoriteFail", on fail', () => {
            const action = new fromArticlesActions.UnFavoriteArticleRequest({ article });
            const result = new fromArticlesActions.ToggleArticleFavoriteFail({ article });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('-----c', { c: result });

            store.dispatch(new fromArticlesActions.SetFavoritingArticle({ article }));

            articlesService.unfavorite.and.returnValue(response);

            expect(effects.unFavoriteArticle$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('toggleArticleFavoriteSuccess$', () => {
        it('should show notification on "ToggleArticleFavoriteSuccess"', (done) => {
            const action = new fromArticlesActions.ToggleArticleFavoriteSuccess({ article });

            actions$ = of(action);

            effects.toggleArticleFavoriteSuccess$.subscribe(res => {
                expect(notificationService.success).toHaveBeenCalledWith(
                    { message: 'Added to your favorites articles' }
                );
                done();
            }, done, done);
        });

    });

    describe('toggleArticleFavoriteFail$', () => {
        it('should show notification on "ToggleArticleFavoriteFail"', (done) => {
            const action = new fromArticlesActions.ToggleArticleFavoriteFail({ article, showNotification: true });

            actions$ = of(action);

            effects.toggleArticleFavoriteFail$.subscribe(res => {
                expect(notificationService.error).toHaveBeenCalledWith(
                    { message: 'Can\'t add article to your favorites' }
                );
                done();
            }, done, done);
        });
    });
});

