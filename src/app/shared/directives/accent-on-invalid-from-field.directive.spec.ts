import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '@app/lib/testing';
import { AccentOnInvalidFromFieldDirective } from './accent-on-invalid-from-field.directive';
import { DebugElement, Component, OnInit } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ScrollService } from '@app/core';


@Component({
    template: `
    <form [formGroup]="form"
        [appAccentOnInvalidFromField]="form">

        <input formControlName="email" type="text">

        <input formControlName="password" type="password">
    </form>
    `
})
class TestHostComponent implements OnInit {
    constructor(private fb: FormBuilder) { }

    form: FormGroup;

    ngOnInit() {
        this.form = this.fb.group({
            'email': ['', [Validators.required]],
            'password': ['', [Validators.required]]
        });
    }
}

describe('AccentOnInvalidFromFieldDirective', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let event;
    let scrollServiceSpy;

    beforeEach(
        async(() => {
            event = {
                prevented: false,
                preventDefault() {
                    this.prevented = true;
                }
            };
            const scrollServiceStub = {
                scrollToElem({ elem, offsetTop }) {
                    return Promise.resolve();
                }
            };

            scrollServiceSpy = jest.spyOn(scrollServiceStub, 'scrollToElem');

            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [TestHostComponent, AccentOnInvalidFromFieldDirective],
                    imports: [FormsModule, ReactiveFormsModule],
                    providers: [{ provide: ScrollService, useValue: scrollServiceStub }]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(TestHostComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                el = de.nativeElement;
                fixture.detectChanges();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should prevent from submition', () => {
        fixture.detectChanges();

        const form = de.query(By.css('form'));
        form.triggerEventHandler('submit', event);

        expect(event.prevented).toBe(true);
    });

    it('shouldn\'t call scrollService crollToElem method if form valid', () => {
        fixture.detectChanges();
        const form = component.form;

        form.get('email').setValue('email@mail.com');
        form.get('password').setValue('123412341234');

        const formDe = de.query(By.css('form'));
        formDe.triggerEventHandler('submit', event);

        expect(scrollServiceSpy).not.toHaveBeenCalled();
    });

    it('should call scrollService scrollToElem method with params if form invalid and set focus on first input element', fakeAsync(() => {
        fixture.detectChanges();

        const formDe = de.query(By.css('form'));
        const inputDe = formDe.query(By.css('input'));
        const focusSpy = jest.spyOn(inputDe.nativeElement, 'focus');

        formDe.triggerEventHandler('submit', event);

        expect(scrollServiceSpy).toHaveBeenCalledWith({
            elem: inputDe.nativeElement,
            offsetTop: 140
        });

        expect(scrollServiceSpy).toHaveBeenCalledTimes(1);

        tick();

        fixture.detectChanges();

        expect(focusSpy).toHaveBeenCalled();
    }));
});

