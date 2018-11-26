import { TestBed, inject } from '@angular/core/testing';

import { ArticlesCashService } from './articles-cash.service';

describe('ArcitlesCashService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticlesCashService]
    });
  });

  it('should be created', inject([ArticlesCashService], (service: ArticlesCashService) => {
    expect(service).toBeTruthy();
  }));
});
