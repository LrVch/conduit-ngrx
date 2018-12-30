
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { ArticlesService } from './articles.service';
import { ApiService } from './api.service';
import { getUser, getCredentials, getArticles, getArticle } from '@app/lib/testing';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let apiService: ApiService;

  class MockApiService {
    get = jest.fn();
    post = jest.fn();
    put = jest.fn();
    delete = jest.fn();
  }

  let configLogged;
  let configUnLogged;

  beforeEach(() => {
    configLogged = {
      type: 'feed',
      filters: {}
    };
    configUnLogged = {
      type: '',
      filters: {}
    };
    TestBed.configureTestingModule({
      providers: [
        ArticlesService,
        { provide: ApiService, useValue: MockApiService }
      ]
    });

    service = TestBed.get(ArticlesService);
    apiService = TestBed.get(ApiService);
  });

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should retrive article according the query for logged in user', () => {
    const articles = getArticles(3);
    const expected = cold('-a|', { a: { articles } });
    apiService.get = jest.fn(() => expected);

    expect(service.query(configLogged)).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL}/${configLogged.type}`, new HttpParams({ fromObject: {} }));
  });

  it('should retrive article according the query for  not logged in user', () => {
    const articles = getArticles(3);
    const expected = cold('-a|', { a: { articles } });
    apiService.get = jest.fn(() => expected);

    expect(service.query(configUnLogged)).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL}`, new HttpParams({ fromObject: {} }));
  });

  it('should retreive an article', () => {
    const slug = 'slug';
    const article = getArticle();
    const result = cold('-a|', { a: { article } });
    const expected = cold('-a|', { a: article });
    apiService.get = jest.fn(() => result);

    expect(service.get(slug)).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL}/${slug}`);
  });

  it('should destroy an article', () => {
    const slug = 'slug';
    const expected = cold('-a|', { a: {} });
    apiService.delete = jest.fn(() => expected);

    expect(service.destroy(slug)).toBeObservable(expected);
    expect(apiService.delete).toHaveBeenCalledWith(`${service.BASE_URL}/${slug}`);
  });

  it('should create new article', () => {
    const article = getArticle();
    delete article.slug;
    const result = cold('-a|', { a: { article } });
    const expected = cold('-a|', { a: article });
    apiService.post = jest.fn(() => result);

    expect(service.save(article)).toBeObservable(expected);
    expect(apiService.post).toHaveBeenCalledWith(`${service.BASE_URL}/`, { article });
  });

  it('should update an existing article', () => {
    const article = getArticle();
    const result = cold('-a|', { a: { article } });
    const expected = cold('-a|', { a: article });
    apiService.put = jest.fn(() => result);

    expect(service.save(article)).toBeObservable(expected);
    expect(apiService.put).toHaveBeenCalledWith(`${service.BASE_URL}/${article.slug}`, { article });
  });

  it('should favorite an article', () => {
    const slug = 'slug';
    const article = getArticle();
    const expected = cold('-a|', { a: { article } });
    apiService.post = jest.fn(() => expected);

    expect(service.favorite(slug)).toBeObservable(expected);
    expect(apiService.post).toHaveBeenCalledWith(`${service.BASE_URL}/${article.slug}/favorite`);
  });

  it('should unfavorite an article', () => {
    const slug = 'slug';
    const article = getArticle();
    const expected = cold('-a|', { a: { article } });
    apiService.delete = jest.fn(() => expected);

    expect(service.unfavorite(slug)).toBeObservable(expected);
    expect(apiService.delete).toHaveBeenCalledWith(`${service.BASE_URL}/${article.slug}/favorite`);
  });
});
