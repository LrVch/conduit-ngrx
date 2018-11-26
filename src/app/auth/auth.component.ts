import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Errors } from '../core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { LoginPageAttemptLogin, LoginPageClearAuthErrors } from './auth.actions';
import { Observable } from 'rxjs';
import { selectAuthLoading, selectAuthErrors } from './auth.selectors';
import { ShowMainLoader } from '../layout/layout.actions';

@Component({
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  authType = '';
  title = '';
  authForm: FormGroup;
  // errors: Errors = { errors: {} };
  isSubmitting$: Observable<boolean>;
  authErrors$: Observable<Errors>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {

      this.authType = data[data.length - 1].path;
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';

      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl('', Validators.required));
      }
    });

    this.isSubmitting$ = this.store.pipe(
      select(selectAuthLoading)
    );

    this.authErrors$ = this.store.pipe(
      select(selectAuthErrors)
    );

    this.store.dispatch(new LoginPageClearAuthErrors());
  }

  submitForm() {
    const credentials = this.authForm.value;

    this.store.dispatch(new LoginPageAttemptLogin({
      authType: this.authType,
      credentials
    }));

    this.store.dispatch(new ShowMainLoader());
  }
}
