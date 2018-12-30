import { ArticlesCashService, ResponseArticles, NormalizedArticlesResponse } from './articles-cash.service';
import { getArticle } from '@app/lib/testing';

describe('ArcitlesCashService', () => {
  it('should normalize data', () => {
    const articlesResponse: ResponseArticles = {
      articles: [
        getArticle('0'),
        getArticle('1')
      ],
      articlesCount: 2
    };
    const expected: NormalizedArticlesResponse = {
      entities: {
        articles: {
          '0': getArticle('0'),
          '1': getArticle('1')
        },
      },
      result: {
        articles: ['0', '1'],
        articlesCount: 2
      }
    };
    const result = ArticlesCashService.normalizeArticlesResponce(articlesResponse);
    expect(result).toEqual(expected);
  });
});
