import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { map, delay, switchMap } from 'rxjs/operators';
import { pipe } from '@angular/core/src/render3/pipe';

@Injectable()
export class TagsService {
  BASE_URL = '/tags';
  constructor(private apiService: ApiService) {}

  getAll(): Observable<string[]> {
    return this.apiService.get(this.BASE_URL).pipe(map(data => data.tags));
    // trows error for test
    // .pipe(
    //   delay(2000),
    //   switchMap(_ => throwError('Cannot load tags'))
    // );
  }
}
