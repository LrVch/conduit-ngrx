import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests, getUser, getProfile, getArticle } from '@app/lib/testing';
import { HomeComponent } from './home.component';
import { DebugElement, Component, Output, EventEmitter, Input } from '@angular/core';
import { Errors, User, Profile, Article } from '@app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as ArticlesActions from '@app/articles/articles.actions';
import * as AuthActions from '@app/auth/auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromArticles from '@app/articles/articles.reducer';
import * as fromAuth from '@app/auth/auth.reducer';
import { hot, cold } from 'jasmine-marbles';
import { ArticlesConfigState } from '@app/articles/articlesConfig.reducer';
import { of } from 'rxjs';
import { ShowAuthedDirective } from '@app/shared';


@Component({
  selector: 'app-tags',
  template: `<div id="selectTag" (click)="onSelectedTag()"></div>`
})
class TestHostTagsComponent {
  @Input('tags') tags: any;
  @Input('isErrorLoading') isErrorLoading: any;
  @Input('currentTag') currentTag: any;
  @Input('isLoading') isLoading: any;
  @Output() selecteTag = new EventEmitter<any>();

  onSelectedTag() {
    this.selecteTag.emit('tag');
  }
}

@Component({
  selector: 'app-content-tabs',
  template: `<div id="tabs" (click)="onSelectedType($event)"><ng-content></ng-content></div>`
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
  selector: 'mat-chip',
  template: `<ng-content></ng-content>`
})
class TestHostMatChipComponent {
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


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
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
            HomeComponent,
            TestHostTagsComponent,
            TestHostArticleListComponent,
            TestHostMatPaginatorComponent,
            TestHostContentTabsComponent,
            TestHostMatChipComponent,
            ShowAuthedDirective
          ],
          imports: [
            NoopAnimationsModule,
            StoreModule.forRoot({
              ...fromRoot.reducers,
            }),
          ],
        });
      };

      configureTests(configure).then(testBed => {
        fixture = testBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        store = testBed.get(Store);
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

  it('should show selected tag', () => {
    store.dispatch(new ArticlesActions.SetTag({ tag: 'tag' }));
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should hide banner for logged in user', () => {
    store.dispatch(new AuthActions.LoginSuccess({ user }));
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });


  it('should load articles for not loggen in user', () => {
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ClearReturnArticlesConfig());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadTagsRequest());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
  });

  it('should load articles for loggen in user', () => {
    store.dispatch(new AuthActions.LoginSuccess({ user }));
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ClearReturnArticlesConfig());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetTypeOfFeed({ type: 'feed' }));
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadTagsRequest());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
  });

  it('should load articles for loggen in user and return config', () => {
    store.dispatch(new AuthActions.LoginSuccess({ user }));
    store.dispatch(new ArticlesActions.SetReturnArticlesConfig({ config: returnConfig }));
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ClearReturnArticlesConfig());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());

    const { tag, offset, limit } = returnConfig.filters;
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetTypeOfFeed({ type: returnConfig.type }));
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetLimit({ limit }));
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetOffset({ offset }));
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetPageIndex({ pageIndex: offset / limit }));
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetTag({ tag }));

    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadTagsRequest());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
  });

  it('should select tags', () => {
    component.ngOnInit();

    const expected = cold('a', { a: [] });

    expect(component.tags$).toBeObservable(expected);
  });

  it('should select currentTag', () => {
    component.ngOnInit();

    const expected = cold('a', { a: '' });

    expect(component.currentTag$).toBeObservable(expected);
  });

  it('should select loadingTags', () => {
    component.ngOnInit();

    const expected = cold('a', { a: true });

    expect(component.loadingTags$).toBeObservable(expected);
  });

  it('should select errorLoadingTags', () => {
    component.ngOnInit();

    const expected = cold('a', { a: false });

    expect(component.errorLoadingTags$).toBeObservable(expected);
  });

  it('should select type', (done) => {
    component.ngOnInit();

    component.type$.subscribe(res => {
      expect(res).toBe('all');
      done();
    }, done, done);
  });

  it('should select atricles', () => {
    component.ngOnInit();

    const expected = cold('a', { a: [] });

    expect(component.atricles$).toBeObservable(expected);
  });

  it('should select limit', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 10 });

    expect(component.limit$).toBeObservable(expected);
  });

  it('should select pageIndex', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 0 });

    expect(component.pageIndex$).toBeObservable(expected);
  });

  it('should select articlesCount', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 0 });

    expect(component.articlesCount$).toBeObservable(expected);
  });

  it('should select loadingArticles', () => {
    component.ngOnInit();

    const expected = cold('a', { a: true });

    expect(component.loadingArticles$).toBeObservable(expected);
  });

  it('should dispatch "ToggleArticleFavoriteRequest"', () => {
    const clickDe = de.query(By.css('#favorite'));

    clickDe.triggerEventHandler('click', null);

    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ToggleArticleFavoriteRequest({ article }));
  });

  it('should dispatch "ToggleArticleFavoriteRequest"', () => {
    const clickDe = de.query(By.css('#selectTag'));

    clickDe.triggerEventHandler('click', null);

    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetTag({tag: 'tag'}));
    expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.LoadArticlesRequest());
  });

  it('should load article for sertain tab and set author', () => {
      const spy = jest.spyOn(store, 'pipe').mockImplementation(() => of(false));
      const tabDe = de.query(By.css('#tabs'));
      tabDe.triggerEventHandler('click', { type: 'feed' });

      expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
      expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetTypeOfFeed({ type: 'feed' }));
      expect(store.dispatch).toHaveBeenCalledWith(new AuthActions.LogoutAction());
  });

  it('should load article for sertain tab and set favorited', () => {
    const spy = jest.spyOn(store, 'pipe').mockImplementation(() => of(true));
    const tabDe = de.query(By.css('#tabs'));
    tabDe.triggerEventHandler('click', { type: 'notfeed' });

      expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.ResetConfig());
      expect(store.dispatch).toHaveBeenCalledWith(new ArticlesActions.SetTypeOfFeed({ type: 'notfeed' }));
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
