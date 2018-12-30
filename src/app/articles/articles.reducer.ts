import { ArticlesActionTypes, ArticlesActions } from './articles.actions';
import { ArticlesConfigState } from './articlesConfig.reducer';
import { Article } from '@app/core';

export interface ArticlesState {
  items: object;
  ids: string[];
  tags: string[];
  loadingTags: boolean;
  errorLoadingTags: boolean;
  loadingArticles: boolean;
  errorLoadingArticles: boolean;
  articlesCount: number;
  currentPage: number;
  returnConfig: null | ArticlesConfigState;
  favoritingArticle: null | Article;
}

export const initialState: ArticlesState = {
  items: {},
  ids: [],
  tags: [],
  loadingTags: false,
  errorLoadingTags: false,
  loadingArticles: false,
  errorLoadingArticles: false,
  articlesCount: 0,
  currentPage: 1,
  returnConfig: null,
  favoritingArticle: null
};

export function articlesReducer(state = initialState, action: ArticlesActions): ArticlesState {
  switch (action.type) {
    /* Articles */
    case ArticlesActionTypes.LoadArticlesRequest:
      return {
        ...state,
        items: {},
        ids: [],
        loadingArticles: true,
        errorLoadingArticles: false
      };
    case ArticlesActionTypes.LoadArticlesLoaded:
      const { articles } = action.payload;
      return {
        ...state,
        items: { ...articles.items },
        ids: [...articles.ids],
        articlesCount: articles.articlesCount,
        loadingArticles: false
      };
    case ArticlesActionTypes.LoadArticlesFail:
      return { ...state, errorLoadingArticles: true };

    case ArticlesActionTypes.ToggleArticleFavoriteRequest: {
      const { article } = action.payload;
      const newArticle = { ...article, favoriting: true };
      const { slug } = article;
      const newItems = { ...state.items, ...{ [slug]: newArticle } };
      return { ...state, items: { ...newItems } };
    }

    case ArticlesActionTypes.ToggleArticleFavoriteSuccess: {
      const { article } = action.payload;
      const { slug } = article;
      const newItems = { ...state.items, ...{ [slug]: article } };
      return { ...state, items: { ...newItems } };
    }

    case ArticlesActionTypes.ToggleArticleFavoriteFail: {
      const { article } = action.payload;
      const { slug } = article;
      const newItems = { ...state.items, ...{ [slug]: article } };
      return { ...state, items: { ...newItems } };
    }

    case ArticlesActionTypes.SetReturnArticlesConfig: {
      return { ...state, returnConfig: action.payload.config };
    }

    case ArticlesActionTypes.ClearReturnArticlesConfig: {
      return { ...state, returnConfig: null };
    }

    case ArticlesActionTypes.SetFavoritingArticle: {
      return { ...state, favoritingArticle: action.payload.article };
    }

    case ArticlesActionTypes.ClearFavoritingArticle: {
      return { ...state, favoritingArticle: null };
    }

    /* Tags */
    case ArticlesActionTypes.LoadTagsRequest:
      return { ...state, loadingTags: true, errorLoadingTags: false };
    case ArticlesActionTypes.LoadTagsLoaded:
      return { ...state, tags: action.payload.tags, loadingTags: false };
    // case ArticlesActionTypes.LoadTagsCompleted:
    //   return { ...state, loadingTags: false };
    case ArticlesActionTypes.LoadTagsFail:
      return { ...state, errorLoadingTags: true };
    default:
      return state;
  }
}
