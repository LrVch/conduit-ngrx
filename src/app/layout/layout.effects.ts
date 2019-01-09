import { Injectable, NgZone } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { filter, tap } from 'rxjs/operators';
import {} from './layout.selectors';
import { ScrollService } from '@app/core';

@Injectable()
export class LayoutEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private ngZone: NgZone,
    private scrollService: ScrollService
  ) {}

  @Effect({ dispatch: false })
  scrollPageToTop$ = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .pipe(
      tap(() => {
        this.ngZone.runOutsideAngular(() => {
          this.scrollService.scrollMainContainerTo();
        });
      })
    );
}
