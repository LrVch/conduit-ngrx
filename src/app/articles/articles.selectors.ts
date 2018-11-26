import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { ArticlesState } from './articles.reducer';
import { ArticlesConfigState } from './articlesConfig.reducer';

export const selectArticlesState = createFeatureSelector<AppState, ArticlesState>('articles');

/* Tags */
export const selectArticlesTagsLoading = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.loadingTags
);

export const selectArticlesTagsFailLoading = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.errorLoadingTags
);

export const selectArticlesTags = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.tags
);


/* Articles */
export const selectArticlesItems = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => Object.values(articlesState.items)
);

export const selectArticlesCount = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.articlesCount
);

export const selectArticlesLoading = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.loadingArticles
);

export const selectArticlesFailLoading = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.errorLoadingArticles
);

export const selectArticlesCurrentPage = createSelector(
  selectArticlesState,
  (articlesState: ArticlesState) => articlesState.currentPage
);

/* ArticlesConfig */
export const selectArticlesConfigState = createFeatureSelector<AppState, ArticlesConfigState>('articlesConfig');

export const getArticlesConfig = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState
);

export const getArticlesFiltersType = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState.type
);

export const getArticlesFilters = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState.filters
);

export const getArticlesCurrentTag = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState.filters.tag
);

export const getArticlesAuthor = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState.filters.author
);

export const getArticlesFavorited = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState.filters.favorited
);

export const getArticlesLimit = createSelector(
  selectArticlesConfigState,
  (articlesConfigState: ArticlesConfigState) => articlesConfigState.filters.limit
);
