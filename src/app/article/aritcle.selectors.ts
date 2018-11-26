import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { ArticleState } from './article.reducer';

export const selectArticleState = createFeatureSelector<AppState, ArticleState>('article');

export const selectArticle = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.selected
);

export const selectArticleDeleting = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.isArticleDeleting
);

export const selectArticleErrors = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.errors
);

export const selectComments = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.comments
);

export const selectGetCommentsErrors = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.getCommentsErrors
);

export const selectCommentLoading = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.isCommentsLoading
);

export const selectCommentSaving = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.isCommentSaving
);

export const selectAddCommentErrors = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.addCommentErrors
);

export const selecCommentReset = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.isCommentReset
);

export const selectDeleteCommentErrors = createSelector(
  selectArticleState,
  (articleState: ArticleState) => articleState.deleteCommentErrors
);
