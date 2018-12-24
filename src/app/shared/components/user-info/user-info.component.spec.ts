import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '../../lib/testing';

import { UserInfoComponent } from './user-info.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Profile } from 'src/app/core';
import { FollowButtonComponent } from '../follow-button/follow-button.component';
import { MaterialModule } from '../material/material.module';
import { getProfile } from 'src/app/lib/testing/mock-data.helpers';

describe('UserInfoComponent', () => {
    let component: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const initialProfile: Profile  = {} as Profile;

    const profile: Profile  = getProfile();

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [UserInfoComponent, FollowButtonComponent],
                    imports: [MaterialModule]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(UserInfoComponent);
                component = fixture.componentInstance;
                component.profile = initialProfile;
                de = fixture.debugElement;
                el = de.nativeElement;
                fixture.detectChanges();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should has "profile" @Input', () => {
        expect(component.profile).toEqual({});
    });

    it('should has "isUser" @Input', () => {
        expect(component.isUser).toEqual(false);
    });

    it('should compile', () => {
        component.profile = profile;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should show edit profile settings button by "isUser" @Input equals to true', () => {
        component.profile = profile;
        component.isUser = true;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should show following button by "isUser" @Input equals to false', () => {
        component.profile = profile;
        component.isUser = false;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should raise folowing event when clicked (onFollowedToggle) and pass the profile', () => {
        let toggledProfile = null;
        component.profile = profile;
        component.folowing.subscribe((p: Profile) => {
            toggledProfile = p;
        });

        fixture.detectChanges();

        const followButton = de.query(By.css('app-follow-button')).query(By.css('button'));
        const event = {
            preventDefault() {}
        };

        followButton.triggerEventHandler('click', event);

        expect(toggledProfile).toBe(profile);
    });
});
