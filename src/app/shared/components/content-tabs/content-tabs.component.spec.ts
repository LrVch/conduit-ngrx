import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { ContentTabsComponent } from './content-tabs.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';

describe('ContentTabsComponent', () => {
  let component: ContentTabsComponent;
  let fixture: ComponentFixture<ContentTabsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const event = {
    prevented: false,
    preventDefault() {
      this.prevented = true;
    }
  };

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [ContentTabsComponent],
        imports: [MaterialModule]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(ContentTabsComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      el = de.nativeElement;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "type" @Input', () => {
    expect(component.type).toBe('');
  });

  it('should has "tabs" @Input', () => {
    expect(component.tabs).toEqual([]);
  });

  it('should show "tabs" @Input', () => {
    component.tabs = [
      { title: 'tab1', value: '1' },
      { title: 'tab2', value: '2' }
    ];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();

    component.tabs = [{ title: 'tab1', value: '1' }];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();

    component.tabs = [];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should hightlight selected tab with primary color', () => {
    component.tabs = [
      { title: 'tab1', value: '1' },
      { title: 'tab2', value: '2' }
    ];
    component.type = '1';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should raises selectedType event when clicked (onTabClick) and select first tab', () => {
    let selectedTab: string;
    const expectedTab = '1';
    component.tabs = [
      { title: 'tab1', value: '1' },
      { title: 'tab2', value: '2' }
    ];
    component.selectedType.subscribe((tab: string) => (selectedTab = tab));

    fixture.detectChanges();

    const firstTab = de.query(By.css('button'));

    firstTab.triggerEventHandler('click', null);
    expect(selectedTab).toBe(expectedTab);
  });

  it("should'n raises selectedType event when clicked (onTabClick) if selected tab is equals to passed type", () => {
    let wasEmited = false;

    component.type = '1';
    component.tabs = [
      { title: 'tab1', value: '1' },
      { title: 'tab2', value: '2' }
    ];
    component.selectedType.subscribe((tab: string) => {
      wasEmited = !!tab;
    });

    fixture.detectChanges();

    const firstTab = de.query(By.css('button'));

    firstTab.triggerEventHandler('click', null);
    expect(wasEmited).toBeFalsy();
  });
});
