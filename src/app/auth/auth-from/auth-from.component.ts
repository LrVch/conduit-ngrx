import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Credentials } from 'src/app/core/models/credentials.model';
import { BaseFromComponent } from 'src/app/shared';

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

  constructor(
    private fb: FormBuilder,
  ) {
    super();
   }

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
}
