import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  private formatErrors(error: any, path: string, method: string) {
    console.error(`${method} failed due to ${error.message} path ${path}`);
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(error => this.formatErrors(error, path, 'GET')));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(error => this.formatErrors(error, path, 'PUT')));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(error => this.formatErrors(error, path, 'POST')));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(error => this.formatErrors(error, path, 'DELETE')));
  }
}
