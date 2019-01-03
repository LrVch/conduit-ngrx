import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Credentials } from '@app/core/models/credentials.model';
import { BaseFromComponent } from '@app/shared';
import { Observable } from 'rxjs';

export interface AuthPayload {
  credentials: Credentials;
  authType: string;
}

@Component({
  selector: 'app-auth-from',
  templateUrl: './auth-from.component.html'
})

export class AuthFromComponent extends BaseFromComponent implements OnInit {
  @Input('authType') authType: string;
  @Output() submitForm = new EventEmitter<AuthPayload>();

  $passValue: Observable<string>;
  button: string;

  constructor(
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      'email': ['', [Validators.required, Validators.email]]
    });

    if (this.authType === 'register') {
      this.form.addControl('username', new FormControl('', Validators.required));
      this.form.addControl('password', new FormControl('', [Validators.required, Validators.minLength(8)]));
    } else {
      this.form.addControl('password', new FormControl('', [Validators.required]));
    }

    this.$passValue = this.passwordControl.valueChanges;

    this.button = this.authType === 'login' ? 'conduit.auth.sigin.button' : 'conduit.auth.sinup.button';
  }

  submit() {
    if (this.form.valid) {
      const authPayload: AuthPayload = {
        credentials: this.form.value,
        authType: this.authType
      };

      this.submitForm.emit(authPayload);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  get emailControl() {
    return this.form.get('email');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  get usernameControl() {
    return this.form.get('username');
  }

  get invalidEmail() {
    return this.emailControl.hasError('email') && !this.emailControl.hasError('required');
  }

  get requiredEmail() {
    return this.emailControl.hasError('required');
  }

  get requiredUsername() {
    return this.usernameControl.hasError('required');
  }

  get requiredPassword() {
    return this.passwordControl.hasError('required');
  }

  get minLengthPassword() {
    return this.passwordControl.hasError('minlength');
  }

  get minLengthPasswordCharsLength() {
    return {
      value: this.minLengthPassword && this.passwordControl.errors.minlength.requiredLength
    };
  }
}
