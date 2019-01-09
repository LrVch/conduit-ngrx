import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { TagsService } from './tags.service';
import { ApiService } from './api.service';

describe('TagsService', () => {
  let service: TagsService;
  let apiService: ApiService;

  class MockApiService {
    get = jest.fn();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagsService,
        { provide: ApiService, useValue: MockApiService }
      ]
    });

    service = TestBed.get(TagsService);
    apiService = TestBed.get(ApiService);
  });

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should get all tags', () => {
    const tags = ['one', 'two', 'three'];
    const result = cold('-a|', { a: { tags } });
    const expected = cold('-b|', { b: tags });
    apiService.get = jest.fn(() => result);

    expect(service.getAll()).toBeObservable(expected);
    expect(apiService.get).toHaveBeenCalledWith(`${service.BASE_URL}`);
  });
});
