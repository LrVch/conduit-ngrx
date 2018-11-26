import { Injectable } from '@angular/core';
import { Observable, timer, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { Comment } from '../models';
import { map, switchMap } from 'rxjs/operators';


@Injectable()
export class CommentsService {
  constructor(
    private apiService: ApiService
  ) { }

  add(slug, payload): Observable<Comment> {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { body: ['can\'t be blank'] } })
    //   ));
    return this.apiService
      .post(
        `/articles/${slug}/comments`,
        { comment: { body: payload } }
      ).pipe(map(data => data.comment));
  }

  getAll(slug): Observable<Comment[]> {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { body: ['can\'t be blank'] } })
    //   ));
    return this.apiService.get(`/articles/${slug}/comments`)
      .pipe(map(data => data.comments));
  }

  destroy(commentId, articleSlug) {
    // return timer(2000).pipe(
    //   switchMap(_ => throwError({ errors: { removeError: ['comment cannot be deleted'] } })
    //   ));
    return this.apiService
      .delete(`/articles/${articleSlug}/comments/${commentId}`);
  }

}
