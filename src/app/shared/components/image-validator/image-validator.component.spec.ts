import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageValidatorComponent } from './image-validator.component';

describe('ImageValidatorComponent', () => {
  let component: ImageValidatorComponent;
  let fixture: ComponentFixture<ImageValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
