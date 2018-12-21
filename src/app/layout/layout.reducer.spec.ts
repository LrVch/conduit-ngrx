import * as fromLayout from './layout.reducer';
import { ShowMainLoader, HideMainLoader } from './layout.actions';

describe('Auth Reducer', () => {
  const initialAuthState: fromLayout.LayoutState = {
    showMainLoader: false
  };

  describe('State changes', () => {
    it('should have an initial state', () => {
      const state = fromLayout.layoutReducer(initialAuthState, { type: '@@init' } as any);

      expect(state).toBe(initialAuthState);
    });

    it('should show main loader', () => {
      const init = { type: '@@init' } as any;
      const loginSuccess = new ShowMainLoader();

      const state = [init, loginSuccess].reduce(fromLayout.layoutReducer, initialAuthState);

      (<any>expect(state)).toMatchSnapshot();
    });

    it('should hide main loader', () => {
      const init = { type: '@@init' } as any;
      const loginSuccess = new HideMainLoader();

      const state = [init, loginSuccess].reduce(fromLayout.layoutReducer, initialAuthState);

      (<any>expect(state)).toMatchSnapshot();
    });
  });
});
