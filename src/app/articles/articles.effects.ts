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
  tap
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
  ClearReturnArticlesConfig
} from './articles.actions';
import { TagsService, ArticlesService } from '../core';
import { of, Observable, from } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import {
  selectArticlesTags,
  getArticlesConfig
} from './articles.selectors';
import { ArticlesCashService, NormalizedArticlesResponse } from './articles-cash.service';
import { Articles } from '../core/models/articles.model';
import { selectAuthLoggedIn } from '../auth/auth.selectors';
import { LogoutAction } from '../auth/auth.actions';

@Injectable()
export class ArticlesEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagsService,
    private articlesService: ArticlesService,
    private store: Store<AppState>
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
    withLatestFrom(this.store.select(selectAuthLoggedIn)),
    mergeMap(([action, isLoggedIn]): Observable<UnFavoriteArticleRequest | FavoriteArticleRequest | LogoutAction> => {
      if (!isLoggedIn) {
        return of(new LogoutAction());
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
    mergeMap(action => {
      const { article } = action.payload;
      const { slug } = article;

      return this.articlesService.favorite(slug)
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
}
