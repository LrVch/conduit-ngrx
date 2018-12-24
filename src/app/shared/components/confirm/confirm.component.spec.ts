import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '../../../lib/testing';

import { ConfirmComponent } from './confirm.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

describe('ConfirmComponent', () => {
    let component: ConfirmComponent;
    let fixture: ComponentFixture<ConfirmComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let dialogRefSpy;
    let data;

    beforeEach(
        async(() => {
            data = {
                question: 'How do you do?'
            };
            const dialogRefStub = {
                close() { }
            };
            dialogRefSpy = jest.spyOn(dialogRefStub, 'close');
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [ConfirmComponent],
                    imports: [MaterialModule],
                    providers: [{ provide: MatDialogRef, useValue: dialogRefStub }, { provide: MAT_DIALOG_DATA, useValue: data }]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(ConfirmComponent);
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

    it('should has question property is set to received data', () => {
        expect(component.question).toEqual(data.question);
    });

    it('should show question', () => {
        expect(fixture).toMatchSnapshot();

        component.question = 'Are you a web developer?';
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should close dialog when (onNoClick) clicked', () => {
        const buttonDe = de.query(By.css('button'));

        buttonDe.triggerEventHandler('click', null);

        expect(dialogRefSpy).toHaveBeenCalled();
        expect(dialogRefSpy).toHaveBeenCalledTimes(1);
    });

});

