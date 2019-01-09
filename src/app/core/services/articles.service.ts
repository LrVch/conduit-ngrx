import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError, of, interval, timer } from 'rxjs';

import { ApiService } from './api.service';
import { Article, ArticleListConfig } from '@app/core/models';
import { map, switchMap, take } from 'rxjs/operators';
import { delay } from 'q';

@Injectable()
export class ArticlesService {
  readonly BASE_URL = '/articles';

  constructor(private apiService: ApiService) {}

  query(
    config: ArticleListConfig
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    const params = {};

    Object.keys(config.filters).forEach(key => {
      params[key] = config.filters[key];
    });

    return this.apiService.get(
      this.BASE_URL + (config.type === 'feed' ? '/feed' : ''),
      new HttpParams({ fromObject: params })
    );
  }

  get(slug: string): Observable<Article> {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError('cannot get article')
    // ));
    return this.apiService
      .get(`${this.BASE_URL}/` + slug)
      .pipe(map(data => data.article));
  }

  destroy(slug: string) {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { body: ['can\'t be blank'] } })
    //   ));
    return this.apiService.delete(`${this.BASE_URL}/` + slug);
  }

  save(article: Article): Observable<Article> {
    // If we're updating an existing article
    if (article.slug) {
      return this.apiService
        .put(`${this.BASE_URL}/` + article.slug, { article: article })
        .pipe(map(data => data.article));

      // Otherwise, create a new article
    } else {
      return this.apiService
        .post(`${this.BASE_URL}/`, { article: article })
        .pipe(map(data => data.article));
    }
  }

  favorite(slug: string): Observable<{ article: Article }> {
    return this.apiService.post(`${this.BASE_URL}/` + slug + '/favorite');
    // return timer(2000).pipe(
    //   switchMap(_ => throwError('some error')
    //   ));
  }

  unfavorite(slug: string): Observable<{ article: Article }> {
    return this.apiService.delete(`${this.BASE_URL}/` + slug + '/favorite');
  }
}
