import * as fromSettings from './app-settings.reducer';
import * as fromSettingsSelectors from './app-settings.selectors';
import { AppState } from '@app/reducers';
import { AppSettingsState } from '@app/core/models/app-settings.model';

describe('Article selectores', () => {
  const initialArticleState: AppSettingsState = fromSettings.initialState;

  const settingsState: AppSettingsState = {
    ...initialArticleState,
    autoNightMode: true,
    language: 'en'
  };
  const appState: AppState = { appSettings: settingsState } as AppState;

  describe('selectAppSettingsStateAll', () => {
    it('should return "settingsState" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStateAll(appState);

      expect(result).toEqual(settingsState);
    });

    it('should return "settingsState" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStateAll.projector(
        settingsState
      );

      expect(result).toEqual(settingsState);
    });
  });

  describe('selectAppSettingsTheme', () => {
    it('should return "settingsState.theme" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsTheme(appState);

      expect(result).toEqual('DEFAULT-THEME');
    });

    it('should return "settingsState.theme" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsTheme.projector(
        settingsState
      );

      expect(result).toEqual('DEFAULT-THEME');
    });
  });

  describe('selectAppSettingsThemes', () => {
    it('should return "settingsState.themes" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsThemes(appState);

      expect(result).toEqual(settingsState.themes);
    });

    it('should return "settingsState.themes" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsThemes.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.themes);
    });
  });

  describe('selectAppSettingsAutoNightMode', () => {
    it('should return "settingsState.autoNightMode" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsAutoNightMode(
        appState
      );

      expect(result).toEqual(true);
    });

    it('should return "settingsState.autoNightMode" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsAutoNightMode.projector(
        settingsState
      );

      expect(result).toEqual(true);
    });
  });

  describe('selectAppSettingsNightTheme', () => {
    it('should return "settingsState.nightTheme" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsNightTheme(
        appState
      );

      expect(result).toEqual('BLACK-THEME');
    });

    it('should return "settingsState.nightTheme" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsNightTheme.projector(
        settingsState
      );

      expect(result).toEqual('BLACK-THEME');
    });
  });

  describe('selectAppSettingsHour', () => {
    it('should return "settingsState.hour" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsHour(appState);

      expect(result).toEqual(0);
    });

    it('should return "settingsState.hour" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsHour.projector(
        settingsState
      );

      expect(result).toEqual(0);
    });
  });

  describe('selectAppSettingsNightModeTo', () => {
    it('should return "settingsState.nightModeto" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsNightModeTo(
        appState
      );

      expect(result).toEqual(7);
    });

    it('should return "settingsState.nightModeto" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsNightModeTo.projector(
        settingsState
      );

      expect(result).toEqual(7);
    });
  });

  describe('selectAppSettingsNightModeFrom', () => {
    it('should return "settingsState.nightModefrom" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsNightModeFrom(
        appState
      );

      expect(result).toEqual(21);
    });

    it('should return "settingsState.nightModefrom" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsNightModeFrom.projector(
        settingsState
      );

      expect(result).toEqual(21);
    });
  });

  describe('selectAppSettingsIsNightHour', () => {
    it('should return "true of false" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsIsNightHour(
        appState
      );

      expect(result).toEqual(true);
    });

    it('should return "true of false" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsIsNightHour.projector(
        fromSettingsSelectors.selectAppSettingsAutoNightMode,
        fromSettingsSelectors.selectAppSettingsHour,
        fromSettingsSelectors.selectAppSettingsNightModeFrom,
        fromSettingsSelectors.selectAppSettingsNightModeTo
      );

      expect(result).toEqual(true);
    });
  });

  describe('selectAppSettingsStateLanguage', () => {
    it('should return "settingsState.language" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStateLanguage(
        appState
      );

      expect(result).toEqual('en');
    });

    it('should return "settingsState.language" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStateLanguage.projector(
        settingsState
      );

      expect(result).toEqual('en');
    });
  });

  describe('selectAppSettingsDefaultLanguage', () => {
    it('should return "settingsState.defaultLanguage" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsDefaultLanguage(
        appState
      );

      expect(result).toEqual('en');
    });

    it('should return "settingsState.defaultLanguage" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsDefaultLanguage.projector(
        settingsState
      );

      expect(result).toEqual('en');
    });
  });

  describe('selectAppSettingsStateLanguages', () => {
    it('should return "settingsState.languages" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStateLanguages(
        appState
      );

      expect(result).toEqual(settingsState.languages);
    });

    it('should return "settingsState.languages" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStateLanguages.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.languages);
    });
  });

  describe('selectAppSettingsEffectiveTheme', () => {
    it('should return "effective theme" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsEffectiveTheme(
        appState
      );

      expect(result).toEqual('black-theme');
    });

    it('should return "effective theme" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsEffectiveTheme.projector(
        fromSettingsSelectors.selectAppSettingsTheme(appState),
        fromSettingsSelectors.selectAppSettingsNightTheme(appState),
        fromSettingsSelectors.selectAppSettingsIsNightHour(appState)
      );

      expect(result).toEqual('black-theme');
    });
  });

  describe('selectAppSettingsStickyHeader', () => {
    it('should return "settingsState.stickyHeader" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStickyHeader(
        appState
      );

      expect(result).toEqual(settingsState.stickyHeader);
    });

    it('should return "settingsState.stickyHeader" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsStickyHeader.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.stickyHeader);
    });
  });

  describe('selectAppSettingsAsideOpenMode', () => {
    it('should return "settingsState.asideOpenMode" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsAsideOpenMode(
        appState
      );

      expect(result).toEqual(settingsState.asideOpenMode);
    });

    it('should return "settingsState.asideOpenMode" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsAsideOpenMode.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.asideOpenMode);
    });
  });

  describe('selectAppSettingsAsideOpenModes', () => {
    it('should return "settingsState.asideOpenModes" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsAsideOpenModes(
        appState
      );

      expect(result).toEqual(settingsState.asideOpenModes);
    });

    it('should return "settingsState.asideOpenModes" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsAsideOpenModes.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.asideOpenModes);
    });
  });

  describe('selectAppSettingsRouteAnimationChangeType', () => {
    it('should return "settingsState.routeAnimationsChangeType" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsRouteAnimationChangeType(
        appState
      );

      expect(result).toEqual(settingsState.routeAnimationsChangeType);
    });

    it('should return "settingsState.routeAnimationsChangeType" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsRouteAnimationChangeType.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.routeAnimationsChangeType);
    });
  });

  describe('selectAppSettingsRouteAnimationChangeTypes', () => {
    it('should return "settingsState.routeAnimationsChangeTypes" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsRouteAnimationChangeTypes(
        appState
      );

      expect(result).toEqual(settingsState.routeAnimationsChangeTypes);
    });

    it('should return "settingsState.routeAnimationsChangeTypes" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsRouteAnimationChangeTypes.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.routeAnimationsChangeTypes);
    });
  });

  describe('selectAppSettingsRouteAnimationChangeEnabled', () => {
    it('should return "settingsState.routeAnimationEnabled" state)', () => {
      const result = fromSettingsSelectors.selectAppSettingsRouteAnimationChangeEnabled(
        appState
      );

      expect(result).toEqual(settingsState.routeAnimationEnabled);
    });

    it('should return "settingsState.routeAnimationEnabled" state (projector)', () => {
      const result = fromSettingsSelectors.selectAppSettingsRouteAnimationChangeEnabled.projector(
        settingsState
      );

      expect(result).toEqual(settingsState.routeAnimationEnabled);
    });
  });
});
