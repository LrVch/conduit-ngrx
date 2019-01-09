import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { User } from '@app/core/models';
import { map } from 'rxjs/operators';
import { Credentials } from '@app/core/models/credentials.model';

@Injectable()
export class UserService {
  BASE_URL_USER = '/user';
  BASE_URL_USERS = '/users';

  constructor(private apiService: ApiService) {}

  getUser(): Observable<{ user: User }> {
    return this.apiService.get(this.BASE_URL_USER);
  }

  attemptAuth(type: string, credentials: Credentials): Observable<User> {
    const route = type === 'login' ? '/login' : '';
    return this.apiService
      .post(this.BASE_URL_USERS + route, { user: credentials })
      .pipe(
        map(data => {
          return data.user;
        })
      );
  }

  update(user: User): Observable<User> {
    return this.apiService.put(this.BASE_URL_USER, { user }).pipe(
      map(data => {
        return data.user;
      })
    );
  }
}
