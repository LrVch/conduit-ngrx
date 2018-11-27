import { profileReducer, initialState } from './profile.reducer';

describe('Profile Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = profileReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
