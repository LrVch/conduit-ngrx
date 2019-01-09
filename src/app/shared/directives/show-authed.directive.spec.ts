import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { ShowAuthedDirective } from './show-authed.directive';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as Actions from '@app/auth/auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromAuth from '@app/auth/auth.reducer';
import { getUser, getAuthErrors } from '@app/lib/testing';
import {
  Component,
  TemplateRef,
  ViewContainerRef,
  DebugElement
} from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-test-host',
  template: `
    <div class="test-host" *appShowAuthed="false">content</div>
  `
})
class TestHostComponent {}

describe('NoAuthGuard', () => {
  let component: TestHostComponent;
  let store: Store<fromAuth.AuthState>;
  let fixture: ComponentFixture<TestHostComponent>;
  let de: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, ShowAuthedDirective],
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromAuth.authReducer)
        })
      ],
      providers: [TemplateRef, ViewContainerRef]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture.detectChanges();
  });

  it('should create TestHostComponent', () => {
    expect(component).toBeTruthy();
  });

  it("should show element if user isn't logged in", () => {
    const authErrors = getAuthErrors();
    const action = new Actions.LoginFail({ authErrors });

    store.dispatch(action);

    const element = de.query(By.css('.test-host'));

    expect(element).not.toBeNull();
  });

  it('should hide element if user is logged in', () => {
    const user = getUser();
    const action = new Actions.LoginSuccess({ user });

    store.dispatch(action);

    const element = de.query(By.css('.test-host'));

    expect(element).toBeNull();
  });
});
