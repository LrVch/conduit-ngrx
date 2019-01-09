import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { Router } from '@angular/router';
import { tap, take, map, switchMap, catchError } from 'rxjs/operators';
import { selectArticle } from './aritcle.selectors';
import { ArticlesService } from '@app/core';
import { ArticleLoadSuccess } from './article.actions';

@Injectable()
export class ArticleGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private articlesService: ArticlesService
  ) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const slug = route.params['slug'];

    if (!slug) {
      this.router.navigate(['/']);
      return of(false);
    }

    return this.store.pipe(
      take(1),
      switchMap(() => this.articlesService.get(slug)),
      map(article => new ArticleLoadSuccess({ article })),
      tap((action: ArticleLoadSuccess) => this.store.dispatch(action)),
      map(article => !!article),
      catchError(error => {
        if (error.status === '404') {
          this.router.navigate(['/']);
        }
        console.error(error);
        return of(false);
      })
    );
  }
}
