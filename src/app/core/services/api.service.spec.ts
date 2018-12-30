import { inject, TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '@env/environment';
import { HttpTokenInterceptor } from '@app/core/interceptors';
import { JwtService } from './jwt.service';

describe('ApiService', () => {
  let service: ApiService;
  let backend: HttpTestingController;
  let jwtService: JwtService;
  const token = 'token';

  const expectedData = {
    id: 1,
    name: 'Test hero',
  };

  class MockJWTService {
    getToken = jest.fn();
  }

  const testUlr = '/testUrl';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ApiService,
        { provide: JwtService, useClass: MockJWTService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpTokenInterceptor,
          multi: true,
        }
      ],
    });

    backend = TestBed.get(HttpTestingController);
    service = TestBed.get(ApiService);
    jwtService = TestBed.get(JwtService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(inject([HttpTestingController], (_backend: HttpTestingController) => {
    _backend.verify();
  }));

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should call the GET method api and return all result', () => {
    let actualData = {};

    service.get(testUlr).subscribe(data => actualData = data);

    backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'GET';
    }, `GET results data from ${testUlr}`)
      .flush(expectedData);

    expect(actualData).toEqual(expectedData);
  });

  it(`should call the GET method api set Authorization, Content-Type, Accept headers and return result`, () => {
    let actualData = {};

    jwtService.getToken = jest.fn(() => token);

    service.get(testUlr).subscribe(data => actualData = data);

    const httpRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'GET';
    }, `GET results data from ${testUlr}`);

    httpRequest.flush(expectedData);

    expect(httpRequest.request.headers.has('Authorization'));
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Token ${token}`);

    expect(httpRequest.request.headers.has('Content-Type'));
    expect(httpRequest.request.headers.get('Content-Type')).toBe(`application/json`);

    expect(httpRequest.request.headers.has('Accept'));
    expect(httpRequest.request.headers.get('Accept')).toBe(`application/json`);

    expect(actualData).toEqual(expectedData);
  });

  it('should send an expected GET request and throw error to console when an error occurs', done => {
    const emsg = 'simulated network error';

    service.get(testUlr).subscribe(
      () => {
        fail('should have failed with the simulated network error');
        done();
      },
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(emsg);
        done();
      }, done
    );

    const getRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'GET';
    }, `GET data from ${testUlr}`);

    const mockError = new ErrorEvent('Network error', {
      message: emsg,
    });

    getRequest.error(mockError);

    expect(console.error).toHaveBeenCalled();
  });

  it('should call the PUT method api and return result', () => {
    let actualData = {};

    service.put(testUlr, expectedData).subscribe(data => actualData = data);

    backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'PUT';
    }, `PUT result data from ${testUlr}`)
      .flush(expectedData);

    expect(actualData).toEqual(expectedData);
  });

  it('should call the PUT method api set Authorization, Content-Type, Accept headers and return result', () => {
    let actualData = {};

    jwtService.getToken = jest.fn(() => token);

    service.put(testUlr, expectedData).subscribe(data => actualData = data);

    const httpRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'PUT';
    }, `PUT result data from ${testUlr}`);

    httpRequest.flush(expectedData);

    expect(httpRequest.request.headers.has('Authorization'));
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Token ${token}`);

    expect(httpRequest.request.headers.has('Content-Type'));
    expect(httpRequest.request.headers.get('Content-Type')).toBe(`application/json`);

    expect(httpRequest.request.headers.has('Accept'));
    expect(httpRequest.request.headers.get('Accept')).toBe(`application/json`);

    expect(actualData).toEqual(expectedData);
  });

  it('should send an expected PUT request and throw error to console when an error occurs', done => {
    const emsg = 'simulated network error';

    service.put(testUlr, expectedData).subscribe(
      () => {
        fail('should have failed with the simulated network error');
        done();
      },
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(emsg);
        done();
      }, done
    );

    const getRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'PUT';
    }, `PUT data from ${testUlr}`);

    const mockError = new ErrorEvent('Network error', {
      message: emsg,
    });

    getRequest.error(mockError);

    expect(console.error).toHaveBeenCalled();
  });

  it('should call the POST method api and return result', () => {
    let actualData = {};

    service.post(testUlr, {}).subscribe(data => actualData = data);

    backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'POST';
    }, `POST result data from ${testUlr}`)
      .flush(expectedData);

    expect(actualData).toEqual(expectedData);
  });

  it('should call the POST method api set Authorization, Content-Type, Accept headers and return result', () => {
    let actualData = {};

    jwtService.getToken = jest.fn(() => token);

    service.post(testUlr, {}).subscribe(data => actualData = data);

    const httpRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'POST';
    }, `POST result data from ${testUlr}`);

    httpRequest.flush(expectedData);

    expect(httpRequest.request.headers.has('Authorization'));
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Token ${token}`);

    expect(httpRequest.request.headers.has('Content-Type'));
    expect(httpRequest.request.headers.get('Content-Type')).toBe(`application/json`);

    expect(httpRequest.request.headers.has('Accept'));
    expect(httpRequest.request.headers.get('Accept')).toBe(`application/json`);

    expect(actualData).toEqual(expectedData);
  });

  it('should send an expected POST request and throw error to console when an error occurs', done => {
    const emsg = 'simulated network error';

    service.post(testUlr, expectedData).subscribe(
      () => {
        fail('should have failed with the simulated network error');
        done();
      },
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(emsg);
        done();
      }, done
    );

    const getRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'POST';
    }, `POST data from ${testUlr}`);

    const mockError = new ErrorEvent('Network error', {
      message: emsg,
    });

    getRequest.error(mockError);

    expect(console.error).toHaveBeenCalled();
  });

  it('should call the DELETE method api', () => {
    let wasDeleted = false;
    service.delete(testUlr).subscribe(() => wasDeleted = true);

    backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'DELETE';
    }, `DELETE result data from ${testUlr}`)
      .flush(expectedData);

    expect(wasDeleted).toBeTruthy();
  });

  it('should call the DELETE method api set Authorization, Content-Type, Accept headers', () => {
    let wasDeleted = false;

    jwtService.getToken = jest.fn(() => token);

    service.delete(testUlr).subscribe(() => wasDeleted = true);

    const httpRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'DELETE';
    }, `DELETE result data from ${testUlr}`)

    httpRequest.flush(expectedData);

    expect(httpRequest.request.headers.has('Authorization'));
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Token ${token}`);

    expect(httpRequest.request.headers.has('Content-Type'));
    expect(httpRequest.request.headers.get('Content-Type')).toBe(`application/json`);

    expect(httpRequest.request.headers.has('Accept'));
    expect(httpRequest.request.headers.get('Accept')).toBe(`application/json`);

    expect(wasDeleted).toBeTruthy();
  });

  it('should send an expected DELETE request and throw error to console when an error occurs', done => {
    const emsg = 'simulated network error';

    service.delete(testUlr).subscribe(
      () => {
        fail('should have failed with the simulated network error');
        done();
      },
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(emsg);
        done();
      }, done
    );

    const getRequest = backend.expectOne((req: HttpRequest<any>) => {
      return req.url === `${environment.api_url}${testUlr}`
        && req.method === 'DELETE';
    }, `DELETE data from ${testUlr}`);

    const mockError = new ErrorEvent('Network error', {
      message: emsg,
    });

    getRequest.error(mockError);

    expect(console.error).toHaveBeenCalled();
  });
});
