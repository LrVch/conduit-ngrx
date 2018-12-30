
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { CommentsService } from './comments.service';
import { ApiService } from './api.service';
import { getComments, getComment } from '@app/lib/testing';

describe('CommentsService', () => {
  let service: CommentsService;
  let apiService: ApiService;

  class MockApiService {
    get = jest.fn();
    post = jest.fn();
    delete = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommentsService,
        { provide: ApiService, useValue: MockApiService }
      ]
    });

    service = TestBed.get(CommentsService);
    apiService = TestBed.get(ApiService);
  });

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should retreive all comments', () => {
    const slug = 'slug';
    const comments = getComments(3);
    const result = cold('-a|', { a: { comments } });
    const expected = cold('-b|', { b: comments });
    apiService.get = jest.fn(() => result);

    expect(service.getAll(slug)).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL}${slug}/comments`);
  });

  it('should add comment', () => {
    const slug = 'slug';
    const comment = getComment();
    const result = cold('-a|', { a: { comment } });
    const expected = cold('-b|', { b: comment });
    apiService.post = jest.fn(() => result);

    expect(service.add(slug, 'comment')).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL}${slug}/comments`);
  });

  it('should delete comment', () => {
    const slug = 'slug';
    const id = 1;
    const expected = cold('-a|', { a: {} });
    apiService.delete = jest.fn(() => expected);

    expect(service.destroy(id, slug)).toBeObservable(expected);
    expect(apiService.delete).toHaveBeenCalledWith(`${service.BASE_URL}${slug}/comments/${id}`);
  });
});
