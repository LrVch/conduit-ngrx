import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ConfigureFn, configureTests, getUser, click } from '@app/lib/testing';
import { HeaderComponent } from './header.component';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { RouterLinkDirectiveStubDirective } from '@app/lib/testing/directive/router-link-directive-stub';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '@app/core';
import { Routes, Router } from '@angular/router';


@Component({
    template: ``
})
class HomeComponent { }

@Component({
    template: ``
})
class LoginComponent { }

@Component({
    template: ``
})
class EditorComponent { }

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let linkDes;
    let routerLinks;
    let user: User;
    let router: Router;

    const routes: Routes = [
        {
            path: '', component: HomeComponent
        },
        {
            path: 'login', component: LoginComponent
        },
        {
            path: 'editor', component: EditorComponent
        }
    ];

    beforeEach(
        async(() => {
            user = getUser();
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [
                        HeaderComponent,
                        RouterLinkDirectiveStubDirective,
                        HomeComponent,
                        LoginComponent,
                        EditorComponent
                    ],
                    imports: [MaterialModule, RouterTestingModule.withRoutes(routes)],
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(HeaderComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                el = de.nativeElement;
                router = testBed.get(Router);
                fixture.detectChanges();
                linkDes = de.queryAll(By.directive(RouterLinkDirectiveStubDirective));
                routerLinks = linkDes.map(deel => deel.injector.get(RouterLinkDirectiveStubDirective));
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should has "showLoader" @Input', () => {
        expect(component.showLoader).toBe(false);
    });

    it('should has "loggedIn" @Input', () => {
        expect(component.loggedIn).toBe(false);
    });

    it('should has "user" @Input', () => {
        expect(component.user).toEqual({});
    });

    it('should show "user" @Input', () => {
        component.user = user;
        component.loggedIn = true;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show showLoader by "showLoader" @Input', () => {
        component.showLoader = true;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show header for logged in user by "loggedIn" @Input equals to true', () => {
        component.user = user;
        component.loggedIn = true;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('should show header for unknown user by "loggedIn" @Input equals to false', () => {
        component.loggedIn = false;
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });

    it('can get RouterLinks from template if there is no user', () => {
        component.loggedIn = false;
        fixture.detectChanges();

        expect(routerLinks.length).toBe(7, 'should have 7 routerLinks');
        expect(routerLinks[0].linkParams).toBe('/');
        expect(routerLinks[1].linkParams).toBe('/');
        expect(routerLinks[2].linkParams).toBe('/login');
        expect(routerLinks[3].linkParams).toBe('/register');
    });

    it('can get RouterLinks from template if there is logged in user', () => {
        component.user = user;
        component.loggedIn = true;
        fixture.detectChanges();

        linkDes = de.queryAll(By.directive(RouterLinkDirectiveStubDirective));
        routerLinks = linkDes.map(deel => deel.injector.get(RouterLinkDirectiveStubDirective));

        expect(routerLinks.length).toBe(11, 'should have 11 routerLinks');
        expect(routerLinks[0].linkParams).toBe('/');
        expect(routerLinks[1].linkParams).toBe('/');
        expect(routerLinks[2].linkParams).toBe('/editor');
        expect(routerLinks[3].linkParams).toBe('/settings');
        expect(routerLinks[4].linkParams).toEqual(['/profile', user.username]);
        expect(routerLinks[5].linkParams).toEqual(['/profile', user.username]);
    });

    it('can show active link by routerLinkActive if there is no logged in user', fakeAsync(() => {
        component.loggedIn = false;
        let linksDe;
        /*
        there is still issue with
        "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'"
         https://github.com/angular/angular/issues/25837
        */
        router.navigate(['']);

        tick();
        linksDe = de.queryAll(By.css('.mat-accent'))
            .map(element => element.injector.get(RouterLinkDirectiveStubDirective) as RouterLinkDirectiveStubDirective);

        expect(linksDe.length).toBe(2);
        expect(linksDe[0].linkParams).toBe('/');
        expect(linksDe[1].linkParams).toBe('/');

        router.navigate(['login']);

        tick();
        linksDe = de.queryAll(By.css('.mat-accent'))
            .map(element => element.injector.get(RouterLinkDirectiveStubDirective) as RouterLinkDirectiveStubDirective);

        expect(linksDe.length).toBe(2);
        expect(linksDe[0].linkParams).toBe('/login');
        expect(linksDe[1].linkParams).toBe('/login');
    }));

    it('can show active link by routerLinkActive if there is logged in user', fakeAsync(() => {
        component.loggedIn = true;
        component.user = user;
        let linksDe;

        fixture.detectChanges();
        /*
        there is still issue with
        "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'"
         https://github.com/angular/angular/issues/25837
        */
        router.navigate(['']);

        tick();
        linksDe = de.queryAll(By.css('.mat-accent'))
            .map(element => element.injector.get(RouterLinkDirectiveStubDirective) as RouterLinkDirectiveStubDirective);

        expect(linksDe.length).toBe(2);
        expect(linksDe[0].linkParams).toBe('/');
        expect(linksDe[1].linkParams).toBe('/');

        router.navigate(['editor']);

        tick();
        linksDe = de.queryAll(By.css('.mat-accent'))
            .map(element => element.injector.get(RouterLinkDirectiveStubDirective) as RouterLinkDirectiveStubDirective);

        expect(linksDe.length).toBe(2);
        expect(linksDe[0].linkParams).toBe('/editor');
        expect(linksDe[1].linkParams).toBe('/editor');
    }));
});

