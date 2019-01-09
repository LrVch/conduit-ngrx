import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { TagListComponent } from './tag-list.component';

describe('TagListComponent', () => {
  let component: TagListComponent;
  let fixture: ComponentFixture<TagListComponent>;

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [TagListComponent]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(TagListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "tagList" @Input', () => {
    expect(component.tagList).toEqual([]);
  });

  it(`should render list of tagList @Input`, () => {
    component.tagList = ['one', 'two', 'three'];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    component.tagList = ['one'];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    component.tagList = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    component.tagList = [''];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
