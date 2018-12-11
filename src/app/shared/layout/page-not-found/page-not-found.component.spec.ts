import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '../../../lib/testing';

import { PageNotFoundComponent } from './page-not-found.component';
import { DebugElement } from '@angular/core';

describe('PageNotFoundComponent', () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [PageNotFoundComponent]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(PageNotFoundComponent);
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

    it('should compile', () => {
        expect(fixture).toMatchSnapshot();
    });
});

