import { TestBed } from '@angular/core/testing';
import { ArticleGuard } from './article-guard.service';
import { Router } from '@angular/router';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { ArticlesService } from '@app/core';
import { cold } from 'jasmine-marbles';
import * as Actions from './article.actions';
import * as fromRoot from '@app/reducers';
import * as fromArticle from './article.reducer';
import { getArticle, getSomeErrors } from '@app/lib/testing';

describe('ArticleGuard', () => {
    let service: ArticleGuard;
    let router: Router;
    let store: Store<fromArticle.ArticleState>;
    let articlesService: ArticlesService;
    const article = getArticle();
    const error = getSomeErrors();

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
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromArticle.articleReducer),
                }),
            ],
            providers: [
                ArticleGuard,
                { provide: Router, useClass: MockRouter },
                { provide: ArticlesService, useClass: MockArticlesService },
            ]
        });

        service = TestBed.get(ArticleGuard);
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
        it('should return observable of false from canActivate method if there is no slug', () => {
            const expected = cold('(a|)', { a: false });
            const route = new MockRoute();
            route.params = {
                slug: ''
            };

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });

        it('should return observable of true from canActivate method', () => {
            const route = new MockRoute();
            const slug = 'slug';
            const result = cold('-a|', { a: article });
            const expected = cold('-b|', { b: true });
            route.params = {
                slug: slug
            };

            articlesService.get = jest.fn(() => result);

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(store.dispatch).toHaveBeenCalledWith(new Actions.ArticleLoadSuccess({ article }));
        });

        it('should return observable of false from canActivate method  if there is a slug', () => {
            const route = new MockRoute();
            const slug = 'slug';
            const result = cold('#|', {}, error);
            const expected = cold('(b|)', { b: false });
            route.params = {
                slug: slug
            };

            articlesService.get = jest.fn(() => result);

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(error);
        });

        it('should return observable of false from canActivate method  if there is a slug and redirect to "/" if no article found', () => {
            const route = new MockRoute();
            const notFoundError = {status: '404'};
            const slug = 'slug';
            const result = cold('#|', {}, notFoundError);
            const expected = cold('(b|)', { b: false });
            route.params = {
                slug: slug
            };

            articlesService.get = jest.fn(() => result);

            expect(service.canActivate(route as any)).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(notFoundError);
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });
    });
});
