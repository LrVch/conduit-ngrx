import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { ArticlesService, ProfilesService, CommentsService, Profile } from '@app/core';
import { switchMap, map, tap, catchError, mergeMap, retry, withLatestFrom, filter, exhaustMap } from 'rxjs/operators';
import {
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
  ArticleDeleteConfirmation,
  ArticleDeleteConfirmationRequest,
} from './article.actions';
import { of, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { ShowMainLoader, HideMainLoader } from '@app/layout/layout.actions';
import { selectAuthLoggedIn } from '@app/auth/auth.selectors';
import { LogoutAction, ClearReturnStateFromRouteChange, AuthActionTypes, LoginSuccess } from '@app/auth/auth.actions';
import { selectArticle, selectFollowingProfile } from './aritcle.selectors';
import { NotificationService } from '@app/core/services/notification.service';
import { DialogService } from '@app/core/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class ArticleEffects {

  constructor(
    private actions$: Actions,
    private articleService: ArticlesService,
    private router: Router,
    private store: Store<AppState>,
    private profileService: ProfilesService,
    private commentsService: CommentsService,
    private notificationService: NotificationService,
    private dialog: DialogService,
    private translaService: TranslateService
  ) { }

  @Effect()
  articleDeleteConfirmationRequest$ = this.actions$.pipe(
    ofType<ArticleDeleteConfirmationRequest>(
      ArticleActionTypes.ArticleDeleteConfirmationRequest,
    ),
    switchMap(action => this.translaService.get(action.payload.question)),
    exhaustMap(question => {
      const dialogRef = this.dialog.confirmation({
        data: { question: question },
      });

      return dialogRef.afterClosed();
    }),
    filter(v => !!v),
    withLatestFrom(this.store.pipe(select(selectArticle))),
    map(([action, article]) => new ArticleDeleteConfirmation({ article })),
  );

  @Effect()
  deleteArticle$ = this.actions$.pipe(
    ofType<ArticleDeleteConfirmation>(ArticleActionTypes.ArticleDeleteConfirmation),
    map(article => article.payload.article.slug),
    switchMap(slug => this.articleService.destroy(slug).pipe(
      withLatestFrom(this.store.pipe(select(selectArticle))),
      map(([action, article]) => new ArticleDeleteSuccess({ article })),
      catchError(errors => {
        console.error(errors);
        return of(new ArticleDeleteFail({ errors }));
      })
    )));

  @Effect({ dispatch: false })
  articleDeleteRequest$ = this.actions$.pipe(
    ofType<ArticleDeleteConfirmation>(ArticleActionTypes.ArticleDeleteConfirmation),
    tap(_ => this.store.dispatch(new ShowMainLoader()))
  );

  @Effect({ dispatch: false })
  articleDeleteSuccess$ = this.actions$.pipe(
    ofType<ArticleDeleteSuccess>(ArticleActionTypes.ArticleDeleteSuccess),
    map(action => action.payload.article.author.username),
    tap(username => this.router.navigate(['/profile', username]))
  );

  @Effect({ dispatch: false })
  articleDeleteFail$ = this.actions$.pipe(
    ofType<ArticleDeleteFail>(ArticleActionTypes.ArticleDeleteFail),
    tap(_ => this.store.dispatch(new HideMainLoader()))
  );

  @Effect()
  toggleFollowUserArticle$ = this.actions$.pipe(
    ofType<ArticleToggleFollowingRequest>(ArticleActionTypes.ArticleToggleFollowingRequest),
    withLatestFrom(this.store.pipe(select(selectAuthLoggedIn))),
    mergeMap(([action, isLoggedIn]): Observable<ArticleUnFollowingRequest | ArticleFollowingRequest | SetFollowingProfile> => {
      if (!isLoggedIn) {
        return of(new SetFollowingProfile({ profile: action.payload.profile }));
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
  setFollowingProfile$ = this.actions$.pipe(
    ofType<SetFollowingProfile>(ArticleActionTypes.SetFollowingProfile),
    map(() => new LogoutAction())
  );

  @Effect()
  clearReturnStateFromRouteChange$ = this.actions$.pipe(
    ofType<ClearReturnStateFromRouteChange>(AuthActionTypes.ClearReturnStateFromRouteChange),
    map(() => new ClearFollowingProfile())
  );

  @Effect()
  loginSuccessArticle$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    withLatestFrom(this.store.pipe(select(selectFollowingProfile))),
    filter(([action, profile]) => !!profile),
    map(([action, profile]) => new ArticleFollowingRequest({ profile }))
  );

  @Effect()
  articleFollowing$ = this.actions$.pipe(
    ofType<ArticleFollowingRequest>(ArticleActionTypes.ArticleFollowingRequest),
    withLatestFrom(this.store.pipe(select(selectFollowingProfile))),
    mergeMap(([action, favoritingProfile]) => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.follow(username)
        .pipe(
          map(result => {
            return new ArticleToggleFollowingSuccess({ profile: result.profile, showNotification: !favoritingProfile });
          }),
          retry(3),
          catchError(error => {
            console.error(error);
            return of(new ArticleToggleFollowingFail({ profile, showNotification: !favoritingProfile }));
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
            return of(new ArticleToggleFollowingFail({ profile }));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  articleToggleFollowingSuccess$ = this.actions$.pipe(
    ofType<ArticleToggleFollowingSuccess>(ArticleActionTypes.ArticleToggleFollowingSuccess),
    filter(action => action.payload && action.payload.showNotification),
    map(action => action.payload.profile),
    switchMap((profile: Profile) => this.translaService.get('conduit.profile.follow.succes', { value: profile.username })),
    tap((notification: string) => this.notificationService.default({ message: notification }))
  );

  @Effect({ dispatch: false })
  articleToggleFollowingFail$ = this.actions$.pipe(
    ofType<ArticleToggleFollowingFail>(ArticleActionTypes.ArticleToggleFollowingFail),
    filter(action => action.payload && action.payload.showNotification),
    map(action => action.payload.profile),
    switchMap((profile: Profile) => this.translaService.get('conduit.profile.follow.fail', { value: profile.username })),
    tap((notification: string) => this.notificationService.error({ message: notification }))
  );

  @Effect()
  loadComments$ = this.actions$.pipe(
    ofType<ArticleCommentsRequest>(ArticleActionTypes.ArticleCommentsRequest),
    map(article => article.payload.slug),
    switchMap(slug => this.commentsService.getAll(slug).pipe(
      map(comments => new ArticleCommentsSuccess({ comments })),
      retry(3),
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
          retry(3),
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
          retry(3),
          catchError(errors => {
            console.error(errors);
            return of(new ArticleCommentDeleteFail({ errors, id }));
          }));
    }));
}
