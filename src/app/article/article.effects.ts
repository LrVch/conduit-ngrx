import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { ArticlesService, ProfilesService, CommentsService } from '../core';
import { switchMap, map, tap, catchError, mergeMap, retry, withLatestFrom, filter } from 'rxjs/operators';
import {
  ArticleDeleteRequest,
  ArticleActionTypes,
  ArticleDeleteSuccess,
  ArticleDeleteFail,
  ArticleToggleFollowingRequest,
  ArticleUnFollowingRequest,
  ArticleFollowingRequest,
  ArticleToggleFollowingSuccess,
  ArticleToggleFollowingFail,
  ArticleCommentsRequest,
  ArticleCommentsSuccess,
  ArticleCommentsFail,
  ArticleCommentAddRequest,
  ArticleCommentAddSuccess,
  ArticleCommentAddFail,
  ArticleCommentDeleteRequest,
  ArticleCommentDeleteSuccess,
  ArticleCommentDeleteFail,
  SetFollowingProfile,
  ClearFollowingProfile,
} from './article.actions';
import { of, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { ShowMainLoader, HideMainLoader } from '../layout/layout.actions';
import { selectAuthLoggedIn } from '../auth/auth.selectors';
import { LogoutAction, ClearReturnStateFromRouteChange, AuthActionTypes, LoginSuccess } from '../auth/auth.actions';
import { selectArticle, selectFollowingProfile } from './aritcle.selectors';


@Injectable()
export class ArticleEffects {

  constructor(
    private actions$: Actions,
    private articleService: ArticlesService,
    private router: Router,
    private store: Store<AppState>,
    private profileService: ProfilesService,
    private commentsService: CommentsService
  ) { }

  @Effect()
  deleteArticle$ = this.actions$.pipe(
    ofType<ArticleDeleteRequest>(ArticleActionTypes.ArticleDeleteRequest),
    map(article => article.payload.article.slug),
    tap(_ => this.store.dispatch(new ShowMainLoader())),
    switchMap(slug => this.articleService.destroy(slug).pipe(
      tap(article => this.router.navigateByUrl('/')),
      map(article => new ArticleDeleteSuccess()),
      catchError(errors => {
        console.error(errors);
        this.store.dispatch(new HideMainLoader());
        return of(new ArticleDeleteFail({ errors }));
      })
    )));

  @Effect()
  toggleFollowUserArticle$ = this.actions$.pipe(
    ofType<ArticleToggleFollowingRequest>(ArticleActionTypes.ArticleToggleFollowingRequest),
    withLatestFrom(this.store.select(selectAuthLoggedIn)),
    mergeMap(([action, isLoggedIn]): Observable<ArticleUnFollowingRequest | ArticleFollowingRequest | SetFollowingProfile> => {
      if (!isLoggedIn) {
        return of(new SetFollowingProfile({profile: action.payload.profile}));
      }
      const { profile } = action.payload;
      const { following } = profile;

      if (following) {
        return of(new ArticleUnFollowingRequest({ profile }));
      } else {
        return of(new ArticleFollowingRequest({ profile }));
      }
    })
  );

  @Effect()
  setFollowingArticle$ = this.actions$.pipe(
    ofType<SetFollowingProfile>(ArticleActionTypes.SetFollowingProfile),
    map(() => new LogoutAction())
  );

  @Effect()
  clearReturnStateArticle$ = this.actions$.pipe(
    ofType<ClearReturnStateFromRouteChange>(AuthActionTypes.ClearReturnStateFromRouteChange),
    map(() => new ClearFollowingProfile())
  );

  @Effect()
  loginSuccessArticle$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    withLatestFrom(this.store.select(selectFollowingProfile)),
    filter(([action, profile]) => !!profile),
    map(([action, profile]) => new ArticleFollowingRequest({ profile }))
  );

  @Effect()
  articleFollowing$ = this.actions$.pipe(
    ofType<ArticleFollowingRequest>(ArticleActionTypes.ArticleFollowingRequest),
    mergeMap(action => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.follow(username)
        .pipe(
          map(result => {
            return new ArticleToggleFollowingSuccess({ profile: result.profile });
          }),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new ArticleToggleFollowingFail());
          })
        );
    })
  );

  @Effect()
  aricleUnFollowing$ = this.actions$.pipe(
    ofType<ArticleUnFollowingRequest>(ArticleActionTypes.ArticleUnFollowingRequest),
    mergeMap(action => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.unfollow(username)
        .pipe(
          map(result => {
            return new ArticleToggleFollowingSuccess({ profile: result.profile });
          }),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new ArticleToggleFollowingFail());
          })
        );
    })
  );

  @Effect()
  loadComments$ = this.actions$.pipe(
    ofType<ArticleCommentsRequest>(ArticleActionTypes.ArticleCommentsRequest),
    map(article => article.payload.slug),
    switchMap(slug => this.commentsService.getAll(slug).pipe(
      map(comments => new ArticleCommentsSuccess({ comments })),
      catchError(errors => {
        console.error(errors);
        return of(new ArticleCommentsFail({ errors }));
      })
    )));

  @Effect()
  addComment$ = this.actions$.pipe(
    ofType<ArticleCommentAddRequest>(ArticleActionTypes.ArticleCommentAddRequest),
    withLatestFrom(this.store.pipe(select(selectArticle))),
    mergeMap(([action, article]) => {
      const { slug } = article;
      return this.commentsService.add(slug, action.payload.comment)
        .pipe(
          map(comment => new ArticleCommentAddSuccess({ comment })),
          catchError(errors => {
            console.error(errors);
            return of(new ArticleCommentAddFail({ errors }));
          }));
    }));

  @Effect()
  deleteComment$ = this.actions$.pipe(
    ofType<ArticleCommentDeleteRequest>(ArticleActionTypes.ArticleCommentDeleteRequest),
    withLatestFrom(this.store.pipe(select(selectArticle))),
    mergeMap(([action, article]) => {
      const { slug } = article;
      const { id } = action.payload.comment;
      return this.commentsService.destroy(id, slug)
        .pipe(
          map(_ => new ArticleCommentDeleteSuccess({ id })),
          catchError(errors => {
            console.error(errors);
            return of(new ArticleCommentDeleteFail({ errors, id }));
          }));
    }));
}
