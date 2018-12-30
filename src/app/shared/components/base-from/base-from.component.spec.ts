import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { BaseFromComponent } from './base-from.component';
import { Component, OnInit, DebugElement } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';

@Component({
    template: `
        <form [formGroup]="form">
            <input formControlName="email" type="text">
            <input formControlName="password" type="password">
            <div formGroupName="user">
                <input formControlName="username" type="text">
            </div>
        </form>
    `
})
class TestHostComponent extends BaseFromComponent implements OnInit {
    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.form = this.fb.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]],
            'user': this.fb.group({
                'username': ['', [Validators.required]]
            })
        });
    }
}

describe('TagsComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [TestHostComponent],
                    imports: [FormsModule, ReactiveFormsModule],
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(TestHostComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                fixture.detectChanges();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create from with 3 controls', () => {
        const form = component.form;

        expect(form.contains('email')).toBeTruthy();
        expect(form.contains('password')).toBeTruthy();
        expect((form.get('user') as FormGroup).contains('username')).toBeTruthy();
    });

    it('all the controls should be required', () => {
        const form = component.form;
        const email = form.get('email');
        const password = form.get('password');
        const username = form.get('user').get('username');

        expect(email.valid).toBeFalsy();
        expect(password.valid).toBeFalsy();
        expect(username.valid).toBeFalsy();
    });

    it('should has submitting props', () => {
        expect(component.submitting).toBe(false);
    });

    it('should has validate all fiels by method validateAllFormFields', () => {
        const form = component.form;
        const email = form.get('email');
        const password = form.get('password');
        const username = form.get('user').get('username');

        email.setValue('abc@abc.com');

        component.validateAllFormFields(form);

        expect(form.valid).toBe(false);
        expect(email.valid).toBe(true);
        expect(password.valid).toBe(false);
        expect(username.valid).toBe(false);

        password.setValue('abc');
        username.setValue('abc');

        component.validateAllFormFields(form);

        expect(form.valid).toBe(true);
        expect(email.valid).toBe(true);
        expect(password.valid).toBe(true);
        expect(username.valid).toBe(true);
    });

    it('should disable all fields via "@Input" isSubmitting', () => {
        const form = component.form;
        const email = form.get('email');
        const password = form.get('password');
        const username = form.get('user').get('username');

        component.isSubmitting = true;

        expect(form.status).toBe('DISABLED');
        expect(email.status).toBe('DISABLED');
        expect(password.status).toBe('DISABLED');
        expect(username.status).toBe('DISABLED');
    });
});
