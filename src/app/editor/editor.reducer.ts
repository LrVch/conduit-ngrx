import { Action } from '@ngrx/store';
import { Article, Errors } from '../core';
import { EditorActionTypes, EditorActions } from './editor.actions';


export interface EditorState {
  article: Article;
  savingArticle: boolean;
  errors: Errors;
}

export const initialState: EditorState = {
  article: null,
  savingArticle: false,
  errors: {
    errors: {}
  }
};

export function editorReducer(state = initialState, action: EditorActions): EditorState {
  switch (action.type) {

    case EditorActionTypes.EditorArticleLoadSuccess:
    case EditorActionTypes.EditorArticleSaveSuccess:
      return {
        ...state,
        article: action.payload.article,
        savingArticle: false,
        errors: {
          errors: {}
        }
      };

    case EditorActionTypes.EditorArticleClear:
      return {
        ...state,
        article: null
      };
    case EditorActionTypes.EditorArticleSaveRequest:
      return {
        ...state,
        savingArticle: true,
        errors: {
          errors: {}
        }
      };
    case EditorActionTypes.EditorArticleSaveFail:
      return {
        ...state,
        savingArticle: false,
        errors: { ...action.payload.errors }
      };
    case EditorActionTypes.SetEditorErrors:
      return {
        ...state,
        errors: { ...action.payload.errors }
      };
    case EditorActionTypes.ClearEditorErrors:
      return {
        ...state,
        errors: {
          errors: {}
        }
      };

    default:
      return state;
  }
}
