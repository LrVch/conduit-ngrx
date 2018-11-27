import { articlesReducer, initialState } from './articles.reducer';

describe('Articles Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = articlesReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
