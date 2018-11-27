import { layoutReducer, initialState } from './layout.reducer';

describe('Layout Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = layoutReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
