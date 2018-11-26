import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ArticlesEffects } from './articles.effects';

describe('ArticlesEffects', () => {
  let actions$: Observable<any>;
  let effects: ArticlesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArticlesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ArticlesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
