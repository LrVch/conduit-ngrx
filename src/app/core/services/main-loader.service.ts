import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MainLoaderService {
  showLoader = new BehaviorSubject<boolean>(false);
  showLoader$ = this.showLoader.asObservable();

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {
    this.ngZone.runOutsideAngular(() => {
      router.events.subscribe((event: RouterEvent) => {
        this.navigationInterceptor(event);
      });
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showLoader.next(true);
    }
    if (event instanceof NavigationEnd) {
      this.showLoader.next(false);
    }
    if (event instanceof NavigationCancel) {
      this.showLoader.next(false);
    }
    if (event instanceof NavigationError) {
      this.showLoader.next(false);
    }
  }
}
