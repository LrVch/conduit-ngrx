import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { map , tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { selectAuthLoggedIn } from './auth.selectors';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.store.pipe(
      select(selectAuthLoggedIn),
      map(isAuth => !isAuth),
      tap(
        isAuth => {
          if (!isAuth) {
            this.router.navigateByUrl('/');
          }
        }
    ));
  }
}
