import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '@app/lib/testing';
import { FooterComponent } from './footer.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { RouterLinkDirectiveStubDirective } from '@app/lib/testing/directive/router-link-directive-stub';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let de: DebugElement;
    let linkDes;
    let routerLinks;

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [
                        FooterComponent,
                        RouterLinkDirectiveStubDirective
                    ],
                    imports: [MaterialModule]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(FooterComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                fixture.detectChanges();
                linkDes = de.queryAll(By.directive(RouterLinkDirectiveStubDirective));
                routerLinks = linkDes.map(deel => deel.injector.get(RouterLinkDirectiveStubDirective));
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should compile', () => {
        expect(fixture).toMatchSnapshot();
    });

    it('can get RouterLinks from template', () => {
        fixture.detectChanges();

        expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
        expect(routerLinks[0].linkParams).toEqual('/');
    });

    it('can click Heroes link in template', () => {
        const goToDe = linkDes[0];
        const goToLink = routerLinks[0];

        expect(goToLink.navigatedTo).toBeNull();

        fixture.detectChanges();
        goToDe.triggerEventHandler('click', null);

        expect(goToLink.navigatedTo).toEqual('/');
    });
});

