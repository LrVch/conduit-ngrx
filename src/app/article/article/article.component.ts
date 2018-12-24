import { Component, OnInit } from '@angular/core';
import { Article, User, Errors, Profile, Comment } from 'src/app/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import {
  selectArticle,
  selectArticleErrors,
  selectArticleDeleting,
  selectComments,
  selectGetCommentsErrors,
  selectCommentLoading,
  selectCommentSaving,
  selectAddCommentErrors,
  selecCommentReset,
  selectDeleteCommentErrors,
} from '../aritcle.selectors';
import { withLatestFrom, switchMap, filter, tap, take, map } from 'rxjs/operators';
import { selectUser } from 'src/app/auth/auth.selectors';
import {
  ArticleDeleteRequest,
  ArticleToggleFollowingRequest,
  ArticleCommentsRequest,
  ArticleCommentAddRequest,
  ArticleCommentDeleteRequest,
  ArticleDeleteConfirmation,
  ArticleDeleteConfirmationRequest
} from '../article.actions';
import { ToggleArticleFavoriteRequest } from 'src/app/articles/articles.actions';
import { LogoutAction } from 'src/app/auth/auth.actions';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article$: Observable<Article>;
  canModify$: Observable<boolean>;
  isDeletingArticle$: Observable<boolean>;
  articleErrors$: Observable<Errors>;
  user$: Observable<User>;
  comments$: Observable<Comment[]>;
  getCommentsErrors$: Observable<Errors>;
  addCommentErrors$: Observable<Errors>;
  deleteCommentErrors$: Observable<Errors>;
  isCommentLoading$: Observable<boolean>;
  isCommentSaving$: Observable<boolean>;
  needReset$: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.article$ = this.store.pipe(select(selectArticle));

    this.canModify$ = this.article$.pipe(
      filter(article => !!article),
      withLatestFrom(this.store.pipe(select(selectUser))),
      switchMap(([article, user]: [Article, User]) => {
        return user ? of(article.author.username === user.username) : of(false);
      })
    );

    this.user$ = this.store.pipe(select(selectUser));

    this.articleErrors$ = this.store.pipe(select(selectArticleErrors));
    this.isDeletingArticle$ = this.store.pipe(select(selectArticleDeleting));

    this.comments$ = this.store.pipe(select(selectComments));
    this.getCommentsErrors$ = this.store.pipe(select(selectGetCommentsErrors));
    this.addCommentErrors$ = this.store.pipe(select(selectAddCommentErrors));
    this.deleteCommentErrors$ = this.store.pipe(select(selectDeleteCommentErrors));
    this.isCommentLoading$ = this.store.pipe(select(selectCommentLoading));
    this.isCommentSaving$ = this.store.pipe(select(selectCommentSaving));
    this.needReset$ = this.store.pipe(select(selecCommentReset));

    this.article$.pipe(
      map(article => article.slug),
      tap(slug => this.store.dispatch(new ArticleCommentsRequest({ slug }))),
      take(1)
    ).subscribe();
  }

  onToggleFollowing(profile: Profile): void {
    this.store.dispatch(new ArticleToggleFollowingRequest({ profile }));
  }

  onFavoriveToggle(article: Article): void {
    this.store.dispatch(new ToggleArticleFavoriteRequest({ article }));
  }

  onDeleteArticle(article: Article): void {
    this.store.dispatch(new ArticleDeleteConfirmationRequest({ article, question: 'Are you sure you want to delete article?' }));
  }

  onDeleteComment(comment: Comment): void {
    this.store.dispatch(new ArticleCommentDeleteRequest({ comment }));
  }

  onSubmitComment(comment: string): void {
    this.store.dispatch(new ArticleCommentAddRequest({ comment }));
  }

  onSignIn() {
    this.store.dispatch(new LogoutAction());
  }

  onSignUp() {
    this.store.dispatch(new LogoutAction({ path: 'register' }));
  }
}
