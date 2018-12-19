import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  TOKEN_KEY = 'conduit_jwt_token';
  USER_KEY = 'user';

  getToken(): string {
    return window.localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): string {
    return window.localStorage.getItem(this.USER_KEY);
  }

  saveToken(token: string) {
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  saveUser(user: string) {
    window.localStorage.setItem(this.USER_KEY, user);
  }

  destroyToken() {
    window.localStorage.removeItem(this.TOKEN_KEY);
  }

  destroyUser() {
    window.localStorage.removeItem(this.USER_KEY);
  }

  destroyUseData() {
    this.destroyToken();
    this.destroyUser();
  }
}
