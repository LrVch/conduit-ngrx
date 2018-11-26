import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  CanLoad,
  Route
} from '@angular/router';
import { Observable, } from 'rxjs';

import { tap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAuthLoggedIn } from 'src/app/auth/auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.store.pipe(
      select(selectAuthLoggedIn),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

  canLoad(
    route: Route
  ): Observable<boolean> {

    return this.store.pipe(
      select(selectAuthLoggedIn),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigateByUrl('/login');
        }
      }),
      take(1)
    );
  }
}
