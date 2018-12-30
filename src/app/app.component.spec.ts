import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from './lib/testing';
import { AppComponent } from './app.component';
import { DebugElement, Component, Input } from '@angular/core';
import { MainLoaderService } from 'src/app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as fromRoot from './reducers';
import * as fromAuth from './auth/auth.reducer';
import { RouterTestingModule } from '@angular/router/testing';
import { ShowMainLoader, HideMainLoader } from './layout/layout.actions';
import { cold } from 'jasmine-marbles';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-header',
    template: ``
})
class TestHostHeaderComponent {
    @Input('user') user: any;
    @Input('loggedIn') loggedIn: any;
    @Input('showLoader') showLoader: any;
}

@Component({
    selector: 'app-footer',
    template: ``
})
class TestHostFooterComponent {
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let store: Store<fromAuth.AuthState>;
    let mainLoaderService: MainLoaderService;

    class MockMainLoaderService {
        showLoader = new Subject<boolean>();
        showLoader$ = this.showLoader.asObservable();
    }

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [AppComponent, TestHostHeaderComponent, TestHostFooterComponent],
                    imports: [
                        NoopAnimationsModule,
                        StoreModule.forRoot({
                            ...fromRoot.reducers,
                            feature: combineReducers(fromAuth.authReducer),
                        }),
                        RouterTestingModule
                    ],
                    providers: [
                        { provide: MainLoaderService, useClass: MockMainLoaderService }
                    ]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(AppComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                store = testBed.get(Store);
                mainLoaderService = testBed.get(MainLoaderService);
                fixture.detectChanges();

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

    it('should dispatch "ShowMainLoader"', () => {
        mainLoaderService.showLoader.next(true);
        expect(store.dispatch).toHaveBeenCalledWith(new ShowMainLoader());
    });

    it('should dispatch "HideMainLoader"', () => {
        mainLoaderService.showLoader.next(false);
        expect(store.dispatch).toHaveBeenCalledWith(new HideMainLoader());
    });

    it('should get showMailLoader', () => {
        component.ngOnInit();

        const expected = cold('a', {a: false});

        expect(component.showMailLoader$).toBeObservable(expected);
    });

    it('should get loggedIn', () => {
        component.ngOnInit();

        const expected = cold('a', {a: false});

        expect(component.loggedIn$).toBeObservable(expected);

    });

    it('should get user', () => {
        component.ngOnInit();

        const expected = cold('a', {a: null});

        expect(component.user$).toBeObservable(expected);
    });
});
