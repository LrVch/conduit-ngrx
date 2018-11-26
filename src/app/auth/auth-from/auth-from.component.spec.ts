import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFromComponent } from './auth-from.component';

describe('AuthFromComponent', () => {
  let component: AuthFromComponent;
  let fixture: ComponentFixture<AuthFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
