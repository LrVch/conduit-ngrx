import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { Mock, provideMagicalMock } from 'angular-testing-library';

import {
  LocalStorageService,
  AnimationsService,
  SETTINGS_KEY
} from '@app/core';

import { AppSettingsEffects } from './app-settings.effects';
import * as fromRoot from '@app/reducers';
import * as fromAppSettings from './app-settings.reducer';
import * as AppSettingsActions from './app-settings.actions';
import { Store, StoreModule, combineReducers, Action } from '@ngrx/store';
import { AppSettingsState } from '@app/core/models/app-settings.model';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { TitleService } from '@app/core/services/title.service';
import { TranslateService } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('AppSettingsEffects', () => {
  let actions$: Observable<any>;
  let effects: AppSettingsEffects;
  let store: Store<AppSettingsState>;
  let router: Router;
  let titleService: Mock<TitleService>;
  let translateService: Mock<TranslateService>;
  let localStorageService: Mock<LocalStorageService>;
  let overlayContainer: Mock<OverlayContainer>;
  let animationsService: Mock<AnimationsService>;

  class MockRouter {
    events$ = new Subject<any>();
    events = this.events$.asObservable();
    routerState = {
      snapshot: {
        root: {}
      }
    };
  }

  class MocktranslateService {
    getBrowserLang = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromAppSettings.appSettingsReducer)
        })
      ],
      providers: [
        AppSettingsEffects,
        provideMockActions(() => actions$),
        { provide: Router, useClass: MockRouter },
        provideMagicalMock(TranslateService),
        provideMagicalMock(TitleService),
        provideMagicalMock(LocalStorageService),
        provideMagicalMock(OverlayContainer),
        provideMagicalMock(AnimationsService)
      ]
    });

    effects = TestBed.get(AppSettingsEffects);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    titleService = TestBed.get(TitleService);
    translateService = TestBed.get(TranslateService);
    localStorageService = TestBed.get(LocalStorageService);
    overlayContainer = TestBed.get(OverlayContainer);
    animationsService = TestBed.get(AnimationsService);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
    titleService.setTitle.and.stub();
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('changeHour$', () => {
    it('should return "AppSettingsChangeHour" on time change hour', fakeAsync(() => {
      let action: AppSettingsActions.AppSettingsChangeHour;
      const time = 20;
      let count = time;

      const sub = effects.changeHour$.subscribe(
        (AppSettingsChangeHour: AppSettingsActions.AppSettingsChangeHour) => {
          AppSettingsChangeHour.payload.hour = count;
          action = AppSettingsChangeHour;
          count++;
        }
      );

      tick(60000);
      expect(action).toEqual(
        new AppSettingsActions.AppSettingsChangeHour({ hour: time + 1 })
      );

      tick(119999);
      expect(action).toEqual(
        new AppSettingsActions.AppSettingsChangeHour({ hour: time + 2 })
      );

      sub.unsubscribe();
    }));
  });

  describe('setInitLanguage$', () => {
    it('should eavaluate "en" as initial language and return "AppSettingsChangeLanguage"', done => {
      translateService.getBrowserLang.and.returnValue('fr');

      effects.setInitLanguage$.subscribe(
        res => {
          expect(res).toEqual(
            new AppSettingsActions.AppSettingsChangeLanguage({ language: 'en' })
          );
          done();
        },
        done,
        done
      );
    });

    it('should eavaluate "en" as initial language and return "AppSettingsChangeLanguage"', done => {
      translateService.getBrowserLang.and.returnValue('');

      effects.setInitLanguage$.subscribe(
        res => {
          expect(res).toEqual(
            new AppSettingsActions.AppSettingsChangeLanguage({ language: 'en' })
          );
          done();
        },
        done,
        done
      );
    });

    it('should eavaluate "ru" as initial language and return "AppSettingsChangeLanguage"', done => {
      translateService.getBrowserLang.and.returnValue('ru');

      effects.setInitLanguage$.subscribe(
        res => {
          expect(res).toEqual(
            new AppSettingsActions.AppSettingsChangeLanguage({ language: 'ru' })
          );
          done();
        },
        done,
        done
      );
    });

    it('should eavaluate "ru" as initial language and return "AppSettingsChangeLanguage"', done => {
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeLanguage({ language: 'ru' })
      );
      translateService.getBrowserLang.and.returnValue('');

      effects.setInitLanguage$.subscribe(
        res => {
          expect(res).toEqual(
            new AppSettingsActions.AppSettingsChangeLanguage({ language: 'ru' })
          );
          done();
        },
        done,
        done
      );
    });
  });

  describe('persistSettings$', () => {
    it('should set settings to localstorage on "AppSettingsChangeLanguage"', () => {
      const action = new AppSettingsActions.AppSettingsChangeLanguage({
        language: 'ru'
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeTheme"', () => {
      const action = new AppSettingsActions.AppSettingsChangeTheme({
        theme: 'BLACK-THEME'
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeHour"', () => {
      const action = new AppSettingsActions.AppSettingsChangeHour({ hour: 20 });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeAutoNightMode"', () => {
      const action = new AppSettingsActions.AppSettingsChangeAutoNightMode({
        autoNightMode: true
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeStickyHeader"', () => {
      const action = new AppSettingsActions.AppSettingsChangeStickyHeader({
        stickyHeader: false
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeAsideOpenMode"', () => {
      const action = new AppSettingsActions.AppSettingsChangeAsideOpenMode({
        asideOpenMode: 'push'
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeNightModeFrom"', () => {
      const action = new AppSettingsActions.AppSettingsChangeNightModeFrom({
        nightModefrom: 20
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeNightModeTo"', () => {
      const action = new AppSettingsActions.AppSettingsChangeNightModeTo({
        nightModeto: 30
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsUpdateEffectiveTheme"', () => {
      const action = new AppSettingsActions.AppSettingsUpdateEffectiveTheme({
        effectiveTheme: 'black-theme'
      });

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeRouteAnimationEnabled"', () => {
      const action = new AppSettingsActions.AppSettingsChangeRouteAnimationEnabled(
        { routeAnimationEnabled: false }
      );

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
    it('should set settings to localstorage on "AppSettingsChangeRouteAnimationType"', () => {
      const action = new AppSettingsActions.AppSettingsChangeRouteAnimationType(
        { routeAnimationsChangeType: 'FADE' }
      );

      actions$ = of(action);

      effects.persistSettings$.subscribe();

      expect(localStorageService.setItem).toHaveBeenCalledWith(
        SETTINGS_KEY,
        fromAppSettings.initialState
      );
    });
  });

  describe('setInitLanguage$', () => {
    it('should set current language', done => {
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeLanguage({ language: 'ru' })
      );
      effects.setTranslateServiceLanguage$.subscribe(
        res => {
          expect(translateService.use).toHaveBeenCalledWith('ru');
          done();
        },
        done,
        done
      );
    });
  });

  describe('setTitle$', () => {
    it('should set title on "AppSettingsChangeLanguage"', () => {
      const action = new AppSettingsActions.AppSettingsChangeLanguage({
        language: 'ru'
      });

      actions$ = of(action);

      effects.setTitle$.subscribe();

      expect(titleService.setTitle).toHaveBeenCalledWith({}, translateService);
    });

    it('should set title on route change', () => {
      (<any>router).events$.next(new NavigationEnd(0, 'login', ''));

      effects.setTitle$.subscribe();

      expect(titleService.setTitle).toHaveBeenCalledWith({}, translateService);
    });
  });

  describe('updateTheme$', () => {
    it('should update theme on "overlayContainer" on "AppSettingsChangeTheme"', () => {
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeTheme({ theme: 'BLACK-THEME' })
      );
      const action = new AppSettingsActions.AppSettingsChangeTheme({
        theme: 'BLACK-THEME'
      });
      const state = {
        classList: {
          add() {}
        }
      };
      const classList = state.classList;
      spyOn(classList, 'add');
      overlayContainer.getContainerElement.and.returnValue(state);

      actions$ = of(action);

      effects.updateTheme$.subscribe();

      expect(overlayContainer.getContainerElement).toHaveBeenCalled();
      expect(classList.add).toHaveBeenCalledWith('black-theme');
    });

    it('should update theme on "overlayContainer" on "AppSettingsChangeTheme"', () => {
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeTheme({ theme: 'BLACK-THEME' })
      );
      const action = new AppSettingsActions.AppSettingsChangeAutoNightMode({
        autoNightMode: false
      });
      const state = {
        classList: {
          add() {}
        }
      };
      const classList = state.classList;
      spyOn(classList, 'add');
      overlayContainer.getContainerElement.and.returnValue(state);

      actions$ = of(action);

      effects.updateTheme$.subscribe();

      expect(overlayContainer.getContainerElement).toHaveBeenCalled();
      expect(classList.add).toHaveBeenCalledWith('black-theme');
    });

    it('should update theme on "overlayContainer" on initialization', () => {
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeTheme({ theme: 'BLACK-THEME' })
      );
      const state = {
        classList: {
          add() {}
        }
      };
      const classList = state.classList;
      spyOn(classList, 'add');
      overlayContainer.getContainerElement.and.returnValue(state);

      actions$ = of('init-effect-trigger');

      effects.updateTheme$.subscribe();

      expect(overlayContainer.getContainerElement).toHaveBeenCalled();
      expect(classList.add).toHaveBeenCalledWith('black-theme');
    });
  });

  describe('updateEffectiveTheme$', () => {
    it('should return "AppSettingsUpdateEffectiveTheme"', () => {
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeAutoNightMode({
          autoNightMode: true
        })
      );
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeHour({ hour: 21 })
      );
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeNightModeTo({
          nightModeto: 17.0
        })
      );
      store.dispatch(
        new AppSettingsActions.AppSettingsChangeNightModeFrom({
          nightModefrom: 18.0
        })
      );
      const result = new AppSettingsActions.AppSettingsUpdateEffectiveTheme({
        effectiveTheme: 'black-theme'
      });
      const expected = cold('a', { a: result });

      expect(effects.updateEffectiveTheme$).toBeObservable(expected);
    });
  });

  describe('updateRouteAnimationType$', () => {
    it('should call updateRouteAnimationChangeType on animationsService on "AppSettingsChangeRouteAnimationType"', () => {
      const action = new AppSettingsActions.AppSettingsChangeRouteAnimationType(
        { routeAnimationsChangeType: 'SLIDE' }
      );

      actions$ = of(action);

      effects.updateRouteAnimationType$.subscribe();

      expect(
        animationsService.updateRouteAnimationChangeType
      ).toHaveBeenCalledWith('SLIDE');
    });

    it('should call updateRouteAnimationChangeType on animationsService on initialization', () => {
      actions$ = of('init-effect-trigger');

      effects.updateRouteAnimationType$.subscribe();

      expect(
        animationsService.updateRouteAnimationChangeType
      ).toHaveBeenCalledWith('SLIDE');
    });
  });

  describe('updateRouteAnimationEnabled$', () => {
    it('should call toggleRouteAnimation on animationsService on "AppSettingsChangeRouteAnimationEnabled"', () => {
      const action = new AppSettingsActions.AppSettingsChangeRouteAnimationEnabled(
        { routeAnimationEnabled: true }
      );

      actions$ = of(action);

      effects.updateRouteAnimationEnabled$.subscribe();

      expect(animationsService.toggleRouteAnimation).toHaveBeenCalledWith(true);
    });

    it('should call toggleRouteAnimation on animationsService on initialization', () => {
      actions$ = of('init-effect-trigger');

      effects.updateRouteAnimationEnabled$.subscribe();

      expect(animationsService.toggleRouteAnimation).toHaveBeenCalledWith(true);
    });
  });
});
