import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFromComponent } from 'src/app/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html'
})
export class SettingsFormComponent extends BaseFromComponent implements OnInit {
  @Input('disabled') disabled: boolean;
  @Input('user') user: User;
  @Output() updateUser = new EventEmitter<User>();

  $passValue: Observable<string>;

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      image: '',
      username: ['', [Validators.required, Validators.maxLength(20)]],
      bio: '',
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.form.patchValue(this.user);

    this.$passValue = this.passwordControl.valueChanges;
  }

  submit() {
    if (this.form.valid) {
      this.updateUser.emit(this.form.value);
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

  get maxLengthUsername() {
    return this.usernameControl.hasError('maxlength');
  }

  get minLengthPasswordCharsLength() {
    return this.minLengthPassword && this.passwordControl.errors.minlength.requiredLength;
  }

  get maxLengthUsernameCharsLength() {
    return this.maxLengthUsername && this.usernameControl.errors.maxlength.requiredLength;
  }
}
