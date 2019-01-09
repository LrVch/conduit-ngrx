import { Action } from '@ngrx/store';
import { Article, Errors, Profile, Comment } from '@app/core';

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
  SetFollowingProfile = '[Article] Set Following Profile',
  ClearFollowingProfile = '[Article] Clear Following Profile',

  ArticleCommentsRequest = '[Article] Load Comments Request',
  ArticleCommentsSuccess = '[Article] Load Comments Success',
  ArticleCommentsFail = '[Article] Load Comments Fail',

  ArticleCommentAddRequest = '[Article] Comment Add Request',
  ArticleCommentAddSuccess = '[Article] Comment Add Success',
  ArticleCommentAddFail = '[Article] Comment Add Fail',

  ArticleCommentDeleteRequest = '[Article] Comment Delete Request',
  ArticleCommentDeleteSuccess = '[Article] Comment Delete Success',
  ArticleCommentDeleteFail = '[Article] Comment Delete Fail',
  ArticleDeleteConfirmationRequest = '[Article] Article Delete Confirmation Request',
  ArticleDeleteConfirmation = '[Article] Article Delete Confirmation'
}

export class ArticleLoadSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleLoadSuccess;

  constructor(public payload: { article: Article }) {}
}

export class ArticleDeleteConfirmationRequest implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteConfirmationRequest;

  constructor(public payload: { article?: Article; question: string }) {}
}

export class ArticleDeleteConfirmation implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteConfirmation;

  constructor(public payload: { article: Article }) {}
}

export class ArticleDeleteRequest implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteRequest;

  constructor(public payload: { article: Article }) {}
}

export class ArticleDeleteSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteSuccess;

  constructor(public payload?: { article?: Article }) {}
}

export class ArticleDeleteFail implements Action {
  readonly type = ArticleActionTypes.ArticleDeleteFail;

  constructor(public payload: { errors: Errors }) {}
}

export class ArticleToggleFollowingRequest implements Action {
  readonly type = ArticleActionTypes.ArticleToggleFollowingRequest;

  constructor(public payload: { profile: Profile }) {}
}

export class ArticleToggleFollowingSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleToggleFollowingSuccess;

  constructor(
    public payload: { profile: Profile; showNotification?: boolean }
  ) {}
}

export class ArticleToggleFollowingFail implements Action {
  readonly type = ArticleActionTypes.ArticleToggleFollowingFail;

  constructor(
    public payload?: { profile: Profile; showNotification?: boolean }
  ) {}
}

export class ArticleFollowingRequest implements Action {
  readonly type = ArticleActionTypes.ArticleFollowingRequest;

  constructor(public payload: { profile: Profile }) {}
}

export class ArticleUnFollowingRequest implements Action {
  readonly type = ArticleActionTypes.ArticleUnFollowingRequest;

  constructor(public payload: { profile: Profile }) {}
}

export class ArticleCommentsRequest implements Action {
  readonly type = ArticleActionTypes.ArticleCommentsRequest;

  constructor(public payload: { slug: string }) {}
}

export class ArticleCommentsSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleCommentsSuccess;

  constructor(public payload: { comments: Comment[] }) {}
}

export class ArticleCommentsFail implements Action {
  readonly type = ArticleActionTypes.ArticleCommentsFail;

  constructor(public payload: { errors: Errors }) {}
}

export class ArticleCommentAddRequest implements Action {
  readonly type = ArticleActionTypes.ArticleCommentAddRequest;

  constructor(public payload: { comment: string }) {}
}

export class ArticleCommentAddSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleCommentAddSuccess;

  constructor(public payload: { comment: Comment }) {}
}

export class ArticleCommentAddFail implements Action {
  readonly type = ArticleActionTypes.ArticleCommentAddFail;

  constructor(public payload: { errors: Errors }) {}
}

export class ArticleCommentDeleteRequest implements Action {
  readonly type = ArticleActionTypes.ArticleCommentDeleteRequest;

  constructor(public payload: { comment: Comment }) {}
}

export class ArticleCommentDeleteSuccess implements Action {
  readonly type = ArticleActionTypes.ArticleCommentDeleteSuccess;

  constructor(public payload: { id: number }) {}
}

export class ArticleCommentDeleteFail implements Action {
  readonly type = ArticleActionTypes.ArticleCommentDeleteFail;

  constructor(public payload: { errors: Errors; id: number }) {}
}

export class SetFollowingProfile implements Action {
  readonly type = ArticleActionTypes.SetFollowingProfile;

  constructor(public payload: { profile: Profile }) {}
}

export class ClearFollowingProfile implements Action {
  readonly type = ArticleActionTypes.ClearFollowingProfile;
}

export type ArticleActions =
  | ArticleLoadSuccess
  | ArticleDeleteConfirmationRequest
  | ArticleDeleteConfirmation
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
  | ArticleCommentDeleteFail
  | SetFollowingProfile
  | ClearFollowingProfile;
