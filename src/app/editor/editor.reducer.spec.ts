import { editorReducer, initialState } from './editor.reducer';

describe('Editor Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = editorReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
