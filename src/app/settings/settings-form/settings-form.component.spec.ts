import {
  async,
  ComponentFixture,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { ConfigureFn, configureTests, getUser } from '@app/lib/testing';
import { SettingsFormComponent } from './settings-form.component';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollService, DomUtilService } from '@app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import {
  PasswordStrengthComponent,
  MaterialModule,
  AccentOnInvalidFromFieldDirective
} from '@app/shared';

describe('SettingsFormComponent', () => {
  let component: SettingsFormComponent;
  let fixture: ComponentFixture<SettingsFormComponent>;
  let de: DebugElement;
  let user;

  beforeEach(async(() => {
    user = getUser();
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          SettingsFormComponent,
          AccentOnInvalidFromFieldDirective,
          PasswordStrengthComponent
        ],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          MaterialModule,
          NoopAnimationsModule
        ],
        providers: [ScrollService, DomUtilService]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(SettingsFormComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "submitting" props', () => {
    expect(component.submitting).toBe(false);
  });

  it('should create from with 5 controls', () => {
    const form = component.form;

    expect(form.contains('image')).toBeTruthy();
    expect(form.contains('username')).toBeTruthy();
    expect(form.contains('bio')).toBeTruthy();
    expect(form.contains('email')).toBeTruthy();
    expect(form.contains('password')).toBeTruthy();
  });

  it('username control should be required', () => {
    const form = component.form;
    const username = form.get('username');

    expect(username.valid).toBeFalsy();
  });

  it('username control should be less than 20 characters', () => {
    const form = component.form;
    const username = form.get('username');

    username.setValue('1234568901234567890');

    expect(username.valid).toBeTruthy();

    username.setValue('12345689012345678901sdf');

    expect(username.valid).toBeFalsy();
  });

  it('email control should be required', () => {
    const form = component.form;
    const email = form.get('email');

    expect(email.valid).toBeFalsy();
  });

  it('email control should be has email validator', () => {
    const form = component.form;
    const email = form.get('email');

    email.setValue('not real email');

    expect(email.valid).toBeFalsy();

    email.setValue('reale@email.ai');

    expect(email.valid).toBeTruthy();
  });

  it('password control should be required', () => {
    const form = component.form;
    const password = form.get('password');

    expect(password.valid).toBeFalsy();
  });

  it('password control should be at least 8 characters required', () => {
    const form = component.form;

    const password = form.get('password');

    password.setValue('1234567');

    expect(password.valid).toBeFalsy();

    password.setValue('12345678');

    expect(password.valid).toBeTruthy();
  });

  it('should show error message', () => {
    component.form.get('password').setValue('');
    component.form.get('email').setValue('');
    component.form.get('username').setValue('');

    component.submit();

    fixture.detectChanges();

    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should disable button', () => {
    component.isSubmitting = true;
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should show password strength compenent', () => {
    component.ngOnInit();
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should disable form', () => {
    component.isSubmitting = true;

    expect(component.form.status).toBe('DISABLED');
  });

  it('should raise "updateUser" when form valid on submit event and pass user data', () => {
    let email = '';
    let username = '';
    let password = '';
    const expectedEmail = 'real@email.ai';
    const expectedPassword = '12345678';
    const expectedUsername = 'username';

    component.form.get('email').setValue(expectedEmail);
    component.form.get('password').setValue(expectedPassword);
    component.form.get('username').setValue(expectedUsername);

    component.updateUser.subscribe(res => {
      email = res.email;
      password = res.password;
      username = res.username;
    });

    fixture.detectChanges();
    const formDe = de.query(By.css('form'));

    formDe.triggerEventHandler('ngSubmit', null);

    expect(email).toBe(expectedEmail);
    expect(password).toBe(expectedPassword);
    expect(username).toBe(expectedUsername);
  });

  it('shouldn\'t raise "v" when form invalid', () => {
    let wasEmited = false;

    component.updateUser.subscribe(c => (wasEmited = true));

    fixture.detectChanges();
    const formDe = de.query(By.css('form'));

    formDe.triggerEventHandler('ngSubmit', null);

    expect(wasEmited).toBe(false);
  });

  it('should invoke validateAllFormFields method when form invalid', () => {
    const spy = jest.spyOn(component, 'validateAllFormFields');

    fixture.detectChanges();
    const formDe = de.query(By.css('form'));
    formDe.triggerEventHandler('ngSubmit', null);

    expect(spy).toHaveBeenCalled();
  });

  it('should raise "wasChanged" when form data changes', fakeAsync(() => {
    spyOn(component.wasChanged, 'emit');
    component.ngOnInit();

    component.form.get('email').setValue('email');

    tick(200);

    expect(component.wasChanged.emit).toHaveBeenCalledWith(true);

    component.form.get('email').setValue('');

    tick(200);

    expect(component.wasChanged.emit).toHaveBeenCalledWith(false);
  }));
});
