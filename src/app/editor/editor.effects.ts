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
  updateInfo = this.actions$.pipe(
    ofType<EditorArticleSaveRequest>(EditorActionTypes.EditorArticleSaveRequest),
    tap(_ => this.sotre.dispatch(new ShowMainLoader())),
    switchMap(action => this.articleService.save(action.payload.article).pipe(
      tap(article => this.router.navigateByUrl('/article/' + article.slug)),
      map(article => new EditorArticleSaveSuccess({ article })),
      catchError(errors => {
        console.error(errors);
        this.sotre.dispatch(new HideMainLoader());
        return of(new EditorArticleSaveFail({ errors }));
      })
    )));
}
