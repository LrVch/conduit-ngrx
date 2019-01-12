import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from './lib/testing';
import { AppComponent } from './app.component';
import {
  DebugElement,
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MainLoaderService } from './core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as fromRoot from './reducers';
import * as fromAuth from './auth/auth.reducer';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ShowMainLoader,
  HideMainLoader,
  LayoutActionTypes,
  ToggleSideNav
} from './layout/layout.actions';
import { cold } from 'jasmine-marbles';
import { Subject } from 'rxjs';
import { MaterialModule } from './shared';
import {
  AppSettingsChangeLanguage,
  AppSettingsChangeStickyHeader,
  AppSettingsChangeTheme,
  AppSettingsChangeHour,
  AppSettingsChangeAutoNightMode,
  AppSettingsChangeAsideOpenMode,
  AppSettingsChangeNightModeFrom,
  AppSettingsChangeNightModeTo,
  AppSettingsChangeRouteAnimationType,
  AppSettingsChangeRouteAnimationEnabled
} from './appSettings/app-settings.actions';
import { By } from '@angular/platform-browser';
import {
  DEFAULT_THEME,
  BLACK_THEME,
  BLUE_THEME
} from './core/models/app-settings.model';

const themes = [DEFAULT_THEME, BLUE_THEME, BLACK_THEME];

const themesViewValueMap = {
  [DEFAULT_THEME]: { value: 'purple', color: '#673ab7' },
  [BLACK_THEME]: { value: 'black', color: '#616161' },
  [BLUE_THEME]: { value: 'blue', color: '#1976d2' }
};

@Component({
  selector: 'app-header',
  template: `
    <div id="lang" (click)="onchangeLanguage()"></div>
    <div id="toggleNav" (click)="ontoggleSideNave()"></div>
  `
})
class TestHostHeaderComponent {
  @Input('user') user: any;
  @Input('loggedIn') loggedIn: any;
  @Input('showLoader') showLoader: any;
  @Input('languages') languages: any;
  @Input('language') language: any;
  @Output() changeLanguage = new EventEmitter();
  @Output() toggleSideNave = new EventEmitter();

  onchangeLanguage() {
    this.changeLanguage.emit('ru');
  }

  ontoggleSideNave() {
    this.toggleSideNave.emit();
  }
}

@Component({
  selector: 'app-footer',
  template: ``
})
class TestHostFooterComponent {}

@Component({
  selector: 'app-aside',
  template: `
    <div id="changeAnimType" (click)="onchangeRouteAnimationsType()"></div>
    <div id="stikyHeader" (click)="onchangeStickyHeader()"></div>
    <div id="asideOpenMode" (click)="onchangeAsideOpenMode()"></div>
    <div id="autoNightMode" (click)="onchangeAutoNightMode()"></div>
    <div id="from" (click)="onchangeAutoNightModeFrom()"></div>
    <div id="to" (click)="onchangeAutoNightModeTo()"></div>
    <div id="animationEnabled" (click)="onchangeRouteAnimationsEnable()"></div>
    <div id="changeTheme" (click)="onchangeTheme()"></div>
  `
})
class TestHostAisdeComponent {
  @Input('theme') theme: string;
  @Input('themes') themes: any;
  @Input('stickyHeader') stickyHeader: boolean;
  @Input('routeAnimationsEnabled') routeAnimationsEnabled: boolean;
  @Input('asideOpenMode') asideOpenMode: any;
  @Input('asideOpenModes') asideOpenModes: any;
  @Input('autoNightMode') autoNightMode: string;
  @Input('autoNightModeFrom') autoNightModeFrom: any;
  @Input('autoNightModeTo') autoNightModeTo: any;
  @Input('routeAnimateonsChangeType') routeAnimateonsChangeType: any;
  @Input('routeAnimateonsChangeTypes') routeAnimateonsChangeTypes: any;

  @Output() changeRouteAnimationsType = new EventEmitter();
  @Output() changeStickyHeader = new EventEmitter();
  @Output() changeAsideOpenMode = new EventEmitter();
  @Output() changeAutoNightMode = new EventEmitter();
  @Output() changeAutoNightModeFrom = new EventEmitter();
  @Output() changeAutoNightModeTo = new EventEmitter();
  @Output() changeRouteAnimationsEnable = new EventEmitter();
  @Output() changeTheme = new EventEmitter();

  onchangeRouteAnimationsType() {
    this.changeRouteAnimationsType.emit('SLIDE');
  }

  onchangeStickyHeader() {
    this.changeStickyHeader.emit(false);
  }

  onchangeAsideOpenMode() {
    this.changeAsideOpenMode.emit('push');
  }

  onchangeAutoNightMode() {
    this.changeAutoNightMode.emit(true);
  }

  onchangeAutoNightModeFrom() {
    this.changeAutoNightModeFrom.emit(14);
  }

  onchangeAutoNightModeTo() {
    this.changeAutoNightModeTo.emit(7);
  }

  onchangeRouteAnimationsEnable() {
    this.changeRouteAnimationsEnable.emit(false);
  }

  onchangeTheme() {
    this.changeTheme.emit('BLACK-THEME');
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let store: Store<fromAuth.AuthState>;
  let mainLoaderService: MainLoaderService;
  let resutlThemes: any[];

  class MockMainLoaderService {
    showLoader = new Subject<boolean>();
    showLoader$ = this.showLoader.asObservable();
  }

  beforeEach(async(() => {
    resutlThemes = themes.map(theme => {
      return {
        value: theme.toLowerCase(),
        viewValue: `conduit.menu.theme.${themesViewValueMap[theme].value}`,
        color: themesViewValueMap[theme].color
      };
    });
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          AppComponent,
          TestHostHeaderComponent,
          TestHostFooterComponent,
          TestHostAisdeComponent
        ],
        imports: [
          NoopAnimationsModule,
          MaterialModule,
          StoreModule.forRoot({
            ...fromRoot.reducers,
            feature: combineReducers(fromAuth.authReducer)
          }),
          RouterTestingModule
        ],
        providers: [
          { provide: MainLoaderService, useClass: MockMainLoaderService }
        ]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      store = testBed.get(Store);
      mainLoaderService = testBed.get(MainLoaderService);
      fixture.detectChanges();

      spyOn(store, 'dispatch').and.callThrough();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compile', () => {
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should dispatch "ShowMainLoader"', () => {
    mainLoaderService.showLoader.next(true);
    expect(store.dispatch).toHaveBeenCalledWith(new ShowMainLoader());
  });

  it('should dispatch "HideMainLoader"', () => {
    mainLoaderService.showLoader.next(false);
    expect(store.dispatch).toHaveBeenCalledWith(new HideMainLoader());
  });

  it('should get showMailLoader', () => {
    component.ngOnInit();

    const expected = cold('a', { a: false });

    expect(component.showMailLoader$).toBeObservable(expected);
  });

  it('should show aside', () => {
    store.dispatch(new ToggleSideNav());
    component.ngOnInit();

    fixture.detectChanges();

    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should sticky header', () => {
    component.ngOnInit();
    store.dispatch(new AppSettingsChangeStickyHeader({ stickyHeader: true }));

    fixture.detectChanges();

    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should change theme to black', () => {
    component.ngOnInit();
    store.dispatch(new AppSettingsChangeTheme({ theme: 'BLACK-THEME' }));

    fixture.detectChanges();

    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should get loggedIn', () => {
    component.ngOnInit();

    const expected = cold('a', { a: false });

    expect(component.loggedIn$).toBeObservable(expected);
  });

  it('should get user', () => {
    component.ngOnInit();

    const expected = cold('a', { a: null });

    expect(component.user$).toBeObservable(expected);
  });

  it('should get languages', () => {
    component.ngOnInit();

    const expected = cold('a', {
      a: [{ value: 'en', viewValue: 'en' }, { value: 'ru', viewValue: 'ru' }]
    });

    expect(component.languages$).toBeObservable(expected);
  });

  it('should get language', () => {
    component.ngOnInit();

    const expected = cold('a', { a: '' });

    expect(component.language$).toBeObservable(expected);

    store.dispatch(new AppSettingsChangeLanguage({ language: 'ru' }));

    const expected2 = cold('a', { a: 'ru' });

    expect(component.language$).toBeObservable(expected2);
  });

  it('should get sideNavOpen', () => {
    component.ngOnInit();

    const expected = cold('a', { a: false });

    expect(component.sideNavOpen$).toBeObservable(expected);
  });

  it('should get effectiveTheme', () => {
    component.ngOnInit();
    store.dispatch(new AppSettingsChangeAutoNightMode({ autoNightMode: true }));
    store.dispatch(new AppSettingsChangeHour({ hour: 22 }));

    const expected = cold('a', { a: 'black-theme' });

    expect(component.effectiveTheme$).toBeObservable(expected);
  });

  it('should get theme', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 'default-theme' });

    expect(component.theme$).toBeObservable(expected);
  });

  it('should get themes', () => {
    component.ngOnInit();
    const expected = cold('a', {
      a: resutlThemes
    });

    expect(component.themes$).toBeObservable(expected);
  });

  it('should get stickyHeader', () => {
    component.ngOnInit();

    const expected = cold('a', { a: true });

    expect(component.stickyHeader$).toBeObservable(expected);
  });

  it('should get asideOpenMode', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 'push' });

    expect(component.asideOpenMode$).toBeObservable(expected);
  });

  it('should get asideOpenModes', () => {
    component.ngOnInit();

    const expected = cold('a', {
      a: [
        {
          value: 'push',
          viewValue: `conduit.menu.general.asideOpen.push`
        },
        {
          value: 'over',
          viewValue: `conduit.menu.general.asideOpen.over`
        }
      ]
    });

    expect(component.asideOpenModes$).toBeObservable(expected);
  });

  it('should get autoNightMode', () => {
    component.ngOnInit();

    const expected = cold('a', { a: false });

    expect(component.autoNightMode$).toBeObservable(expected);
  });

  it('should get autoNightModeFrom', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 21 });

    expect(component.autoNightModeFrom$).toBeObservable(expected);
  });

  it('should get autoNightModeTo', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 7 });

    expect(component.autoNightModeTo$).toBeObservable(expected);
  });

  it('should get routeAnimateonsChangeType', () => {
    component.ngOnInit();

    const expected = cold('a', { a: 'SLIDE' });

    expect(component.routeAnimateonsChangeType$).toBeObservable(expected);
  });

  it('should get routeAnimateonsChangeTypes', () => {
    component.ngOnInit();

    const expected = cold('a', {
      a: [
        {
          value: 'SLIDE',
          viewValue: `conduit.menu.animations.route.type.${'SLIDE'.toLocaleLowerCase()}`
        },
        {
          value: 'FADE',
          viewValue: `conduit.menu.animations.route.type.${'FADE'.toLocaleLowerCase()}`
        }
      ]
    });

    expect(component.routeAnimateonsChangeTypes$).toBeObservable(expected);
  });

  it('should dispathch "AppSettingsChangeLanguage"', () => {
    const lang = de.query(By.css('#lang'));
    lang.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeLanguage({ language: 'ru' })
    );
  });

  it('should dispathch "ToggleSideNav"', () => {
    const nav = de.query(By.css('#toggleNav'));
    nav.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(new ToggleSideNav());
  });

  it('should dispathch "ToggleSideNav"', () => {
    const nav = de.query(By.css('#toggleNav'));
    fixture.detectChanges();
    nav.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(new ToggleSideNav());
    fixture.detectChanges();
    const drop = de.query(By.css('.mat-drawer-backdrop'));
    drop.triggerEventHandler('click', null);

    expect(store.dispatch).toHaveBeenCalledWith(new ToggleSideNav());
  });

  it('should dispathch "AppSettingsChangeTheme"', () => {
    const button = de.query(By.css('#changeTheme'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeTheme({ theme: 'BLACK-THEME' })
    );
  });

  it('should dispathch "AppSettingsChangeStickyHeader"', () => {
    const button = de.query(By.css('#stikyHeader'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeStickyHeader({ stickyHeader: false })
    );
  });

  it('should dispathch "AppSettingsChangeAsideOpenMode"', () => {
    const button = de.query(By.css('#asideOpenMode'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeAsideOpenMode({ asideOpenMode: 'push' })
    );
  });

  it('should dispathch "AppSettingsChangeAutoNightMode"', () => {
    const button = de.query(By.css('#autoNightMode'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeAutoNightMode({ autoNightMode: true })
    );
  });

  it('should dispathch "AppSettingsChangeNightModeFrom"', () => {
    const button = de.query(By.css('#from'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeNightModeFrom({ nightModefrom: 14 })
    );
  });

  it('should dispathch "AppSettingsChangeNightModeTo"', () => {
    const button = de.query(By.css('#to'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeNightModeTo({ nightModeto: 7 })
    );
  });

  it('should dispathch "AppSettingsChangeRouteAnimationType"', () => {
    const button = de.query(By.css('#changeAnimType'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeRouteAnimationType({
        routeAnimationsChangeType: 'SLIDE'
      })
    );
  });

  it('should dispathch "AppSettingsChangeRouteAnimationEnabled"', () => {
    const button = de.query(By.css('#animationEnabled'));
    fixture.detectChanges();
    button.triggerEventHandler('click', null);
    expect(store.dispatch).toHaveBeenCalledWith(
      new AppSettingsChangeRouteAnimationEnabled({
        routeAnimationEnabled: false
      })
    );
  });
});
