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
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService
  ) { }

  getUser(): Observable<{ user: User}> {
    return this.apiService.get('/user');
  }

  attemptAuth(type: string, credentials: Credentials): Observable<User> {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post('/users' + route, { user: credentials })
      .pipe(
        map(data => {
          return data.user;
        })
      );
  }

  update(user: User): Observable<User> {
    return this.apiService
      .put('/user', { user })
      .pipe(map(data => {
        // Update the currentUser observable
        this.currentUserSubject.next(data.user);
        return data.user;
      }));
  }
}
