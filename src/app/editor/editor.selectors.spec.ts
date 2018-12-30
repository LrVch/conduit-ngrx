import * as fromEditor from './editor.reducer';
import * as fromEditorSelectors from './editor.selectors';
import { AppState } from '@app/reducers';

describe('Article selectores', () => {
  const initialEditorState: fromEditor.EditorState = fromEditor.initialState;
  const appState: AppState = { editor: initialEditorState } as AppState;

  describe('selectArticle', () => {
    it('should return "article" state)', () => {
      const result = fromEditorSelectors.selectArticle(appState);

      expect(result).toBeNull();
    });

    it('should return "article" state (projector)', () => {
      const result = fromEditorSelectors.selectArticle.projector(
        initialEditorState
      );

      expect(result).toBeNull();
    });
  });

  describe('selectArticleSaving', () => {
    it('should return "savingArticle" state)', () => {
      const result = fromEditorSelectors.selectArticleSaving(appState);

      expect(result).toBeFalsy();
    });

    it('should return "savingArticle" state (projector)', () => {
      const result = fromEditorSelectors.selectArticleSaving.projector(
        initialEditorState
      );

      expect(result).toBeFalsy();
    });
  });

  describe('selectEditorErrors', () => {
    it('should return "errors" state)', () => {
      const result = fromEditorSelectors.selectEditorErrors(appState);

      expect(result).toEqual({errors: {}});
    });

    it('should return "errors" state (projector)', () => {
      const result = fromEditorSelectors.selectEditorErrors.projector(
        initialEditorState
      );

      expect(result).toEqual({errors: {}});
    });
  });
});
