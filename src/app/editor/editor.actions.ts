import { Action } from '@ngrx/store';
import { Article, Errors } from '@app/core';

export enum EditorActionTypes {
  EditorArticleLoadSuccess = '[Editor] Editor Article Load Success',
  EditorArticleLoadFail = '[Editor] Editor Article Load Fail',
  EditorArticleClear = '[Editor] Editor Article Clear',

  EditorArticleSaveRequest = '[Editor] Editor Article Save Request',
  EditorArticleSaveSuccess = '[Editor] Editor Article Save Success',
  EditorArticleSaveFail = '[Editor] Editor Article Save Fail',

  ClearEditorErrors = '[Editor] Clear Editor Errors',
  SetEditorErrors = '[Editor] Set Editor Errors'
}

export class EditorArticleLoadSuccess implements Action {
  readonly type = EditorActionTypes.EditorArticleLoadSuccess;

  constructor(public payload: { article: Article }) {}
}

export class EditorArticleClear implements Action {
  readonly type = EditorActionTypes.EditorArticleClear;
}

export class EditorArticleSaveRequest implements Action {
  readonly type = EditorActionTypes.EditorArticleSaveRequest;

  constructor(public payload: { article: Article }) {}
}

export class EditorArticleSaveSuccess implements Action {
  readonly type = EditorActionTypes.EditorArticleSaveSuccess;

  constructor(public payload: { article: Article }) {}
}

export class EditorArticleSaveFail implements Action {
  readonly type = EditorActionTypes.EditorArticleSaveFail;

  constructor(public payload: { errors: Errors }) {}
}

export class ClearEditorErrors implements Action {
  readonly type = EditorActionTypes.ClearEditorErrors;
}

export class SetEditorErrors implements Action {
  readonly type = EditorActionTypes.SetEditorErrors;

  constructor(public payload: { errors: Errors }) {}
}

export type EditorActions =
  | EditorArticleLoadSuccess
  | EditorArticleClear
  | EditorArticleSaveRequest
  | EditorArticleSaveSuccess
  | EditorArticleSaveFail
  | SetEditorErrors
  | ClearEditorErrors;
