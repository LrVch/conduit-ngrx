import { Component, OnInit, OnDestroy, } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, ResolveEnd, NavigationStart } from '@angular/router';

import { Errors } from '../core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { LoginPageAttemptLogin, LoginPageClearAuthErrors, ClearReturnState } from './auth.actions';
import { Observable, Subject } from 'rxjs';
import { selectAuthLoading, selectAuthErrors } from './auth.selectors';
import { ShowMainLoader } from '../layout/layout.actions';
import { AuthPayload } from './auth-from/auth-from.component';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  authType$: Observable<string>;
  title$: Observable<string>;
  authErrors$: Observable<Errors>;
  isSubmitting$: Observable<boolean>;
  unsubscribe$ = new Subject<any>();

  BASE_LOGIN_URL = '/login';
  BASE_REGISTER_URL = '/register';

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.authType$ = this.route.url.pipe(
      map(data => data[data.length - 1].path)
    );

    this.title$ = this.authType$.pipe(
      map(authType => authType === 'login' ? 'Sign in' : 'Sign up')
    );

    this.isSubmitting$ = this.store.pipe(
      select(selectAuthLoading)
    );

    this.authErrors$ = this.store.pipe(
      select(selectAuthErrors)
    );

    this.store.dispatch(new LoginPageClearAuthErrors());

    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf(this.BASE_LOGIN_URL) !== -1 || event.url.indexOf(this.BASE_REGISTER_URL) !== -1) {
        } else {
          this.store.dispatch(new ClearReturnState());
        }
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  submitForm(authPayload: AuthPayload): void {
    const { credentials, authType } = authPayload;

    this.store.dispatch(new LoginPageAttemptLogin({
      authType: authType,
      credentials
    }));

    this.store.dispatch(new ShowMainLoader());
  }
}
