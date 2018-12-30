import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests, getUser, getProfile, getArticle, getComment } from '@app/lib/testing';
import { ArticleComponent } from './article.component';
import { DebugElement, Component, Output, EventEmitter, Input } from '@angular/core';
import { User, Profile, Article, Comment } from '@app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as ArticleActions from '../article.actions';
import * as fromRoot from '@app/reducers';
import * as fromArticle from '../article.reducer';
import * as AuthActions from '@app/auth/auth.actions';
import { hot, cold } from 'jasmine-marbles';
import { ShowAuthedDirective } from '@app/shared';
import { of } from 'rxjs';
import { ToggleArticleFavoriteRequest } from '@app/articles/articles.actions';


@Component({
    selector: 'app-article-full',
    template: `
        <div id="follow" (click)="onToggleFollowing()"></div>
        <div id="favorite" (click)="onFavoriveToggle()"></div>
        <div id="deleteArticle" (click)="onDeleteArticle()"></div>`
})
class TestHostArticleFullComponent {
    @Input('articleErrors') articleErrors: any;
    @Input('isDeletingArticle') isDeletingArticle: any;
    @Input('canModify') canModify: any;
    @Input('article') article: any;
    @Output() favorited = new EventEmitter<any>();
    @Output() folowing = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();

    onFavoriveToggle() {
        this.favorited.emit(getArticle());
    }

    onToggleFollowing() {
        this.folowing.emit(getProfile());
    }

    onDeleteArticle() {
        this.delete.emit(getArticle());
    }
}

@Component({
    selector: 'app-list-error',
    template: `<div id="tabs" (click)="onSelectedType($event)"></div>`
})
class TestHostListErrorsComponent {
    @Input('errors') errors: any;
}

@Component({
    selector: 'app-comments',
    template: `
        <div id="submit" (click)="onSubmitComment()"></div>
        <div id="deleteComment" (click)="onDeleteComment()"></div>`
})
class TestHostCommentsComponent {
    @Input('comments') comments: any;
    @Input('reset') reset: any;
    @Input('isSubmitting') isSubmitting: any;
    @Input('user') user: any;
    @Input('loading') loading: any;
    @Output() delete = new EventEmitter();
    @Output() submitComment = new EventEmitter();

    onSubmitComment() {
        this.submitComment.emit('comment');
    }

    onDeleteComment() {
        this.delete.emit(getComment(0));
    }
}

describe('ArticleComponent', () => {
    let component: ArticleComponent;
    let fixture: ComponentFixture<ArticleComponent>;
    let de: DebugElement;
    let store: Store<fromRoot.AppState>;
    let profile: Profile;
    let article: Article;
    let user: User;
    let comment: Comment;

    beforeEach(
        async(() => {
            profile = getProfile();
            user = getUser();
            article = getArticle();
            comment = getComment(0);
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [
                        ArticleComponent,
                        TestHostArticleFullComponent,
                        TestHostListErrorsComponent,
                        TestHostCommentsComponent,
                        ShowAuthedDirective
                    ],
                    imports: [
                        NoopAnimationsModule,
                        StoreModule.forRoot({
                            ...fromRoot.reducers,
                            feature: combineReducers(
                                fromArticle.articleReducer,
                            ),
                        }),
                    ],
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(ArticleComponent);
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

    it('should article @Input', () => {
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        fixture.detectChanges();
        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should hide buttons for logged in user', () => {
        store.dispatch(new AuthActions.LoginSuccess({ user }));
        fixture.detectChanges();
        (<any>expect(fixture)).toMatchSnapshot();
    });

    it('should select article', () => {
        component.article$.subscribe(res => {
            expect(res).toBeNull();
        });
    });

    it('should select canModify and set it to true', () => {
        user.username = 'user';
        article.author.username = 'user';
        store.dispatch(new AuthActions.LoginSuccess({ user }));
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        component.canModify$.subscribe(res => {
            expect(res).toBeTruthy();
        });
    });

    it('should select canModify and set it to false', () => {
        user.username = '';
        store.dispatch(new AuthActions.LoginSuccess({ user }));
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        component.canModify$.subscribe(res => {
            expect(res).toBeFalsy();
        });
    });

    it('should select user', () => {
        const expected = cold('a', { a: null });

        component.ngOnInit();

        expect(component.user$).toBeObservable(expected);
    });

    it('should select articleErrors', () => {
        const expected = cold('a', { a: { errors: {} } });

        component.ngOnInit();

        expect(component.articleErrors$).toBeObservable(expected);
    });

    it('should select isDeletingArticle', () => {
        const expected = cold('a', { a: false });

        component.ngOnInit();

        expect(component.isDeletingArticle$).toBeObservable(expected);
    });

    it('should select comments', () => {
        const expected = cold('a', { a: [] });

        component.ngOnInit();

        expect(component.comments$).toBeObservable(expected);
    });

    it('should select getCommentsErrors', () => {
        const expected = cold('a', { a: { errors: {} } });

        component.ngOnInit();

        expect(component.getCommentsErrors$).toBeObservable(expected);
    });

    it('should select addCommentErrors', () => {
        const expected = cold('a', { a: { errors: {} } });

        component.ngOnInit();

        expect(component.addCommentErrors$).toBeObservable(expected);
    });

    it('should select deleteCommentErrors', () => {
        const expected = cold('a', { a: { errors: {} } });

        component.ngOnInit();

        expect(component.deleteCommentErrors$).toBeObservable(expected);
    });

    it('should select isCommentLoading', () => {
        const expected = cold('a', { a: false });

        component.ngOnInit();

        expect(component.isCommentLoading$).toBeObservable(expected);
    });

    it('should select isCommentSaving', () => {
        const expected = cold('a', { a: false });

        component.ngOnInit();

        expect(component.isCommentSaving$).toBeObservable(expected);
    });

    it('should select needReset', () => {
        const expected = cold('a', { a: false });

        component.ngOnInit();

        expect(component.needReset$).toBeObservable(expected);
    });

    it('should dispatch "ArticleCommentsRequest', () => {
        const spy = jest.spyOn(store, 'pipe').mockImplementation(() => of(article));
        component.ngOnInit();

        expect(store.dispatch).toHaveBeenCalledWith(new ArticleActions.ArticleCommentsRequest({ slug: 'slug' }));
    });

    it('should dispatch "ArticleToggleFollowingRequest"', () => {
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        fixture.detectChanges();

        const clickDe = de.query(By.css('#follow'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new ArticleActions.ArticleToggleFollowingRequest({ profile }));
    });

    it('should dispatch "ToggleArticleFavoriteRequest"', () => {
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        fixture.detectChanges();

        const clickDe = de.query(By.css('#favorite'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new ToggleArticleFavoriteRequest({ article }));
    });

    it('should dispatch "ArticleDeleteConfirmationRequest"', () => {
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        fixture.detectChanges();

        const clickDe = de.query(By.css('#deleteArticle'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch)
            .toHaveBeenCalledWith(
                new ArticleActions.ArticleDeleteConfirmationRequest({ article, question: 'Are you sure you want to delete article?' }));
    });

    it('should dispatch "ArticleCommentAddRequest"', () => {
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        fixture.detectChanges();

        const clickDe = de.query(By.css('#submit'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new ArticleActions.ArticleCommentAddRequest({ comment: 'comment' }));
    });

    it('should dispatch "ArticleCommentDeleteRequest"', () => {
        store.dispatch(new ArticleActions.ArticleLoadSuccess({ article }));
        fixture.detectChanges();

        const clickDe = de.query(By.css('#deleteComment'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new ArticleActions.ArticleCommentDeleteRequest({ comment }));
    });

    it('should dispatch "LogoutAction"', () => {
        const clickDe = de.query(By.css('[sigin]'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new AuthActions.LogoutAction());
    });

    it('should dispatch "LogoutAction"', () => {
        const clickDe = de.query(By.css('[sigup]'));

        clickDe.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new AuthActions.LogoutAction({ path: 'register' }));
    });

});
