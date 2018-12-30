import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { FollowButtonComponent } from './follow-button.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';

describe('FollowButtonComponent', () => {
    let component: FollowButtonComponent;
    let fixture: ComponentFixture<FollowButtonComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const event = {
        prevented: false,
        preventDefault() {
            this.prevented = true;
        }
    };

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [FollowButtonComponent],
                    imports: [MaterialModule]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(FollowButtonComponent);
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

    it('should has "followed" @Input', () => {
        expect(component.followed).toBe(false);
    });

    it('should has "isLoading" @Input', () => {
        expect(component.isLoading).toBe(false);
    });

    it('should show "Unfollow" text by "followed" @Input equals to false', () => {
        component.followed = false;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should show "Follow" text by "followed" @Input equals to true', () => {
        component.followed = true;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should has a color that is equal to primary by "followed" @Input equals to false', () => {
        component.followed = false;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('shouldn\'t has a color that is equal to primary by "followed" @Input equals to false', () => {
        component.followed = false;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should be disabled by "isLoading" @Input equals to true', () => {
        component.isLoading = true;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('shouldn\'t be disabled by "isLoading" @Input equals to false', () => {
        component.isLoading = false;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should raises followedToggle event when clicked (onFavoriteClick)', () => {
        let raised = null;
        component.followedToggle.subscribe(_ => raised = true);

        fixture.detectChanges();

        const button = de.query(By.css('button'));
        button.triggerEventHandler('click', event);

        expect(raised).toBe(true);
    });

    it('shouldn\'t raises followedToggle event when clicked (onFavoriteClick) and "isLoading" @Input equals to true', () => {
        let wasEmited = false;

        component.isLoading = true;
        component.followedToggle.subscribe(_ => wasEmited = true);

        fixture.detectChanges();
        const button = de.query(By.css('button'));

        button.triggerEventHandler('click', event);

        expect(wasEmited).toBe(false);
    });

    it('should prevent defaul behaviour of clicked element when clicked (onFavoriteClick)', () => {
        component.followedToggle.subscribe();

        fixture.detectChanges();
        const button = de.query(By.css('button'));

        button.triggerEventHandler('click', event);

        expect(event.prevented).toBe(true);
    });
});

