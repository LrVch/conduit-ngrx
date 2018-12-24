import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '../../lib/testing';

import { PasswordStrengthComponent } from './password-strength.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PasswordStrengthComponent', () => {
    let component: PasswordStrengthComponent;
    let fixture: ComponentFixture<PasswordStrengthComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const strength = {
        worst: '1234',
        bad: 'qswd',
        weak: 'qswdefr',
        good: 'qswdefrgt',
        strong: 'qswdefrgt_1'
    };

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [PasswordStrengthComponent]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(PasswordStrengthComponent);
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

    it('should set items to empty array and result to be undefined by "password" @Input', () => {
        component.password = '';
        fixture.detectChanges();

        expect(component.items).toEqual([]);
        expect(component.result).toBe(undefined);
    });

    it('should set 1 item to item\'s array and result to be "1" by "password" @Input', () => {
        component.password = strength.worst;
        fixture.detectChanges();

        expect(component.result).toBe(1);
        expect(component.items).toEqual(Array.from({ length: 1 }));
    });

    it('should set 2 item to item\'s array and result to be "2" by "password" @Input', () => {
        component.password = strength.bad;
        fixture.detectChanges();

        expect(component.result).toBe(2);
        expect(component.items).toEqual(Array.from({ length: 2 }));
    });

    it('should set 3 item to item\'s array and result to be "3" by "password" @Input', () => {
        component.password = strength.weak;
        fixture.detectChanges();

        expect(component.result).toBe(3);
        expect(component.items).toEqual(Array.from({ length: 3 }));
    });

    it('should set 4 item to item\'s array and result to be "4" by "password" @Input', () => {
        component.password = strength.good;
        fixture.detectChanges();

        expect(component.result).toBe(4);
        expect(component.items).toEqual(Array.from({ length: 4 }));
    });
    it('should set 5 item to item\'s array and result to be "5" by "password" @Input', () => {
        component.password = strength.strong;
        fixture.detectChanges();

        expect(component.result).toBe(5);
        expect(component.items).toEqual(Array.from({ length: 5 }));
    });

    it('shouldn\'t show any indicators', () => {
        component.password = '';
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show one indicators', () => {
        component.password = strength.worst;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show two indicators', () => {
        component.password = strength.bad;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show three indicators', () => {
        component.password = strength.weak;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show four indicators', () => {
        component.password = strength.good;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show five indicators', () => {
        component.password = strength.strong;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });
});

