import * as fromLayout from './layout.reducer';
import * as fromLayoutSelectors from './layout.selectors';
import { AppState } from '@app/reducers';

describe('Auth selectores', () => {
  const initialAuthState: fromLayout.LayoutState = {
    showMainLoader: false
  };

  const layoutState: fromLayout.LayoutState = initialAuthState;
  const appState: AppState = { layout: layoutState } as AppState;

  describe('selectShowMainLoader', () => {
    it('should return "showMainLoader" state)', () => {
      const result = fromLayoutSelectors.selectShowMainLoader(appState);

      expect(result).toBe(false);
    });

    it('should return "showMainLoader" state (projector)', () => {
      const result = fromLayoutSelectors.selectShowMainLoader.projector(
        layoutState
      );

      expect(result).toBe(false);
    });
  });
});
