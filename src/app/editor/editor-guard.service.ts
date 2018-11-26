import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router } from '@angular/router';
import { tap, take, map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { selectArticle } from './editor.selectors';
import { ArticlesService } from '../core';
import { EditorArticleLoadSuccess } from './editor.actions';
import { selectUser } from '../auth/auth.selectors';


@Injectable()
export class EditorGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private articlesService: ArticlesService
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {

        const slug = route.params['slug'];

        return this.store.pipe(
            select(selectArticle),
            take(1),
            switchMap(() => this.articlesService.get(slug)),
            withLatestFrom(this.store.select(selectUser)),
            map(([article, user]) => article.author.username === user.username
                ? new EditorArticleLoadSuccess({ article }) : throwError('wrong user')),
            tap((action: EditorArticleLoadSuccess) => this.store.dispatch(action)),
            map(article => !!article),
            catchError(() => {
                this.router.navigate(['/']);
                return of(false);
            })
        );
    }
}
