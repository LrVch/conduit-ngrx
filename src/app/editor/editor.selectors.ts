import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { EditorState } from './editor.reducer';

export const selectEditorState = createFeatureSelector<AppState, EditorState>('editor');

export const selectArticle = createSelector(
  selectEditorState,
  (editorState: EditorState) => editorState.article
);

export const selectArticleSaving = createSelector(
  selectEditorState,
  (editorState: EditorState) => editorState.savingArticle
);

export const selectEditorErrors = createSelector(
  selectEditorState,
  (editorState: EditorState) => editorState.errors
);
