import { TestBed } from '@angular/core/testing';
import { MainLoaderService } from './main-loader.service';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { Subject } from 'rxjs';

describe('MainLoaderService', () => {
  let service: MainLoaderService;
  let router: Router;

  class MockRouter {
    events$ = new Subject<any>();
    events = this.events$.asObservable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MainLoaderService,
        { provide: Router, useClass: MockRouter },
      ]
    });

    service = TestBed.get(MainLoaderService);
    router = TestBed.get(Router);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should show main loader on event "NavigationStart"', done => {
    (<any>router).events$.next(new NavigationStart(0, ''));

    service.showLoader$.subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, done, done);
  });

  it('should hide main loader on event "NavigationEnd"', done => {
    service.showLoader.next(true);

    (<any>router).events$.next(new NavigationEnd(0, '', ''));

    service.showLoader$.subscribe(res => {
      expect(res).toBeFalsy();
      done();
    }, done, done);
  });

  it('should hide main loader on event "NavigationCancel"', done => {
    service.showLoader.next(true);

    (<any>router).events$.next(new NavigationCancel(0, '', ''));

    service.showLoader$.subscribe(res => {
      expect(res).toBeFalsy();
      done();
    }, done, done);
  });

  it('should hide main loader on event "NavigationError"', done => {
    service.showLoader.next(true);

    (<any>router).events$.next(new NavigationError(0, '', ''));

    service.showLoader$.subscribe(res => {
      expect(res).toBeFalsy();
      done();
    }, done, done);
  });
});
