import { async, ComponentFixture } from '@angular/core/testing';
import {
  ConfigureFn,
  configureTests,
  RouterLinkDirectiveStubDirective,
  getAuthErrors
} from '@app/lib/testing';
import { AuthComponent } from './auth.component';
import {
  DebugElement,
  Component,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Errors } from '@app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AuthPayload } from './auth-from/auth-from.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as Actions from './auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromAuth from './auth.reducer';
import { RouterTestingModule } from '@angular/router/testing';
import { ShowMainLoader } from '@app/layout/layout.actions';
import { hot, cold } from 'jasmine-marbles';
import { first } from 'rxjs/operators';

const payload: AuthPayload = {
  credentials: {
    email: 'email',
    password: 'password'
  },
  authType: 'login'
};

@Component({
  selector: 'app-auth-from',
  template: `
    <div (click)="submit()">a</div>
  `
})
class AuthFormComponent {
  @Input('authType') authType: string;
  @Output() submitForm = new EventEmitter<AuthPayload>();
  @Input('isSubmitting') isSubmitting: boolean;

  submit(): void {
    const authPayload: AuthPayload = payload;

    this.submitForm.emit(authPayload);
  }
}

@Component({
  selector: 'app-list-error',
  template: ``
})
class ListErrorComponent {
  @Input('errors') errors: Errors;
}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let de: DebugElement;
  let store: Store<fromAuth.AuthState>;
  let route: ActivatedRoute;
  let linkDes;
  let routerLinks;
  let router: Router;

  class UrlSegment {
    constructor(public path: string) {}
  }

  class MockRoute {
    setPath = new BehaviorSubject([new UrlSegment('login')]);
    url = this.setPath.asObservable();
  }

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          AuthComponent,
          AuthFormComponent,
          ListErrorComponent,
          RouterLinkDirectiveStubDirective
        ],
        imports: [
          NoopAnimationsModule,
          StoreModule.forRoot({
            ...fromRoot.reducers,
            feature: combineReducers(fromAuth.authReducer)
          }),
          RouterTestingModule
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useClass: MockRoute
          }
        ]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(AuthComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      store = testBed.get(Store);
      route = testBed.get(ActivatedRoute);
      router = testBed.get(Router);
      fixture.detectChanges();

      linkDes = de.queryAll(By.directive(RouterLinkDirectiveStubDirective));
      routerLinks = linkDes.map(deel =>
        deel.injector.get(RouterLinkDirectiveStubDirective)
      );

      spyOn(store, 'dispatch').and.callThrough();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compile and show "Need an account?" link', () => {
    component.authType$.subscribe(res => {
      (<any>expect(fixture)).toMatchSnapshot();
    });
  });

  it('should compile and show "Have an account?" link', () => {
    (<any>route).setPath.next([new UrlSegment('register')]);

    fixture.detectChanges();

    component.authType$.subscribe(res => {
      (<any>expect(fixture)).toMatchSnapshot();
    });
  });

  it('can get RouterLinks from template for login route', () => {
    fixture.detectChanges();

    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toEqual(['/register']);
  });

  it('can get RouterLinks from template for register route', done => {
    (<any>route).setPath.next([new UrlSegment('register')]);
    fixture.detectChanges();

    linkDes = de.queryAll(By.directive(RouterLinkDirectiveStubDirective));
    routerLinks = linkDes.map(deel =>
      deel.injector.get(RouterLinkDirectiveStubDirective)
    );

    component.authType$.subscribe(
      res => {
        expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
        expect(routerLinks[0].linkParams).toEqual(['/login']);
        done();
      },
      done,
      done
    );
  });

  it('should dispatch "LoginPageAttemptLogin" and "ShowMainLoader"', () => {
    const loginPageAttemptLogin = new Actions.LoginPageAttemptLogin(payload);
    const showMainLoader = new ShowMainLoader();

    const submitDe = de.query(By.css('app-auth-from')).query(By.css('div'));

    submitDe.triggerEventHandler('click', null);

    expect(store.dispatch).toHaveBeenCalledWith(loginPageAttemptLogin);
    expect(store.dispatch).toHaveBeenCalledWith(showMainLoader);
  });

  it('should dispatch a "LoginPageClearAuthErrors" to clear auth errors when created', () => {
    const action = new Actions.LoginPageClearAuthErrors();
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should get current route from Route', () => {
    component.authType$.pipe(first()).subscribe(res => {
      expect(res).toBe('login');
    });

    (<any>route).setPath.next([new UrlSegment('register')]);

    component.authType$.subscribe(res => {
      expect(res).toBe('register');
    });
  });

  it('should get title', () => {
    component.title$.pipe(first()).subscribe(res => {
      expect(res).toBe('Sign in');
    });

    (<any>route).setPath.next([new UrlSegment('register')]);

    component.title$.subscribe(res => {
      expect(res).toBe('Sign up');
    });
  });

  // Another way to test selected data from store
  // https://github.com/ngrx/platform/blob/master/docs/store/testing.md
  // it('should select isSubmitting', () => {
  //   const action = new Actions.LoginPageAttemptLogin(payload);

  //   store.dispatch(action);

  //   component.isSubmitting$.subscribe(res => {
  //     expect(res).toBeTruthy();
  //   });
  // });

  it('should select isSubmitting', () => {
    const spy = spyOn(store, 'pipe');

    spy.and.returnValue(hot('-a', { a: true }));

    component.ngOnInit();

    const expected = cold('-a', { a: true });

    expect(component.isSubmitting$).toBeObservable(expected);
  });

  it('should select authErrors', () => {
    const spy = spyOn(store, 'pipe');
    const errors = getAuthErrors();

    spy.and.returnValue(hot('-a', { a: errors }));

    component.ngOnInit();

    const expected = cold('-a', { a: errors });

    expect(component.authErrors$).toBeObservable(expected);
  });

  it('should dispatch a "ClearReturnStateFromRouteChange" to clear returnUrl', () => {
    const action = new Actions.ClearReturnStateFromRouteChange();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);

    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledWith(
      new Actions.LoginPageClearAuthErrors()
    );

    router.navigate(['/']);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
