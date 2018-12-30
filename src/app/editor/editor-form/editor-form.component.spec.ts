import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { ConfigureFn, configureTests, getUser, getArticle } from '@app/lib/testing';
import { EditorFormComponent } from './editor-form.component';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollService, DomUtilService, Article } from '@app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { PasswordStrengthComponent, MaterialModule, AccentOnInvalidFromFieldDirective } from '@app/shared';

describe('EditorFormComponent', () => {
    let component: EditorFormComponent;
    let fixture: ComponentFixture<EditorFormComponent>;
    let de: DebugElement;
    let article: Article;

    beforeEach(
        async(() => {
            article = getArticle();
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [EditorFormComponent, AccentOnInvalidFromFieldDirective, PasswordStrengthComponent],
                    imports: [FormsModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
                    providers: [ScrollService, DomUtilService]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(EditorFormComponent);
                component = fixture.componentInstance;
                component.article = article;
                de = fixture.debugElement;
                fixture.detectChanges();

                spyOn(component.unsubscribe$, 'next').and.callThrough();
                spyOn(component.unsubscribe$, 'complete').and.callThrough();
                spyOn(component.tags$, 'complete').and.callThrough();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should has "submitting" props', () => {
        expect(component.submitting).toBe(false);
    });

    it('should create from with 3 controls', () => {
        const form = component.form;

        expect(form.contains('title')).toBeTruthy();
        expect(form.contains('description')).toBeTruthy();
        expect(form.contains('body')).toBeTruthy();
    });

    it('title control should be required', () => {
        const form = component.form;
        const title = form.get('title');

        title.setValue('');

        expect(title.valid).toBeFalsy();
    });

    it('description control should be required', () => {
        const form = component.form;
        const description = form.get('description');

        description.setValue('');

        expect(description.valid).toBeFalsy();
    });

    it('body control should be required', () => {
        const form = component.form;
        const body = form.get('body');

        body.setValue('');

        expect(body.valid).toBeFalsy();
    });

    it('should show error message', () => {
        component.form.get('title').setValue('');
        component.form.get('description').setValue('');
        component.form.get('body').setValue('');

        component.submit();

        fixture.detectChanges();

        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should disable button', () => {
        component.isSubmitting = true;
        fixture.detectChanges();
        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should disable form', () => {
        component.isSubmitting = true;

        expect(component.form.status).toBe('DISABLED');
    });

    it('should raise "onsubmit" when form valid on submit event and pass user data', () => {
        let title = '';
        let description = '';
        let body = '';
        let tagList = [''];
        const expectedTitle = 'title';
        const expectedDescription = 'description';
        const expectedBody = 'body';
        const expectedTags = [{ name: 'one' }];

        component.form.get('title').setValue(expectedTitle);
        component.form.get('description').setValue(expectedDescription);
        component.form.get('body').setValue(expectedBody);
        component.tags = expectedTags;

        component.onsubmit.subscribe((res: Article) => {
            ({ title, description, body, tagList } = res);
        });

        fixture.detectChanges();
        const formDe = de.query(By.css('form'));

        formDe.triggerEventHandler('ngSubmit', null);

        expect(title).toBe(expectedTitle);
        expect(description).toBe(expectedDescription);
        expect(body).toBe(expectedBody);
        expect(tagList).toEqual(expectedTags.map(tag => tag.name));
    });

    it('shouldn\'t raise "onsubmit" when form invalid', () => {
        let wasEmited = false;

        component.form.get('title').setValue('');

        component.onsubmit.subscribe(c => wasEmited = true);

        fixture.detectChanges();
        const formDe = de.query(By.css('form'));

        formDe.triggerEventHandler('ngSubmit', null);

        expect(wasEmited).toBe(false);
    });

    it('should invoke validateAllFormFields method when form invalid', () => {
        const spy = jest.spyOn(component, 'validateAllFormFields');

        component.form.get('title').setValue('');

        fixture.detectChanges();
        const formDe = de.query(By.css('form'));
        formDe.triggerEventHandler('ngSubmit', null);

        expect(spy).toHaveBeenCalled();
    });

    it('should raise "wasChanged" when form data changes', fakeAsync(() => {
        spyOn(component.wasChanged, 'emit');
        component.ngOnInit();

        component.form.get('title').setValue('titlefds');

        tick(200);

        expect(component.wasChanged.emit).toHaveBeenCalledWith(true);

        component.form.get('title').setValue('title');

        tick(200);

        expect(component.wasChanged.emit).toHaveBeenCalledWith(false);
    }));

    it('should handle ngOnDestroy', () => {
        component.ngOnDestroy();

        expect(component.unsubscribe$.next).toHaveBeenCalled();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
        expect(component.tags$.complete).toHaveBeenCalled();
    });

    it('should add tag', () => {
        const input = {
            value: ''
        };
        const event = {
            value: 'tag',
            input
        };
        const expected = [{ name: 'list' }, { name: 'tag' }];

        component.addTag(event);

        expect(component.tags).toEqual(expected);

        component.tags$.subscribe(res => {
            expect(res).toEqual(expected);
        });

    });

    it('should remove tag', () => {
        const expected = [];

        component.removeTag({ name: 'list' });

        expect(component.tags).toEqual(expected);

        component.tags$.subscribe(res => {
            expect(res).toEqual(expected);
        });

    });
});
