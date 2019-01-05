import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyTagsComponent } from './dummy-tags.component';

describe('DummyTagsComponent', () => {
  let component: DummyTagsComponent;
  let fixture: ComponentFixture<DummyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
