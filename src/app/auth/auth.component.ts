import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Errors } from '../core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { LoginPageAttemptLogin, LoginPageClearAuthErrors } from './auth.actions';
import { Observable } from 'rxjs';
import { selectAuthLoading, selectAuthErrors } from './auth.selectors';
import { ShowMainLoader } from '../layout/layout.actions';
import { AuthPayload } from './auth-from/auth-from.component';
import { map, tap } from 'rxjs/operators';

@Component({
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  authType$: Observable<string>;
  title$: Observable<string>;
  authErrors$: Observable<Errors>;
  isSubmitting$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
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
