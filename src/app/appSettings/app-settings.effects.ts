import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { TitleService } from '@app/core/services/title.service';
import { merge } from 'rxjs';
import { tap, filter, map, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { selectAppSettingsStateLanguage } from './app-settings.selectors';
import { AppSettingsActionTypes } from './app-settings.actions';


@Injectable()
export class AppSettingsEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<AppState>,
    private titleService: TitleService,
    private translateService: TranslateService
  ) { }

  @Effect({ dispatch: false })
  setTranslateServiceLanguage = this.store.pipe(
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
}
