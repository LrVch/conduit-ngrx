import { async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ConfigureFn, configureTests, getUser, getProfile, getArticle } from '@app/lib/testing';
import { ProfileComponent } from './profile.component';
import { DebugElement, Component, Output, EventEmitter, Input } from '@angular/core';
import { Errors, User, Profile, Article } from '@app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as ProfileActions from '../profile.actions';
import * as ArticlesActions from '@app/articles/articles.actions';
import * as AuthActions from '@app/auth/auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromProfile from '@app/profile/profile.reducer';
import * as fromArticles from '@app/articles/articles.reducer';
import * as fromAuth from '@app/auth/auth.reducer';
import { hot, cold } from 'jasmine-marbles';
import { ArticlesConfigState } from '@app/articles/articlesConfig.reducer';
import { of } from 'rxjs';


@Component({
    selector: 'app-user-info',
    template: `<div id="follow" (click)="onFolowing()"></div>`
})
class TestHostUserInfoComponent {
    @Input('isUser') isUser: User;
    @Input('profile') profile: Profile;
    @Output() folowing = new EventEmitter<Profile>();

    onFolowing() {
        this.folowing.emit(getProfile());
    }
}

@Component({
    selector: 'app-content-tabs',
    template: `<div id="tabs" (click)="onSelectedType($event)"></div>`
})
class TestHostContentTabsComponent {
    @Input('type') type: any;
    @Input('tabs') tabs: any;
    @Output() selectedType = new EventEmitter();

    onSelectedType(event) {
        this.selectedType.emit(event.type);
    }
}

@Component({
    selector: 'app-articles-list',
    template: `<div id="favorite" (click)="onFavorited()"></div>`
})
class TestHostArticleListComponent {
    @Input('isLoading') isLoading: boolean;
    @Input('isErrorLoading') isErrorLoading: boolean;
    @Input('articlesList') articlesList: any;
    @Output() favorited = new EventEmitter();

    onFavorited() {
        this.favorited.emit(getArticle());
    }
}

@Component({
    selector: 'mat-paginator',
    template: `<div id="page" (click)="onPageChange($event)"></div>`
})
class TestHostMatPaginatorComponent {
    @Input('hidden') hidden: boolean;
    @Input('length') length: number;
    @Input('pageSize') pageSize: any;
    @Input('pageIndex') pageIndex: any;
    @Input('showFirstLastButtons') showFirstLastButtons: any;
    @Input('pageSizeOptions') pageSizeOptions: any;
    @Output() page = new EventEmitter();

    onPageChange(event) {
        this.page.emit(event.page);
    }
}


describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let de: DebugElement;
    let store: Store<fromRoot.AppState>;
    let profile: Profile;
    let user: User;
    let article: Article;

    const returnConfig: ArticlesConfigState = {
        type: 'all',
        filters: {
            tag: 'hello',
            author: '',
            favorited: '',
            offset: 0,
            limit: 10,
            pageIndex: 0
        }
    };

    beforeEach(
        async(() => {
            profile = getProfile();
            user = getUser();
            article = getArticle();
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [
                        ProfileComponent,
                        TestHostUserInfoComponent,
                        TestHostArticleListComponent,
                        TestHostMatPaginatorComponent,
                        TestHostContentTabsComponent
                    ],
                    imports: [
                        NoopAnimationsModule,
                        StoreModule.forRoot({
                            ...fromRoot.reducers,
                            feature: combineReducers(
                                fromProfile.profileReducer,
                            ),
                        }),
                    ],
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(ProfileComponent);
                component = fixture.componentInstance;
                de = fixture.debugElement;
                store = testBed.get(Store);
                fixture.detectChanges();

                spyOn(store, 'dispatch').and.callThrough();
                spyOn(component.destroStream$, 'next').and.callThrough();
                spyOn(component.destroStream$, 'complete').and.callThrough();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should compile', () => {
        (<any>expect(fixture)).toMatchSnapshot();
    });


    it('should select profile', () => {
        component.profile$.subscribe(res => {
            expect(res).toBeNull();
        });
    });

    it('should select isUser and return true', () => {
        user.username = 'testuser';
        profile.username = 'testuser';

        store.dispatch(new AuthActions.LoginSuccess({ user }));
        store.dispatch(new ProfileActions.ProfileLoadSuccess({ profile }));

        component.ngOnInit();

        component.isUser$.pipe().subscribe(res => {
            expect(res).toBeTruthy();
        });
    });

    it('should select isUser and return false', () => {
        user.username = 'nottestuser';
        profile.username = 'testuser';

        store.dispatch(new AuthActions.LoginSuccess({ user }));
        store.dispatch(new ProfileActions.ProfileLoadSuccess({ profile }));

        component.ngOnInit();

        component.isUser$.pipe().subscribe(res => {
            expect(res).toBeFalsy();
        });
    });

    it('should select atricles', (done) => {
        component.atricles$.subscribe(res => {
            expect(res).toEqual([]);
            done();
        }, done, done);
    });

    it('should select limit', (done) => {
        component.limit$.subscribe(res => {
            expect(res).toBe(10);
            done();
        }, done, done);
    });

    it('should select pageIndex', (done) => {
        component.pageIndex$.subscribe(res => {
            expect(res).toBe(0);
            done();
        }, done, done);
    });

    it('should select articlesCount', (done) => {
        component.articlesCount$.subscribe(res => {
            expect(res).toBe(0);
            done();
        }, done, done);
    });

    it('should select loadingArticles', (done) => {
        component.loadingArticles$.subscribe(res => {
            expect(res).toBeFalsy();
            done();
        }, done, done);
    });

    it('should dispatch "ResetConfig, SetAuthor, LoadArticlesRequest" if there is no return articles config', () => {
        store.dispatch(new ProfileActions.ProfileLoadSuccess({ profile }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetAuthor({ author: 'username' }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
    });

    it('should dispatch set articles config if there is return articles config', () => {
        store.dispatch(new ProfileActions.ProfileLoadSuccess({ profile }));
        store.dispatch(new ArticlesActions.SetReturnArticlesConfig({ config: returnConfig }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
        const { author, favorited, limit, offset } = returnConfig.filters;
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetAuthor({ author }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetFavorited({ favorited }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetLimit({ limit }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetOffset({ offset }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetPageIndex({ pageIndex: offset / limit }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
    });

    it('should select type', (done) => {
        component.type$.subscribe(res => {
            expect(res).toBe('favorited');
            done();
        }, done, done);
    });

    it('should handle ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(store.dispatch).toHaveBeenCalledWith(new ProfileActions.ProfileClear());
        expect(component.destroStream$.next).toHaveBeenCalled();
        expect(component.destroStream$.complete).toHaveBeenCalled();
    });


    it('should dispatch "ProfileToggleFollowingRequest"', () => {
        const followDe = de.query(By.css('#follow'));

        followDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new ProfileActions.ProfileToggleFollowingRequest({ profile }));
    });

    it('should dispatch "ToggleArticleFavoriteRequest"', () => {
        const favoriteDe = de.query(By.css('#favorite'));

        favoriteDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ToggleArticleFavoriteRequest({ article }));
    });

    it('should load article for sertain tab and set author', () => {
        const spy = jest.spyOn(store, 'pipe').mockImplementation(() => of('username'));
        const tabDe = de.query(By.css('#tabs'));
        tabDe.triggerEventHandler('click', { type: 'author' });

        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetAuthor({ author: 'username' }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
    });

    it('should load article for sertain tab and set favorited', () => {
        const spy = jest.spyOn(store, 'pipe').mockImplementation(() => of('username'));
        const tabDe = de.query(By.css('#tabs'));
        tabDe.triggerEventHandler('click', { type: 'favorited' });

        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetFavorited({ favorited: 'username' }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
    });

    it('should change page', () => {
        const page = {
            pageIndex: 20,
            pageSize: 20
        };
        const pageDe = de.query(By.css('#page'));
        pageDe.triggerEventHandler('click', { page });

        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetLimit({ limit: page.pageSize }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetPageIndex({ pageIndex: page.pageIndex }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetOffset({ offset: (page.pageSize * page.pageIndex) }));
        expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
    });
});
