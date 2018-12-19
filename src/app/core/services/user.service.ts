import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Credentials } from '../models/credentials.model';


@Injectable()
export class UserService {
  BASE_URL = '/user';

  constructor(
    private apiService: ApiService
  ) { }

  getUser(): Observable<{ user: User}> {
    return this.apiService.get(this.BASE_URL);
  }

  attemptAuth(type: string, credentials: Credentials): Observable<User> {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post(this.BASE_URL + route, { user: credentials })
      .pipe(
        map(data => {
          return data.user;
        })
      );
  }

  update(user: User): Observable<User> {
    return this.apiService
      .put(this.BASE_URL, { user })
      .pipe(map(data => {
        return data.user;
      }));
  }
}
