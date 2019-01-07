import { Action } from '@ngrx/store';
import { Article, Errors } from '@app/core';
import { Articles } from '@app/core/models/articles.model';
import { ArticlesConfigState } from './articlesConfig.reducer';

export enum ArticlesActionTypes {
  /* Articles */
  LoadArticlesRequest = '[Articles] Load Articles Request',
  LoadArticlesLoaded = '[Articles] Load Articles Loaded',
  LoadArticlesCompleted = '[Articles] Load Articles Completed',
  LoadArticlesFail = '[Articles] Load Articles Fail',
  SetReturnArticlesConfig = '[Articles] Set Return Articles Config',
  ClearReturnArticlesConfig = '[Articles] Clear Return Articles Config',

  /* Article */
  ToggleArticleFavoriteRequest = '[Article] Toggle Article Favorite Request',
  ToggleArticleFavoriteSuccess = '[Article] Toggle Article Favorite Success',
  ToggleArticleFavoriteFail = '[Article] Toggle Article Favorite Fail',
  UnFavoriteArticleRequest = '[Article] Un Favorite Article Request',
  FavoriteArticleRequest = '[Article] Favorite Article Request',
  SetFavoritingArticle = '[Article] Set Favoriting Article',
  ClearFavoritingArticle = '[Article] Clear Favoriting Article',

  ArticlesDeleteArticleRequest = '[Articles] Delete Article Request',
  ArticlesDeleteArticleSuccess = '[Articles] Delete Article Success',
  ArticlesDeleteArticleFail = '[Articles] Delete Article Fail',
  ArticlesDeleteArticleConfirmationRequest = '[Articles] Article Delete Confirmation Request',
  ArticlesDeleteArticleConfirmation = '[Articles] Article Delete Confirmation',

  /* Tags */
  LoadTagsRequest = '[Articles] Load Tags Request',
  LoadTagsLoaded = '[Articles] Load Tags Loaded',
  LoadTagsCompleted = '[Articles] Load Tags Completed',
  LoadTagsFail = '[Articles] Load Tags Fail',

  /* Articles config */
  SetTag = '[Articles] Set Tag',
  SetAuthor = '[Articles] Set Author',
  SetOffset = '[Articles] Set Offset',
  SetLimit = '[Articles] Set Limit',
  SetPageIndex = '[Articles] Set Page Index',
  SetFavorited = '[Articles] Set Favorited',
  SetCurrentPage = '[Articles] Set Current Page',
  SetTypeOfFeed = '[Articles] Set Type Of Feed',
  ResetConfig = '[Articles] Reset Config',
}

/* Articles */
export class ClearReturnArticlesConfig implements Action {
  readonly type = ArticlesActionTypes.ClearReturnArticlesConfig;
}

export class SetReturnArticlesConfig implements Action {
  readonly type = ArticlesActionTypes.SetReturnArticlesConfig;

  constructor(public payload: { config: ArticlesConfigState }) { }
}

export class LoadArticlesRequest implements Action {
  readonly type = ArticlesActionTypes.LoadArticlesRequest;
}

export class LoadArticlesLoaded implements Action {
  readonly type = ArticlesActionTypes.LoadArticlesLoaded;

  constructor(public payload: { articles: Articles }) { }
}

export class LoadArticlesCompleted implements Action {
  readonly type = ArticlesActionTypes.LoadArticlesCompleted;
}

export class LoadArticlesFail implements Action {
  readonly type = ArticlesActionTypes.LoadArticlesFail;
}

export class SetCurrentPage implements Action {
  readonly type = ArticlesActionTypes.SetCurrentPage;

  constructor(public payload: { currentPage: number }) { }
}

/* Article */
export class ToggleArticleFavoriteRequest implements Action {
  readonly type = ArticlesActionTypes.ToggleArticleFavoriteRequest;

  constructor(public payload: { article: Article }) { }
}

export class ToggleArticleFavoriteSuccess implements Action {
  readonly type = ArticlesActionTypes.ToggleArticleFavoriteSuccess;

  constructor(public payload: { article: Article, showNotification?: boolean }) { }
}

export class ToggleArticleFavoriteFail implements Action {
  readonly type = ArticlesActionTypes.ToggleArticleFavoriteFail;

  constructor(public payload: { article: Article, showNotification?: boolean  }) { }
}

export class UnFavoriteArticleRequest implements Action {
  readonly type = ArticlesActionTypes.UnFavoriteArticleRequest;

  constructor(public payload: { article: Article }) { }
}

export class FavoriteArticleRequest implements Action {
  readonly type = ArticlesActionTypes.FavoriteArticleRequest;

  constructor(public payload: { article: Article }) { }
}

export class SetFavoritingArticle implements Action {
  readonly type = ArticlesActionTypes.SetFavoritingArticle;

  constructor(public payload: { article: Article }) { }
}

export class ClearFavoritingArticle implements Action {
  readonly type = ArticlesActionTypes.ClearFavoritingArticle;
}

export class ArticlesDeleteArticleRequest implements Action {
  readonly type = ArticlesActionTypes.ArticlesDeleteArticleRequest;

  constructor(public payload: { article: Article }) { }
}

export class ArticlesDeleteArticleSuccess implements Action {
  readonly type = ArticlesActionTypes.ArticlesDeleteArticleSuccess;

  constructor(public payload?: { article?: Article }) { }
}

export class ArticlesDeleteArticleFail implements Action {
  readonly type = ArticlesActionTypes.ArticlesDeleteArticleFail;

  constructor(public payload: { article: Article }) { }
}

export class ArticlesDeleteArticleConfirmationRequest implements Action {
  readonly type = ArticlesActionTypes.ArticlesDeleteArticleConfirmationRequest;

  constructor(public payload: { article: Article, question: string }) { }
}

export class ArticlesDeleteArticleConfirmation implements Action {
  readonly type = ArticlesActionTypes.ArticlesDeleteArticleConfirmation;

  constructor(public payload: { article: Article}) { }
}




/* Tags */
export class LoadTagsRequest implements Action {
  readonly type = ArticlesActionTypes.LoadTagsRequest;
}

export class LoadTagsLoaded implements Action {
  readonly type = ArticlesActionTypes.LoadTagsLoaded;

  constructor(public payload: { tags: string[] }) { }
}

export class LoadTagsCompleted implements Action {
  readonly type = ArticlesActionTypes.LoadTagsCompleted;
}

export class LoadTagsFail implements Action {
  readonly type = ArticlesActionTypes.LoadTagsFail;
}


/* Config */
export class SetTag implements Action {
  readonly type = ArticlesActionTypes.SetTag;

  constructor(public payload: { tag: string }) { }
}

export class SetTypeOfFeed implements Action {
  readonly type = ArticlesActionTypes.SetTypeOfFeed;

  constructor(public payload: { type: string }) { }
}

export class SetAuthor implements Action {
  readonly type = ArticlesActionTypes.SetAuthor;

  constructor(public payload: { author: string }) { }
}

export class SetOffset implements Action {
  readonly type = ArticlesActionTypes.SetOffset;

  constructor(public payload: { offset: number }) { }
}

export class SetLimit implements Action {
  readonly type = ArticlesActionTypes.SetLimit;

  constructor(public payload: { limit: number }) { }
}

export class SetPageIndex implements Action {
  readonly type = ArticlesActionTypes.SetPageIndex;

  constructor(public payload: { pageIndex: number }) { }
}

export class SetFavorited implements Action {
  readonly type = ArticlesActionTypes.SetFavorited;

  constructor(public payload: { favorited: string }) { }
}

export class ResetConfig implements Action {
  readonly type = ArticlesActionTypes.ResetConfig;
}

export type ArticlesActions =
  /* Tags */
  | LoadTagsRequest
  | LoadTagsLoaded
  | LoadTagsCompleted
  | LoadTagsFail
  | SetCurrentPage
  /* Articles */
  | ClearReturnArticlesConfig
  | SetReturnArticlesConfig
  | LoadArticlesRequest
  | LoadArticlesLoaded
  | LoadArticlesCompleted
  | LoadArticlesFail
  /* Article */
  | ToggleArticleFavoriteRequest
  | ToggleArticleFavoriteSuccess
  | ToggleArticleFavoriteFail
  | UnFavoriteArticleRequest
  | FavoriteArticleRequest
  | SetFavoritingArticle
  | ClearFavoritingArticle
  | ArticlesDeleteArticleRequest
  | ArticlesDeleteArticleSuccess
  | ArticlesDeleteArticleFail
  | ArticlesDeleteArticleConfirmationRequest
  | ArticlesDeleteArticleConfirmation
  /* Articles config */
  | SetTypeOfFeed
  | SetTag
  | SetAuthor
  | SetOffset
  | SetLimit
  | SetPageIndex
  | SetFavorited
  | ResetConfig;
