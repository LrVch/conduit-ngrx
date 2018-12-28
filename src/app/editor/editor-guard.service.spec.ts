import { TestBed } from '@angular/core/testing';
import { EditorGuard } from './editor-guard.service';
import { Router } from '@angular/router';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { ArticlesService } from '../core';
import { cold } from 'jasmine-marbles';
import * as fromEditorActions from './editor.actions';
import * as fromAuthActions from '../auth/auth.actions';
import * as fromRoot from '../reducers';
import * as fromEditor from './editor.reducer';
import * as fromAuth from '../auth/auth.reducer';
import { getArticle, getSomeErrors, getUser } from '../lib/testing';

describe('EditorGuard', () => {
    let service: EditorGuard;
    let router: Router;
    let store: Store<fromRoot.AppState>;
    let articlesService: ArticlesService;
    let article;
    let error;
    let user;

    class MockArticlesService {
        dispath = jest.fn();
    }

    class MockRouter {
        url: 'returnUrl';
        navigate(path: string, params: any) { }
    }

    class MockRoute {
        params = {};
    }

    beforeEach(() => {
        article = getArticle();
        error = getSomeErrors();
        user = getUser();
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromEditor.editorReducer, fromAuth.authReducer),
                }),
            ],
            providers: [
                EditorGuard,
                { provide: Router, useClass: MockRouter },
                { provide: ArticlesService, useClass: MockArticlesService },
            ]
        });

        service = TestBed.get(EditorGuard);
        router = TestBed.get(Router);
        store = TestBed.get(Store);
        articlesService = TestBed.get(ArticlesService);

        spyOn(store, 'dispatch').and.callThrough();
        spyOn(router, 'navigate');
        spyOn(console, 'error'); // .and.callThrough();
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    describe('canActivate', () => {
        it('should return observable of true from canActivate method', () => {
            user.username = 'testuser';
            article.author.username = 'testuser';
            const route = new MockRoute();
            const result = cold('-a|', { a: article });
            const expected = cold('-b|', { b: true });
            route.params = {
                slug: 'slug'
            };

            const loginAction = new fromAuthActions.LoginSuccess({ user });
            store.dispatch(loginAction);

            articlesService.get = jest.fn(() => result);

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(store.dispatch).toHaveBeenCalledWith(new fromEditorActions.EditorArticleLoadSuccess({ article }));
        });

        it('should return observable of false from canActivate method  if there is a slug and redirect to "/" if no article found', () => {
            user.username = 'testuser';
            article.author.username = 'testuser';
            const route = new MockRoute();
            const notFoundError = { status: '404' };
            const result = cold('#|', {}, notFoundError);
            const expected = cold('(b|)', { b: false });
            route.params = {
                slug: 'slug'
            };

            articlesService.get = jest.fn(() => result);

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(notFoundError);
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });

        it('should return observable of false from canActivate method  if user and article author are different', () => {
            user.username = 'user';
            article.author.username = 'testuser';
            const route = new MockRoute();
            const result = cold('-a|', {a: article});
            const expected = cold('-(b|)', { b: false });
            route.params = {
                slug: 'slug'
            };

            const loginAction = new fromAuthActions.LoginSuccess({ user });
            store.dispatch(loginAction);

            articlesService.get = jest.fn(() => result);

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith('wrong user');
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });
    });
});
