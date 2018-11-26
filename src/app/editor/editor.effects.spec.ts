import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { EditorEffects } from './editor.effects';

describe('EditorEffects', () => {
  let actions$: Observable<any>;
  let effects: EditorEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditorEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(EditorEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
