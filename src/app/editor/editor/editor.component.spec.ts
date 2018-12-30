import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests, getArticle } from '../../lib/testing';
import { EditorComponent } from './editor.component';
import { DebugElement, Component, Output, EventEmitter, Input } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as EditorActions from '../../editor/editor.actions';
import * as fromRoot from '../../reducers';
import * as fromEditor from '../../editor/editor.reducer';
import { hot, cold } from 'jasmine-marbles';
import { MaterialModule } from 'src/app/shared';
import { DialogService } from 'src/app/core/services/dialog.service';
import { Article } from 'src/app/core';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-list-error',
    template: ``
})
class TestHostListErrorComponent {
    @Input('errors') errors: any;
}

@Component({
    selector: 'app-editor-form',
    template: `
                <div id="submit" (click)="onSubmit()"></div>
                <div id="change" (click)="onWasChanged()"></div>`
})
class TestHostFrotmComponent {
    @Input('isSubmitting') isSubmitting: any;
    @Input('article') article: any;
    @Output() onsubmit = new EventEmitter<any>();
    @Output() wasChanged = new EventEmitter<boolean>();

    onSubmit() {
        this.onsubmit.emit(getArticle());
    }

    onWasChanged() {
        this.wasChanged.emit(true);
    }
}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let de: DebugElement;
    let store: Store<fromEditor.EditorState>;
    let article: Article;
    let dialogService: DialogService;

    class MockDialogService {
        confirmation = jest.fn();
    }


    beforeEach(
        async(() => {
            article = getArticle();
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [EditorComponent, TestHostFrotmComponent, TestHostListErrorComponent],
                    imports: [
                        MaterialModule,
                        NoopAnimationsModule,
                        StoreModule.forRoot({
                            ...fromRoot.reducers,
                            feature: combineReducers(fromEditor.editorReducer),
                        }),
                    ],
                    providers: [
                        {
                            provide: DialogService, useClass: MockDialogService
                        }
                    ]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(EditorComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                store = testBed.get(Store);
                fixture.detectChanges();

                dialogService = testBed.get(DialogService);

                spyOn(store, 'dispatch').and.callThrough();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should compile', () => {
        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should get article', () => {
        component.ngOnInit();

        const expected = cold('a', { a: null });

        expect(component.article$).toBeObservable(expected);
    });

    it('should get isSubmitting', () => {
        component.ngOnInit();

        const expected = cold('a', { a: false });

        expect(component.isSubmitting$).toBeObservable(expected);
    });

    it('should get errors', () => {
        component.ngOnInit();

        const expected = cold('a', { a: { errors: {} } });

        expect(component.errors$).toBeObservable(expected);
    });

    it('should dispatch "ClearEditorErrors"', () => {
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledWith(new EditorActions.ClearEditorErrors());
    });

    it('should handle ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(store.dispatch).toHaveBeenCalledWith(new EditorActions.EditorArticleClear());
    });

    it('should dispatch "EditorArticleSaveRequest"', () => {
        const submitDe = de.query(By.css('#submit'));

        submitDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new EditorActions.EditorArticleSaveRequest({ article }));
    });

    it('should set wasChanged to true', () => {
        const updateDe = de.query(By.css('#change'));

        updateDe.triggerEventHandler('click', null);

        expect(component.wasChanged).toBeTruthy();
    });

    it('shouldn\'t show dialog', () => {
        component.wasChanged = false;

        expect(component.canDeactivate()).toBeTruthy();
        expect(dialogService.confirmation).not.toHaveBeenCalled();
    });

    it('should show dialog and return true', () => {
        component.wasChanged = true;
        dialogService.confirmation = jest.fn(() => ({
            afterClosed() {
                return of(true);
            }
        }));

        (<Observable<boolean>>component.canDeactivate()).subscribe(res => {
            expect(res).toBeTruthy();
        });
        expect(dialogService.confirmation).toHaveBeenCalledWith({
            data: { question: 'You\'ll lost the data you have changed!' },
        });

    });

    it('should show dialog and return true', () => {
        component.wasChanged = true;
        dialogService.confirmation = jest.fn(() => ({
            afterClosed() {
                return of(false);
            }
        }));

        (<Observable<boolean>>component.canDeactivate()).subscribe(res => {
            expect(res).toBeFalsy();
        });
        expect(dialogService.confirmation).toHaveBeenCalledWith({
            data: { question: 'You\'ll lost the data you have changed!' },
        });

    });
});
