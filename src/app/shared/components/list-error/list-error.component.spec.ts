import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { ListErrorComponent } from './list-error.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

describe('ListErrorComponent', () => {
    let component: ListErrorComponent;
    let fixture: ComponentFixture<ListErrorComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let errors;

    beforeEach(
        async(() => {

            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [ListErrorComponent]
                }).overrideComponent(ListErrorComponent, {
                    set: { changeDetection: ChangeDetectionStrategy.Default },
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(ListErrorComponent);
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

    it('should show "errors" @Input', () => {
        errors = { errors: { body: ['some body error1', 'some body error2'], username: ['some username error'] } };
        component.errors = errors;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        errors = {};
        component.errors = errors;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        errors = { errors: { body: ['some body error1', 'some body error2'] }};
        component.errors = errors;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should transrorm "errors" @Input', () => {
        errors = { errors: { body: ['some body error1', 'some body error2'], username: ['some username error'] } };
        component.errors = errors;
        fixture.detectChanges();
        expect(component.errorList).toEqual([
            'body some body error1,some body error2',
            'username some username error'
        ]);
    });
});
