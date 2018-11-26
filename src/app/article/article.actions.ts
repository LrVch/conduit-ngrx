import { Action } from '@ngrx/store';
import { Article, Errors, Profile, Comment } from '../core';

export enum ArticleActionTypes {
  ArticleLoadSuccess = '[Article] Load Success',
  ArticleClear = '[Article] Load Clear',

  ArticleDeleteRequest = '[Article] Load Delete Request',
  ArticleDeleteSuccess = '[Article] Load Delete Success',
  ArticleDeleteFail = '[Article] Load Delete Fail',

  ArticleToggleFollowingRequest = '[Article] Article Toggle Following Request',
  ArticleToggleFollowingSuccess = '[Article] Article Toggle Following Success',
  ArticleToggleFollowingFail = '[Article] Article Toggle Following Fail',
  ArticleFollowingRequest = '[Article] Article Following Request',
  ArticleUnFollowingRequest = '[Article] Article UnFollowing Request',

  ArticleCommentsRequest = '[Article] Load Comments Request',
  ArticleCommentsSuccess = '[Article] Load Comments Success',
  ArticleCommentsFail = '[Article] Load Comments Fail',

  ArticleCommentAddRequest = '[Article] Load Comment Add Request',
  ArticleCommentAddSuccess = '[Article] Load Comment Add Success',
  ArticleCommentAddFail = '[Article] Load Comment Add Fail',

  ArticleCommentDeleteRequest = '[Article] Load Comment Delete Request',
  ArticleCommentDeleteSuccess = '[Article] Load Comment Delete Success',
  ArticleCommentDeleteFail = '[Article] Load Comment Delete Fail',
}

export class ArticleLoadSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleLoadSuccess;

  constructor(public payload: { article: Article }) { }
}

export class ArticleDeleteRequest implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteRequest;

  constructor(public payload: { article: Article }) { }
}

export class ArticleDeleteSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteSuccess;
}

export class ArticleDeleteFail implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteFail;

  constructor(public payload: { errors: Errors }) { }
}

export class ArticleToggleFollowingRequest implements Action {
  readonly type = ArticleActionTypes.ArticleToggleFollowingRequest;

  constructor(public payload: { profile: Profile }) { }
}

export class ArticleToggleFollowingSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleToggleFollowingSuccess;

  constructor(public payload: { profile: Profile }) { }
}

export class ArticleToggleFollowingFail implements Action {
  readonly type = ArticleActionTypes.ArticleToggleFollowingFail;
}

export class ArticleFollowingRequest implements Action {
  readonly type = ArticleActionTypes.ArticleFollowingRequest;

  constructor(public payload: { profile: Profile }) { }
}

export class ArticleUnFollowingRequest implements Action {
  readonly type = ArticleActionTypes.ArticleUnFollowingRequest;

  constructor(public payload: { profile: Profile }) { }
}

export class ArticleCommentsRequest implements Action {
  readonly type = ArticleActionTypes.ArticleCommentsRequest;

  constructor(public payload: { slug: string }) { }
}

export class ArticleCommentsSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleCommentsSuccess;

  constructor(public payload: { comments: Comment[] }) { }
}

export class ArticleCommentsFail implements Action {
  readonly type = ArticleActionTypes.ArticleCommentsFail;

  constructor(public payload: { errors: Errors }) { }
}

export class ArticleCommentAddRequest implements Action {
  readonly type = ArticleActionTypes.ArticleCommentAddRequest;

  constructor(public payload: { comment: Comment }) { }
}

export class ArticleCommentAddSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleCommentAddSuccess;

  constructor(public payload: { comment: Comment }) { }
}

export class ArticleCommentAddFail implements Action {
  readonly type = ArticleActionTypes.ArticleCommentAddFail;

  constructor(public payload: { errors: Errors }) { }
}

export class ArticleCommentDeleteRequest implements Action {
  readonly type = ArticleActionTypes.ArticleCommentDeleteRequest;

  constructor(public payload: { comment: Comment }) { }
}

export class ArticleCommentDeleteSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleCommentDeleteSuccess;

  constructor(public payload: { id: number }) { }
}

export class ArticleCommentDeleteFail implements Action {
  readonly type = ArticleActionTypes.ArticleCommentDeleteFail;

  constructor(public payload: { errors: Errors, id: number }) { }
}


export type ArticleActions =
  ArticleLoadSuccess
  | ArticleDeleteRequest
  | ArticleDeleteSuccess
  | ArticleDeleteFail
  | ArticleToggleFollowingRequest
  | ArticleToggleFollowingSuccess
  | ArticleToggleFollowingFail
  | ArticleFollowingRequest
  | ArticleUnFollowingRequest
  | ArticleCommentsRequest
  | ArticleCommentsSuccess
  | ArticleCommentsFail
  | ArticleCommentAddRequest
  | ArticleCommentAddSuccess
  | ArticleCommentAddFail
  | ArticleCommentDeleteRequest
  | ArticleCommentDeleteSuccess
  | ArticleCommentDeleteFail;
