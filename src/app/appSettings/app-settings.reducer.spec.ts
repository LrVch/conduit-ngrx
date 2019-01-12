import * as fromAppSettings from './app-settings.reducer';
import * as AppSettingsActions from './app-settings.actions';
import { AppSettingsState } from '@app/core/models/app-settings.model';

describe('Article Reducer', () => {
  const initialAppSettingsState: AppSettingsState = {
    ...fromAppSettings.initialState,
    language: 'en'
  };

  describe('State changes', () => {
    it('should have an initial state', () => {
      const state = fromAppSettings.appSettingsReducer(
        initialAppSettingsState,
        {
          type: '@@init'
        } as any
      );

      expect(state).toBe(initialAppSettingsState);
    });

    it('should change language', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeLanguage({
        language: 'ru'
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change hour', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeHour({ hour: 23 });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change theme', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeTheme({
        theme: 'BLACK-THEME'
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change autoNightMode', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeAutoNightMode({
        autoNightMode: true
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change stickyHeader', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeStickyHeader({
        stickyHeader: false
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change asideOpenMode', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeAsideOpenMode({
        asideOpenMode: 'over'
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change nightModeFrom', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeNightModeFrom({
        nightModefrom: 17
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change nightModeTo', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeNightModeTo({
        nightModeto: 17
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change effectiveTheme', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsUpdateEffectiveTheme({
        effectiveTheme: 'BLACK-THEME'
      });

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change routeAnimationEnabled', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeRouteAnimationEnabled(
        { routeAnimationEnabled: false }
      );

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });

    it('should change routeAnimationsChangeType', () => {
      const init = { type: '@@init' } as any;
      const action = new AppSettingsActions.AppSettingsChangeRouteAnimationType(
        { routeAnimationsChangeType: 'FADE' }
      );

      const state = [init, action].reduce(
        fromAppSettings.appSettingsReducer,
        initialAppSettingsState
      );

      expect(state).toMatchSnapshot();
    });
  });
});
