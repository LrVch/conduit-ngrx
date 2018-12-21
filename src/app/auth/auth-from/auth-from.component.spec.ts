import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests, getUser } from '../../lib/testing';
import { AuthFromComponent } from './auth-from.component';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollService, DomUtilService } from 'src/app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { PasswordStrengthComponent, MaterialModule, AccentOnInvalidFromFieldDirective } from '../../shared';

describe('AuthFromComponent', () => {
    let component: AuthFromComponent;
    let fixture: ComponentFixture<AuthFromComponent>;
    let de: DebugElement;
    let user;

    beforeEach(
        async(() => {
            user = getUser();
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [AuthFromComponent, AccentOnInvalidFromFieldDirective, PasswordStrengthComponent],
                    imports: [FormsModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
                    providers: [ScrollService, DomUtilService]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(AuthFromComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                fixture.detectChanges();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should has "submitting" props', () => {
        expect(component.submitting).toBe(false);
    });

    describe('login form', () => {
        it('should create from with 2 controls', () => {
            const form = component.form;

            expect(form.contains('email')).toBeTruthy();
            expect(form.contains('password')).toBeTruthy();
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
    });

    describe('register form', () => {
        it('should create from with 3 controls', () => {
            component.authType = 'register';
            component.ngOnInit();

            const form = component.form;

            expect(form.contains('email')).toBeTruthy();
            expect(form.contains('password')).toBeTruthy();
            expect(form.contains('username')).toBeTruthy();
        });

        it('email control should be required', () => {
            component.authType = 'register';
            component.ngOnInit();

            const form = component.form;

            const email = form.get('email');

            expect(email.valid).toBeFalsy();
        });

        it('email control should be has email validator', () => {
            component.authType = 'register';
            component.ngOnInit();

            const form = component.form;

            const email = form.get('email');

            email.setValue('not real email');

            expect(email.valid).toBeFalsy();

            email.setValue('reale@email.ai');

            expect(email.valid).toBeTruthy();
        });

        it('password control should be required', () => {
            component.authType = 'register';
            component.ngOnInit();

            const form = component.form;

            const password = form.get('password');

            expect(password.valid).toBeFalsy();
        });

        it('password control should be at least 8 characters required', () => {
            component.authType = 'register';
            component.ngOnInit();

            const form = component.form;

            const password = form.get('password');

            password.setValue('1234567');

            expect(password.valid).toBeFalsy();

            password.setValue('12345678');

            expect(password.valid).toBeTruthy();
        });

        it('username control should be required', () => {
            component.authType = 'register';
            component.ngOnInit();

            const form = component.form;

            const username = form.get('username');

            expect(username.valid).toBeFalsy();
        });
    });

    it('should show error message', () => {
        component.form.get('password').setValue('');
        component.form.get('email').setValue('');

        component.submit();

        fixture.detectChanges();

        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should disable button', () => {
        component.isSubmitting = true;
        fixture.detectChanges();
        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should show password strength compenent if form type is register', () => {
        component.authType = 'register';
        component.ngOnInit();
        fixture.detectChanges();
        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should disable form', () => {
        component.isSubmitting = true;

        expect(component.form.status).toBe('DISABLED');
    });

    it('should raise "submitForm" when form valid on submit event and pass user data', () => {
        let email = '';
        let password = '';
        const expectedEmail = 'real@email.ai';
        const expectedPassword = '12345678';

        component.form.get('email').setValue(expectedEmail);
        component.form.get('password').setValue(expectedPassword);

        component.submitForm.subscribe(res => {
            email = res.credentials.email;
            password = res.credentials.password;
        });

        fixture.detectChanges();
        const formDe = de.query(By.css('form'));

        formDe.triggerEventHandler('ngSubmit', null);

        expect(email).toBe(expectedEmail);
        expect(password).toBe(expectedPassword);
    });

    it('shouldn\'t raise "submitComment" when form invalid', () => {
        let wasEmited = false;

        component.submitForm.subscribe(c => wasEmited = true);

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
});
