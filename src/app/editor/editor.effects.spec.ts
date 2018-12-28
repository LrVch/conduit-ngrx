import { TestBed } from '@angular/core/testing';
import { getArticle, getSomeErrors, getProfile, getUser, getComment, getComments, getArticles } from '../lib/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { Mock, provideMagicalMock } from 'angular-testing-library';

import {
    ArticlesService,
    Article,
    Errors,
} from '../core';
import * as fromEditorActions from './editor.actions';
import { EditorEffects } from './editor.effects';
import * as fromRoot from '../reducers';
import * as fromEditor from './editor.reducer';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { HideMainLoader, ShowMainLoader } from '../layout/layout.actions';
import { Router } from '@angular/router';

describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: EditorEffects;
    let articleService: Mock<ArticlesService>;
    let store: Store<fromEditor.EditorState>;
    let errors: Errors;
    let router: Mock<Router>;
    let article: Article;

    class MockRoute {
        snapshot = {
            queryParams: {}
        };
    }

    beforeEach(() => {
        errors = getSomeErrors();
        article = getArticle();
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRoot.reducers,
                    feature: combineReducers(fromEditor.editorReducer),
                }),
            ],
            providers: [
                EditorEffects,
                provideMockActions(() => actions$),
                provideMagicalMock(ArticlesService),
                provideMagicalMock(Router)
            ],
        });

        effects = TestBed.get(EditorEffects);
        articleService = TestBed.get(ArticlesService);
        store = TestBed.get(Store);
        router = TestBed.get(Router);

        spyOn(store, 'dispatch').and.callThrough();
        spyOn(console, 'error'); // .and.callThrough();
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('saveArticle$', () => {
        it('should call API to save article and return a "EditorArticleSaveSuccess", on success', () => {
            const action = new fromEditorActions.EditorArticleSaveRequest({ article });
            const result = new fromEditorActions.EditorArticleSaveSuccess({ article });

            actions$ = hot('-a', { a: action });
            const response = cold('-b', { b: article });
            const expected = cold('--c', { c: result });

            articleService.save.and.returnValue(response);

            expect(effects.saveArticle$).toBeObservable(expected);
        });

        it('should call API to save article and return a "EditorArticleSaveFail", on fail', () => {
            const action = new fromEditorActions.EditorArticleSaveRequest({ article });
            const result = new fromEditorActions.EditorArticleSaveFail({ errors });

            actions$ = hot('-a', { a: action });
            const response = cold('-#|', {}, errors);
            const expected = cold('--c', { c: result });

            articleService.save.and.returnValue(response);

            expect(effects.saveArticle$).toBeObservable(expected);
            expect(console.error).toHaveBeenCalledWith(errors);
        });
    });

    describe('editorArticleSaveSuccess$', () => {
        it('should redirect to article on "EditorArticleSaveSuccess"', (done) => {
            const action = new fromEditorActions.EditorArticleSaveSuccess({ article });

            actions$ = of(action);

            effects.editorArticleSaveSuccess$.subscribe(res => {
                expect(router.navigateByUrl).toHaveBeenCalledWith('/article/' + article.slug);
                done();
            }, done, done);
        });
    });

    describe('editorArticleSaveRequest$', () => {
        it('should show main loader on "EditorArticleSaveRequest"', (done) => {
            const action = new fromEditorActions.EditorArticleSaveRequest({ article });

            actions$ = of(action);

            effects.editorArticleSaveRequest$.subscribe(res => {
                expect(store.dispatch).toHaveBeenCalledWith(new ShowMainLoader());
                done();
            }, done, done);
        });
    });

    describe('editorArticleSaveFail$', () => {
        it('should hide main loader on "EditorArticleSaveFail"', (done) => {
            const action = new fromEditorActions.EditorArticleSaveFail({ errors });

            actions$ = of(action);

            effects.editorArticleSaveFail$.subscribe(res => {
                expect(store.dispatch).toHaveBeenCalledWith(new HideMainLoader());
                done();
            }, done, done);
        });
    });
});

