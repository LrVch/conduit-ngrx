import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '../../lib/testing';

import { FavoriteComponent } from './favorite.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../material/material.module';

describe('FavoriteComponent', () => {
    let component: FavoriteComponent;
    let fixture: ComponentFixture<FavoriteComponent>;
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
                    declarations: [FavoriteComponent],
                    imports: [MaterialModule]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(FavoriteComponent);
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

    it('should has "favorited" @Input', () => {
        expect(component.favorited).toBe(false);
    });

    it('should has "isLoading" @Input', () => {
        expect(component.isLoading).toBe(false);
    });

    it('should set color of icon to primary by "favorited" @Input equals to true', () => {
        component.favorited = true;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('shouldn\'t set color of icon to primary by "favorited" @Input equals to false', () => {
        component.favorited = false;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should set opacity to 0.5 by "isLoading" @Input equals to true', () => {
        component.isLoading = true;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should set opacity to 1 by "isLoading" @Input equals to false', () => {
        component.isLoading = false;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should raises favoritedToggle event when clicked (onFavoriteClick)', () => {
        let raised = null;
        component.favoritedToggle.subscribe(_ => raised = true);

        fixture.detectChanges();

        const button = de.query(By.css('.favorite'));
        button.triggerEventHandler('click', event);

        expect(raised).toBe(true);
    });

    it('shouldn\'t raises favoritedToggle event when clicked (onFavoriteClick) and "isLoading" @Input equals to true', () => {
        let wasEmited = false;

        component.isLoading = true;
        component.favoritedToggle.subscribe(_ => wasEmited = true);

        fixture.detectChanges();
        const button = de.query(By.css('.favorite'));

        button.triggerEventHandler('click', event);

        expect(wasEmited).toBe(false);
    });

    it('should prevent defaul behaviour of clicked element when clicked (onFavoriteClick)', () => {
        component.favoritedToggle.subscribe();

        fixture.detectChanges();
        const button = de.query(By.css('.favorite'));

        button.triggerEventHandler('click', event);

        expect(event.prevented).toBe(true);
    });

});

