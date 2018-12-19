import { Injectable } from '@angular/core';
import { Observable, of, timer, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { Profile } from '../models';
import { map, switchMap } from 'rxjs/operators';

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
  }

  unfollow(username: string): Observable<{ profile: Profile }> {
    return this.apiService.delete(this.BASE_URL + username + '/follow');
  }

}
