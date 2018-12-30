import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { Router } from '@angular/router';
import { tap, take, map, switchMap, catchError, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import { selectArticle } from './editor.selectors';
import { ArticlesService } from '@app/core';
import { EditorArticleLoadSuccess } from './editor.actions';
import { selectUser } from '@app/auth/auth.selectors';


@Injectable()
export class EditorGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private articlesService: ArticlesService
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> {

        const slug = route.params['slug'];

        return this.store.pipe(
            take(1),
            switchMap(() => this.articlesService.get(slug)),
            withLatestFrom(this.store.select(selectUser)),
            mergeMap(([article, user]) => article.author.username === user.username
            ? of(new EditorArticleLoadSuccess({ article })) : throwError('wrong user')),
            tap((action: EditorArticleLoadSuccess) => this.store.dispatch(action)),
            map(article => !!article),
            catchError((error) => {
                this.router.navigate(['/']);
                console.error(error);
                return of(false);
            })
        );
    }
}
