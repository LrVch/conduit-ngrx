import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { TitleService } from '@app/core/services/title.service';
import { merge, of, interval } from 'rxjs';
import {
  tap,
  filter,
  map,
  distinctUntilChanged,
  withLatestFrom,
  startWith
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  selectAppSettingsStateLanguage,
  selectAppSettingsStateLanguages,
  selectAppSettingsDefaultLanguage,
  selectAppSettingsStateAll,
  selectAppSettingsEffectiveTheme
} from './app-settings.selectors';
import { AppSettingsActionTypes, AppSettingsChangeLanguage, AppSettingsChangeHour } from './app-settings.actions';
import { Language } from '@app/core/models/app-settings.model';
import { LocalStorageService, SETTINGS_KEY } from '@app/core';
import { OverlayContainer } from '@angular/cdk/overlay';

const INIT = of('init-effect-trigger');


@Injectable()
export class AppSettingsEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<AppState>,
    private titleService: TitleService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private overlayContainer: OverlayContainer,
  ) { }

  @Effect()
  changeHour$ = interval(60_000).pipe(
    startWith(new Date().getHours()),
    map(() => new Date().getHours()),
    distinctUntilChanged(),
    map(hour => new AppSettingsChangeHour({ hour })),
  );

  @Effect({ dispatch: false })
  persistSettings$ = this.actions$.pipe(
    ofType(
      AppSettingsActionTypes.AppSettingsChangeLanguage,
      AppSettingsActionTypes.AppSettingsChangeTheme,
      AppSettingsActionTypes.AppSettingsChangeHour,
      AppSettingsActionTypes.AppSettingsChangeAutoNightMode,
      AppSettingsActionTypes.AppSettingsChangeStickyHeader,
      AppSettingsActionTypes.AppSettingsChangeAsideOpenMode,
    ),
    withLatestFrom(this.store.pipe(select(selectAppSettingsStateAll))),
    tap(([action, settings]) =>
      this.localStorageService.setItem(SETTINGS_KEY, settings)
    )
  );

  @Effect()
  setInitLanguage$ = this.store.pipe(select(selectAppSettingsDefaultLanguage)).pipe(
    withLatestFrom(this.store.pipe(select(selectAppSettingsStateLanguages)), this.store.pipe(select(selectAppSettingsStateLanguage))),
    map(([defaultLang, languages, currentLang]) => {
      const browserLang = this.translateService.getBrowserLang() as Language;
      return currentLang ? currentLang : languages.includes(browserLang) ? browserLang : defaultLang;
    }),
    map(lang => new AppSettingsChangeLanguage({ language: lang as Language }))
  );

  @Effect({ dispatch: false })
  setTranslateServiceLanguage$ = this.store.pipe(
    select(selectAppSettingsStateLanguage),
    distinctUntilChanged(),
    tap(language => this.translateService.use(language))
  );

  @Effect({ dispatch: false })
  setTitle$ = merge(
    this.actions$.pipe(ofType(AppSettingsActionTypes.AppSettingsChangeLanguage)),
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
  ).pipe(
    tap(() => {
      this.titleService.setTitle(
        this.router.routerState.snapshot.root,
        this.translateService
      );
    })
  );

  @Effect({ dispatch: false })
  updateTheme$ = merge(
    INIT,
    this.actions$.pipe(ofType(AppSettingsActionTypes.AppSettingsChangeTheme))
  ).pipe(
    withLatestFrom(this.store.pipe(select(selectAppSettingsEffectiveTheme))),
    tap(([action, effectiveTheme]) => {
      const classList = this.overlayContainer.getContainerElement().classList;
      const toRemove = Array.from(classList).filter((item: string) =>
        item.includes('-theme')
      );
      if (toRemove.length) {
        classList.remove(...toRemove);
      }
      classList.add(effectiveTheme);
    })
  );
}
