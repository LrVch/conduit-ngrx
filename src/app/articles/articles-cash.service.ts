import { Injectable } from '@angular/core';
import * as schema from './schema';
import { normalize } from 'normalizr';
import { Article } from '@app/core';

export interface ResponseArticles {
  articles: Article[];
  articlesCount: number;
}

export interface NormalizedArticlesResponse {
  entities: {
    articles: {
      [key: string]: Article;
    };
  };
  result: {
    articles: string[];
    articlesCount: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesCashService {
  public static normalizeArticlesResponce(
    articles: ResponseArticles
  ): NormalizedArticlesResponse {
    return normalize(articles, schema.responceArticlesSchema);
  }

  constructor() {}
}
