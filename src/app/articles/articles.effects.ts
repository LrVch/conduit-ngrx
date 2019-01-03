import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  catchError,
  finalize,
  switchMap,
  retry,
  withLatestFrom,
  map,
  mergeMap,
  tap,
  filter,
  first
} from 'rxjs/operators';
import {
  ArticlesActionTypes,
  LoadTagsRequest,
  LoadTagsLoaded,
  LoadTagsCompleted,
  LoadTagsFail,
  LoadArticlesLoaded,
  LoadArticlesFail,
  LoadArticlesCompleted,
  LoadArticlesRequest,
  ToggleArticleFavoriteRequest,
  ToggleArticleFavoriteFail,
  ToggleArticleFavoriteSuccess,
  FavoriteArticleRequest,
  UnFavoriteArticleRequest,
  SetFavoritingArticle,
  ClearFavoritingArticle
} from './articles.actions';
import { TagsService, ArticlesService, Article } from '@app/core';
import { of, Observable, from } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import {
  selectArticlesTags,
  getArticlesConfig,
  selectFavoritingArticle
} from './articles.selectors';
import { ArticlesCashService, NormalizedArticlesResponse } from './articles-cash.service';
import { Articles } from '@app/core/models/articles.model';
import { selectAuthLoggedIn } from '@app/auth/auth.selectors';
import { LogoutAction, LoginSuccess, AuthActionTypes, ClearReturnStateFromRouteChange } from '@app/auth/auth.actions';
import { NotificationService } from '@app/core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ArticlesEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagsService,
    private articlesService: ArticlesService,
    private store: Store<AppState>,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) { }

  @Effect()
  loadArticles$ = this.actions$.pipe(
    ofType<LoadArticlesRequest>(ArticlesActionTypes.LoadArticlesRequest),
    withLatestFrom(this.store.pipe(select(getArticlesConfig))),
    switchMap(([action, filters]) => {
      return this.articlesService.query(filters)
        .pipe(
          switchMap(response => {
            const { entities, result }: NormalizedArticlesResponse = ArticlesCashService.normalizeArticlesResponce(response);
            const articles: Articles = {
              items: entities.articles,
              ids: result.articles,
              articlesCount: result.articlesCount
            };
            return of(new LoadArticlesLoaded({ articles }));
          }),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new LoadArticlesFail());
          }),
          finalize(() => {
            this.store.dispatch(new LoadArticlesCompleted());
          }),
        );
    })
  );

  @Effect()
  loadTags$ = this.actions$.pipe(
    ofType<LoadTagsRequest>(ArticlesActionTypes.LoadTagsRequest),
    withLatestFrom(this.store.pipe(select(selectArticlesTags))),
    switchMap(([action, tags]): Observable<LoadTagsLoaded | LoadTagsFail> => {
      if (tags.length) {
        return of(new LoadTagsLoaded({ tags }));
      }
      return this.tagService.getAll()
        .pipe(
          switchMap(ts => of(new LoadTagsLoaded({ tags: ts }))),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new LoadTagsFail());
          }),
          finalize(() => {
            this.store.dispatch(new LoadTagsCompleted());
          }),
        );
    })
  );

  @Effect()
  taggleFavoriteArticle$ = this.actions$.pipe(
    ofType<ToggleArticleFavoriteRequest>(ArticlesActionTypes.ToggleArticleFavoriteRequest),
    withLatestFrom(this.store.pipe(select(selectAuthLoggedIn))),
    mergeMap(([action, isLoggedIn]): Observable<UnFavoriteArticleRequest | FavoriteArticleRequest | SetFavoritingArticle> => {
      if (!isLoggedIn) {
        return of(new SetFavoritingArticle({ article: action.payload.article }));
      }
      const { article } = action.payload;
      const isFavorited = article.favorited;

      if (isFavorited) {
        return of(new UnFavoriteArticleRequest({ article }));
      } else {
        return of(new FavoriteArticleRequest({ article }));
      }
    })
  );

  @Effect()
  setFavoritingArticle$ = this.actions$.pipe(
    ofType<SetFavoritingArticle>(ArticlesActionTypes.SetFavoritingArticle),
    map(() => new LogoutAction())
  );

  @Effect()
  clearReturnStateFromRouteChange$ = this.actions$.pipe(
    ofType<ClearReturnStateFromRouteChange>(AuthActionTypes.ClearReturnStateFromRouteChange),
    map(() => new ClearFavoritingArticle())
  );

  @Effect()
  loginSuccessArticle$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    withLatestFrom(this.store.pipe(select(selectFavoritingArticle))),
    filter(([action, article]) => !!article),
    map(([action, article]) => new FavoriteArticleRequest({ article }))
  );

  @Effect()
  unFavoriteArticle$ = this.actions$.pipe(
    ofType<UnFavoriteArticleRequest>(ArticlesActionTypes.UnFavoriteArticleRequest),
    mergeMap(action => {
      const { article } = action.payload;
      const { slug } = article;

      return this.articlesService.unfavorite(slug)
        .pipe(
          map(res => {
            const art = res.article;
            return new ToggleArticleFavoriteSuccess({ article: art });
          }),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new ToggleArticleFavoriteFail({ article }));
          })
        );

    })
  );

  @Effect()
  favoriteArticle$ = this.actions$.pipe(
    ofType<FavoriteArticleRequest>(ArticlesActionTypes.FavoriteArticleRequest),
    withLatestFrom(this.store.pipe(select(selectFavoritingArticle))),
    mergeMap(([action, favoritingArticle]) => {
      const { article } = action.payload;
      const { slug } = article;

      return this.articlesService.favorite(slug)
        .pipe(
          map(res => {
            const art = res.article;
            return new ToggleArticleFavoriteSuccess({ article: art, showNotification: !favoritingArticle});
          }),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new ToggleArticleFavoriteFail({ article, showNotification: !favoritingArticle }));
          })
        );
    })
  );

  @Effect({dispatch: false})
  toggleArticleFavoriteSuccess$ = this.actions$.pipe(
    ofType<ToggleArticleFavoriteSuccess>(ArticlesActionTypes.ToggleArticleFavoriteSuccess),
    filter(action => action.payload.showNotification),
    map(action => action.payload.article),
    switchMap((article: Article) => this.translateService.get('conduit.article.favorite.success', {value: article.slug})),
    tap((notification: string) => this.notificationService.success({message: notification}))
  );

  @Effect({ dispatch: false })
  toggleArticleFavoriteFail$ = this.actions$.pipe(
    ofType<ToggleArticleFavoriteFail>(ArticlesActionTypes.ToggleArticleFavoriteFail),
    filter(action => action.payload.showNotification),
    map(action => action.payload.article),
    switchMap((article: Article) => this.translateService.get('conduit.article.favorite.fail', {value: article.slug})),
    tap((notification: string) => this.notificationService.error({ message: notification }))
  );
}
