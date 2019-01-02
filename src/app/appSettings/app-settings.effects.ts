import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Router, ActivationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { TitleService } from '@app/core/services/title.service';
import { merge } from 'rxjs';
import { tap, filter } from 'rxjs/operators';


@Injectable()
export class AppSettingsEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<AppState>,
    private titleService: TitleService,
  ) { }

  @Effect({ dispatch: false })
  setTitle$ = merge(
    // this.actions$.pipe(ofType(SettingsActionTypes.CHANGE_LANGUAGE)),
    this.router.events.pipe(filter(event => event instanceof ActivationEnd))
  ).pipe(
    tap(() => {
      console.log('change');
      this.titleService.setTitle(
        this.router.routerState.snapshot.root,
        // this.translateService
      );
    })
  );
}
