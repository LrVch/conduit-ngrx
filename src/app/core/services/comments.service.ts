import { Injectable } from '@angular/core';
import { Observable, timer, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { Comment } from '../models';
import { map, switchMap } from 'rxjs/operators';


@Injectable()
export class CommentsService {
  readonly BASE_URL = '/articles/';

  constructor(
    private apiService: ApiService
  ) { }

  add(slug: string, payload: string): Observable<Comment> {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { body: ['can\'t be blank'] } })
    //   ));
    return this.apiService
      .post(
        `${this.BASE_URL}${slug}/comments`,
        { comment: { body: payload } }
      ).pipe(map(data => data.comment));
  }

  getAll(slug: string): Observable<Comment[]> {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { body: ['can\'t be blank'] } })
    //   ));
    return this.apiService.get(`${this.BASE_URL}${slug}/comments`)
      .pipe(map(data => data.comments));
  }

  destroy(commentId: number, articleSlug: string) {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { removeError: ['comment cannot be deleted'] } })
    //   ));
    return this.apiService
      .delete(`${this.BASE_URL}${articleSlug}/comments/${commentId}`);
  }

}
