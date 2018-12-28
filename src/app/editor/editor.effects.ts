import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ArticlesService } from '../core';
import { EditorActionTypes, EditorArticleSaveRequest, EditorArticleSaveSuccess, EditorArticleSaveFail } from './editor.actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { ShowMainLoader, HideMainLoader } from '../layout/layout.actions';


@Injectable()
export class EditorEffects {

  constructor(
    private actions$: Actions,
    private articleService: ArticlesService,
    private router: Router,
    private sotre: Store<AppState>
  ) { }

  @Effect()
  saveArticle$ = this.actions$.pipe(
    ofType<EditorArticleSaveRequest>(EditorActionTypes.EditorArticleSaveRequest),
    switchMap(action => this.articleService.save(action.payload.article).pipe(
      map(article => new EditorArticleSaveSuccess({ article })),
      catchError(errors => {
        console.error(errors);
        return of(new EditorArticleSaveFail({ errors }));
      })
    )));

  @Effect({dispatch: false})
  editorArticleSaveSuccess$ = this.actions$.pipe(
    ofType<EditorArticleSaveSuccess>(EditorActionTypes.EditorArticleSaveSuccess),
    map(action => action.payload.article),
    tap(article =>  this.router.navigateByUrl('/article/' + article.slug))
  );

  @Effect({dispatch: false})
  editorArticleSaveRequest$ = this.actions$.pipe(
    ofType<EditorArticleSaveRequest>(EditorActionTypes.EditorArticleSaveRequest),
    tap(_ => this.sotre.dispatch(new ShowMainLoader())),
  );

  @Effect({dispatch: false})
  editorArticleSaveFail$ = this.actions$.pipe(
    ofType<EditorArticleSaveFail>(EditorActionTypes.EditorArticleSaveFail),
    tap(_ => this.sotre.dispatch(new HideMainLoader()))
  );
}
