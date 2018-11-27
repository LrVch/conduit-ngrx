import { articleReducer, initialState } from './article.reducer';

describe('Article Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = articleReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
