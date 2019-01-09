import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { User } from '@app/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFromComponent, ValidatorStatus, CheckImageUrl } from '@app/shared';
import { Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  withLatestFrom,
  map,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html'
})
export class SettingsFormComponent extends BaseFromComponent
  implements OnInit, OnDestroy {
  @Input('disabled') disabled: boolean;
  @Input('user') user: User;
  @Output() updateUser = new EventEmitter<User>();
  @Output() wasChanged = new EventEmitter<boolean>();

  passValue$: Observable<string>;
  imageUrl$: Observable<string>;
  unsubscribe$ = new Subject<any>();

  initFormState$: Observable<User>;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      image: ['', null, [CheckImageUrl()]],
      username: ['', [Validators.required, Validators.maxLength(20)]],
      bio: '',
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    if (this.user) {
      this.form.patchValue(this.user);
    }

    this.passValue$ = this.passwordControl.valueChanges;
    this.imageUrl$ = this.imageControl.valueChanges.pipe(
      debounceTime(600),
      startWith(this.imageControl.value)
    );

    this.form.valueChanges
      .pipe(
        withLatestFrom(of(this.form.value)),
        debounceTime(200),
        map(
          ([form, initState]) =>
            JSON.stringify(form) === JSON.stringify(initState)
        ),
        startWith(true)
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        this.wasChanged.emit(!value);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  get imageControl() {
    return this.form.get('image');
  }

  get invalidEmail() {
    return (
      this.emailControl.hasError('email') &&
      !this.emailControl.hasError('required')
    );
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
    return {
      value:
        this.minLengthPassword &&
        this.passwordControl.errors.minlength.requiredLength
    };
  }

  get maxLengthUsernameCharsLength() {
    return {
      value:
        this.maxLengthUsername &&
        this.usernameControl.errors.maxlength.requiredLength
    };
  }

  get imageInvalidUrl() {
    return this.imageControl.hasError('invalidImageUrl');
  }
}
