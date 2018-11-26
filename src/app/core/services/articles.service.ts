import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError, of, interval, timer } from 'rxjs';

import { ApiService } from './api.service';
import { Article, ArticleListConfig } from '../models';
import { map, switchMap, take } from 'rxjs/operators';
import { delay } from 'q';

@Injectable()
export class ArticlesService {
  constructor(
    private apiService: ApiService
  ) { }

  query(config: ArticleListConfig): Observable<{ articles: Article[], articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    const params = {};

    Object.keys(config.filters)
      .forEach((key) => {
        params[key] = config.filters[key];
      });

    return this.apiService.get(
      '/articles' + ((config.type === 'feed') ? '/feed' : ''),
      new HttpParams({ fromObject: params })
    );
  }

  get(slug): Observable<Article> {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError('cannot get article')
    // ));
    return this.apiService.get('/articles/' + slug)
      .pipe(map(data => data.article));
  }

  destroy(slug) {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { body: ['can\'t be blank'] } })
    //   ));
    return this.apiService.delete('/articles/' + slug);
  }

  save(article): Observable<Article> {
    // If we're updating an existing article
    if (article.slug) {
      return this.apiService.put('/articles/' + article.slug, { article: article })
        .pipe(map(data => data.article));

      // Otherwise, create a new article
    } else {
      return this.apiService.post('/articles/', { article: article })
        .pipe(map(data => data.article));
    }
  }

  favorite(slug): Observable<{ article: Article }> {
    return this.apiService.post('/articles/' + slug + '/favorite');
  }

  unfavorite(slug): Observable<{ article: Article }> {
    return this.apiService.delete('/articles/' + slug + '/favorite');
  }
}
