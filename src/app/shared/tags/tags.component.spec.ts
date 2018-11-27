import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '../../lib/testing';

import { TagsComponent } from './tags.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TagsComponent', () => {
    let component: TagsComponent;
    let fixture: ComponentFixture<TagsComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [TagsComponent],
                    schemas: [NO_ERRORS_SCHEMA]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(TagsComponent);
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

    it('should has "tags" @Input', () => {
        expect(component.tags).toEqual([]);
    });

    it('should has "currentTag" @Input', () => {
        expect(component.currentTag).toBe('');
    });

    it('should has "isLoading" @Input', () => {
        expect(component.isLoading).toBeFalsy();
    });

    it('should has "isErrorLoading" @Input', () => {
        expect(component.isErrorLoading).toBeFalsy();
    });

    it('should show "tags" @Input', () => {
        component.tags = ['one', 'two', 'three'];
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.tags = ['one'];
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.tags = [''];
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.tags = [];
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should mark tag as selected via "currentTag" @Input and set color of tag to "accent"', () => {
        component.currentTag = 'one';
        component.tags = ['one', 'two', 'three'];

        fixture.detectChanges();

        const firstTagElem = de.query(By.css('mat-chip')).nativeElement;

        expect(firstTagElem.selected).toBeTruthy();
        expect(firstTagElem.color).toBe('accent');
    });

    it('should not raise "selecteTag" event if clicked tag is equals to currentTag', () => {
        let wasEmited = false;

        component.currentTag = 'one';
        component.tags = ['one', 'two', 'three'];
        component.selecteTag.subscribe((tag: string) => {
            console.log(tag);
            wasEmited = !!tag;
        });

        fixture.detectChanges();

        const firstTag = de.query(By.css('mat-chip'));

        firstTag.triggerEventHandler('click', null);

        expect(wasEmited).toBeFalsy();
    });

    it('should show loader', () => {
        component.isLoading = true;

        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should show error', () => {
        component.isErrorLoading = true;

        fixture.detectChanges();

        const errorMessElem = de.query(By.css('[style]')).nativeElement;

        expect(fixture).toMatchSnapshot();
        expect(errorMessElem.textContent).toContain('error');
    });

    it('should raise selected event when clicked (selecteTag) and select first tag', () => {
        let selectedTag: string;
        const expectedTag = 'one';
        component.tags = ['one', 'two', 'three'];
        component.selecteTag.subscribe((tag: string) => selectedTag = tag);

        fixture.detectChanges();

        const firstTag = de.query(By.css('mat-chip'));

        firstTag.triggerEventHandler('click', null);
        expect(selectedTag).toBe(expectedTag);
    });
});

