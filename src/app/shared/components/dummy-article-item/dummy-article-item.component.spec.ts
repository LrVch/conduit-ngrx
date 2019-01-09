import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyArticleItemComponent } from './dummy-article-item.component';

describe('DummyArticleItemComponent', () => {
  let component: DummyArticleItemComponent;
  let fixture: ComponentFixture<DummyArticleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DummyArticleItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyArticleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
