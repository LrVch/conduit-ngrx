import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Credentials } from 'src/app/core/models/credentials.model';

export interface AuthPayload {
  credentials: Credentials;
  authType: string;
}

@Component({
  selector: 'app-auth-from',
  templateUrl: './auth-from.component.html'
})

export class AuthFromComponent implements OnInit {
  @Input('authType') authType: string;
  @Output() submitForm = new EventEmitter<AuthPayload>();
  @Input() set isSubmitting(isSubmitting: boolean) {
    this._isSubmitting = isSubmitting;
    this.toggleDisableFields(this.form, isSubmitting);
  }

  _isSubmitting: boolean;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });

    if (this.authType === 'register') {
      this.form.addControl('username', new FormControl('', Validators.required));
    }
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

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  toggleDisableFields(formGroup: FormGroup, disable: boolean): void {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (disable) {
          control.disable();
        } else {
          control.enable();
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
