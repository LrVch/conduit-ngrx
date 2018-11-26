import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  getUser(): string {
    return window.localStorage['user'];
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }

  saveUser(user: string) {
    window.localStorage['user'] = user;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  destroyUser() {
    window.localStorage.removeItem('user');
  }

  destroyUseData() {
    this.destroyToken();
    this.destroyUser();
  }
}
