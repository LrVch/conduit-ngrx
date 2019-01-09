import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests, getUser } from '@app/lib/testing';
import { SettingsComponent } from './settings.component';
import {
  DebugElement,
  Component,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as AuthActions from '@app/auth/auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromAuth from '@app/auth/auth.reducer';
import { hot, cold } from 'jasmine-marbles';
import { MaterialModule } from '@app/shared';
import { DialogService } from '@app/core/services/dialog.service';
import { User } from '@app/core';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-list-error',
  template: ``
})
class TestHostListErrorComponent {
  @Input('errors') errors: any;
}

@Component({
  selector: 'app-settings-form',
  template: `
    <div id="update" (click)="onUpdateUser()"></div>
    <div id="change" (click)="onWasChanged()"></div>
  `
})
class TestHostFrotmComponent {
  @Input('isSubmitting') isSubmitting: any;
  @Input('user') user: User = getUser();
  @Output() updateUser = new EventEmitter<any>();
  @Output() wasChanged = new EventEmitter<boolean>();

  onUpdateUser() {
    this.updateUser.emit(this.user);
  }

  onWasChanged() {
    this.wasChanged.emit(true);
  }
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let de: DebugElement;
  let store: Store<fromAuth.AuthState>;
  let user: User;
  let dialogService: DialogService;

  class MockDialogService {
    confirmation = jest.fn();
  }

  beforeEach(async(() => {
    user = getUser();
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          SettingsComponent,
          TestHostFrotmComponent,
          TestHostListErrorComponent
        ],
        imports: [
          MaterialModule,
          NoopAnimationsModule,
          StoreModule.forRoot({
            ...fromRoot.reducers,
            feature: combineReducers(fromAuth.authReducer)
          })
        ],
        providers: [
          {
            provide: DialogService,
            useClass: MockDialogService
          }
        ]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(SettingsComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      store = testBed.get(Store);
      fixture.detectChanges();

      dialogService = testBed.get(DialogService);

      spyOn(store, 'dispatch').and.callThrough();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compile', () => {
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should compile and show user @Input', () => {
    store.dispatch(new AuthActions.LoginSuccess({ user }));
    fixture.detectChanges();

    component.user$.subscribe(res => {
      (<any>expect(fixture)).toMatchSnapshot();
    });
  });

  it('should get user', () => {
    component.ngOnInit();

    const expected = cold('a', { a: null });

    expect(component.user$).toBeObservable(expected);
  });

  it('should get isUpdating', () => {
    component.ngOnInit();

    const expected = cold('a', { a: false });

    expect(component.isUpdating$).toBeObservable(expected);
  });

  it('should get errors', () => {
    component.ngOnInit();

    const expected = cold('a', { a: { errors: {} } });

    expect(component.errors$).toBeObservable(expected);
  });

  it('should dispatch "SettingsPageLogoutAction"', () => {
    component.logout();

    expect(store.dispatch).toHaveBeenCalledWith(
      new AuthActions.SettingsPageLogoutAction({
        question: 'Are you sure you want to quit?'
      })
    );
  });

  it('should dispatch "UpdateUserRequest"', () => {
    store.dispatch(new AuthActions.LoginSuccess({ user }));
    expect(store.dispatch).toHaveBeenCalledWith(
      new AuthActions.LoginSuccess({ user })
    );

    fixture.detectChanges();

    component.ngOnInit();

    const updateDe = de
      .query(By.css('app-settings-form'))
      .query(By.css('#update'));

    updateDe.triggerEventHandler('click', null);

    expect(store.dispatch).toHaveBeenCalledWith(
      new AuthActions.UpdateUserRequest({ user })
    );
  });

  it('should set wasChanged to true', () => {
    store.dispatch(new AuthActions.LoginSuccess({ user }));
    expect(store.dispatch).toHaveBeenCalledWith(
      new AuthActions.LoginSuccess({ user })
    );

    fixture.detectChanges();

    const updateDe = de
      .query(By.css('app-settings-form'))
      .query(By.css('#change'));

    updateDe.triggerEventHandler('click', null);

    expect(component.wasChanged).toBeTruthy();
  });

  it("shouldn't show dialog", () => {
    component.wasChanged = false;

    expect(component.canDeactivate()).toBeTruthy();
    expect(dialogService.confirmation).not.toHaveBeenCalled();
  });

  it('should show dialog and return true', () => {
    component.wasChanged = true;
    dialogService.confirmation = jest.fn(() => ({
      afterClosed() {
        return of(true);
      }
    }));

    (<Observable<boolean>>component.canDeactivate()).subscribe(res => {
      expect(res).toBeTruthy();
    });
    expect(dialogService.confirmation).toHaveBeenCalledWith({
      data: { question: "You'll lost the data you have changed!" }
    });
  });

  it('should show dialog and return true', () => {
    component.wasChanged = true;
    dialogService.confirmation = jest.fn(() => ({
      afterClosed() {
        return of(false);
      }
    }));

    (<Observable<boolean>>component.canDeactivate()).subscribe(res => {
      expect(res).toBeFalsy();
    });
    expect(dialogService.confirmation).toHaveBeenCalledWith({
      data: { question: "You'll lost the data you have changed!" }
    });
  });
});
