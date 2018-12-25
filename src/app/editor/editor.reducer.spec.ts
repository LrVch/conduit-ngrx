import * as fromEditor from './editor.reducer';
import {
  EditorArticleLoadSuccess,
  EditorArticleSaveSuccess,
  EditorArticleClear,
  EditorArticleSaveRequest,
  EditorArticleSaveFail,
  ClearEditorErrors
} from './editor.actions';
import { getArticle, getSomeErrors } from '../lib/testing';

describe('Editor Reducer', () => {

  describe('State changes', () => {
    const article = getArticle();
    const errors = getSomeErrors();
    const initialEditorState: fromEditor.EditorState = fromEditor.initialState;

    it('should have an initial state', () => {
      const state = fromEditor.editorReducer(initialEditorState, { type: '@@init' } as any);

      expect(state).toBe(initialEditorState);
    });

    it('should set article on "EditorArticleLoadSuccess" or "EditorArticleSaveSuccess"', () => {
      const init = { type: '@@init' } as any;
      const action1 = new EditorArticleLoadSuccess({ article });
      const action2 = new EditorArticleSaveSuccess({ article });

      const state1 = [init, action1].reduce(fromEditor.editorReducer, initialEditorState);
      const state2 = [init, action2].reduce(fromEditor.editorReducer, initialEditorState);

      expect(state1).toMatchSnapshot();
      expect(state2).toMatchSnapshot();
    });

    it('should remove article on "EditorArticleClear"', () => {
      const init = { type: '@@init' } as any;
      const action = new EditorArticleClear();

      const state = [init, action].reduce(fromEditor.editorReducer, initialEditorState);

      expect(state).toMatchSnapshot();
    });

    it('should set savingArticle as true on "EditorArticleSaveRequest"', () => {
      const init = { type: '@@init' } as any;
      const action = new EditorArticleSaveRequest({ article });

      const state = [init, action].reduce(fromEditor.editorReducer, initialEditorState);

      expect(state).toMatchSnapshot();
    });

    it('should set savingArticle as false on "EditorArticleSaveFail"', () => {
      const init = { type: '@@init' } as any;
      const action = new EditorArticleSaveFail({ article });

      const state = [init, action].reduce(fromEditor.editorReducer, initialEditorState);

      expect(state).toMatchSnapshot();
    });

    it('should set errors on "SetEditorErrors"', () => {
      const init = { type: '@@init' } as any;
      const action = new EditorArticleSaveFail({ errors });

      const state = [init, action].reduce(fromEditor.editorReducer, initialEditorState);

      expect(state).toMatchSnapshot();
    });

    it('should remove errors on "ClearEditorErrors"', () => {
      const init = { type: '@@init' } as any;
      const action = new ClearEditorErrors();

      const state = [init, action].reduce(fromEditor.editorReducer, initialEditorState);

      expect(state).toMatchSnapshot();
    });
  });
});
