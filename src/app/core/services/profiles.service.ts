import { Injectable } from '@angular/core';
import { Observable, of, timer, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { Profile } from '@app/core/models';
import { map, switchMap, delay } from 'rxjs/operators';

@Injectable()
export class ProfilesService {
  BASE_URL = '/profiles/';

  constructor(
    private apiService: ApiService
  ) { }

  get(username: string): Observable<Profile> {
    return this.apiService.get(this.BASE_URL + username)
      .pipe(map((data: { profile: Profile }) => data.profile));
  }

  follow(username: string): Observable<{ profile: Profile }> {
    return this.apiService.post(this.BASE_URL + username + '/follow');
    // return of(null).pipe(
    //   delay(2000),
    //   switchMap(_ => throwError('Cannot load tags'))
    // );
  }

  unfollow(username: string): Observable<{ profile: Profile }> {
    return this.apiService.delete(this.BASE_URL + username + '/follow');
  }

}
