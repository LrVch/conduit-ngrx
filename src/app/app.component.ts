import { Component, ChangeDetectionStrategy, OnInit, NgZone } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { selectShowMainLoader, selectSideNav } from './layout/layout.selectors';
import { User, MainLoaderService } from './core';
import { selectAuthLoggedIn, selectUser } from './auth/auth.selectors';
import { ShowMainLoader, HideMainLoader, ToggleSideNav } from './layout/layout.actions';
import {
  selectAppSettingsStateLanguage,
  selectAppSettingsStateLanguages,
  selectAppSettingsEffectiveTheme,
  selectAppSettingsThemes,
  selectAppSettingsStateAll,
  selectAppSettingsStickyHeader,
  selectAppSettingsAsideOpenMode,
  selectAppSettingsAsideOpenModes,
  selectAppSettingsAutoNightMode
} from './appSettings/app-settings.selectors';
import {
  Language,
  DEFAULT_THEME,
  BLACK_THEME,
  BLUE_THEME,
  AsideOpenMode
} from './core/models/app-settings.model';
import {
  AppSettingsChangeLanguage,
  AppSettingsChangeTheme,
  AppSettingsChangeStickyHeader,
  AppSettingsChangeAsideOpenMode,
  AppSettingsChangeAutoNightMode
} from './appSettings/app-settings.actions';
import { map, tap } from 'rxjs/operators';
import { Theme, AsideMode } from './shared';

export class LanguageOption {
  value: string;
  viewValue: string;
  constructor(language: string) {
    this.value = language;
    this.viewValue = language;
  }
}

const themesViewValueMap = {
  [DEFAULT_THEME]: { value: 'purple', color: '#673ab7' },
  [BLACK_THEME]: { value: 'black', color: '#616161' },
  [BLUE_THEME]: { value: 'blue', color: '#1976d2' }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  showMailLoader$: Observable<boolean>;
  loggedIn$: Observable<boolean>;
  user$: Observable<User>;
  sideNavOpen$: Observable<boolean>;

  language$ = this.store.pipe(select(selectAppSettingsStateLanguage));
  languages$: Observable<LanguageOption[]>;
  theme$: Observable<string>;
  themes$: Observable<Theme[]>;
  settings$: Observable<any>;
  stickyHeader$: Observable<boolean>;
  asideOpenMode$: Observable<AsideOpenMode>;
  asideOpenModes$: Observable<AsideMode[]>;
  autoNightMode$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private mainLoaderService: MainLoaderService,
    private ngZone: NgZone
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.mainLoaderService.showLoader$.subscribe(show => {
        if (show) {
          this.store.dispatch(new ShowMainLoader());
        } else {
          this.store.dispatch(new HideMainLoader());
        }
      });
    });
  }

  ngOnInit() {
    this.showMailLoader$ = this.store.pipe(select(selectShowMainLoader));

    this.loggedIn$ = this.store.pipe(
      select(selectAuthLoggedIn)
    );

    this.languages$ = this.store.pipe(select(selectAppSettingsStateLanguages)).pipe(
      map(langs => langs.map(lang => new LanguageOption(lang)))
    );

    this.user$ = this.store.pipe(select(selectUser));
    this.sideNavOpen$ = this.store.pipe(select(selectSideNav));

    this.theme$ = this.store.pipe(select(selectAppSettingsEffectiveTheme));
    this.themes$ = this.store.pipe(select(selectAppSettingsThemes)).pipe(
      map(themes => themes.map(theme => {
        return {
          value: theme.toLowerCase(),
          viewValue: `conduit.menu.theme.${themesViewValueMap[theme].value}`,
          color: themesViewValueMap[theme].color
        };
      })),
    );
    this.settings$ = this.store.pipe(select(selectAppSettingsStateAll));
    this.stickyHeader$ = this.store.pipe(select(selectAppSettingsStickyHeader));

    this.asideOpenMode$ = this.store.pipe(select(selectAppSettingsAsideOpenMode));
    this.asideOpenModes$ = this.store.pipe(select(selectAppSettingsAsideOpenModes)).pipe(
      map(modes => modes.map(mode => ({ value: mode, viewValue: `conduit.menu.general.asideOpen.${mode}` } as AsideMode))),
    );

    this.autoNightMode$ = this.store.pipe(select(selectAppSettingsAutoNightMode));
  }

  onChangeLanguage(language: Language) {
    this.store.dispatch(new AppSettingsChangeLanguage({ language }));
  }

  onToggleSideNave() {
    this.store.dispatch(new ToggleSideNav());
  }

  onCloseSideNave() {
    this.store.dispatch(new ToggleSideNav({ close: true }));
  }

  onChangeTheme(theme: string) {
    this.store.dispatch(new AppSettingsChangeTheme({ theme }));
  }

  onChangeStickyHeader(stickyHeader: boolean) {
    this.store.dispatch(new AppSettingsChangeStickyHeader({ stickyHeader }));
  }

  onChangeAsideOpenMode(asideOpenMode: AsideOpenMode) {
    this.store.dispatch(new AppSettingsChangeAsideOpenMode({ asideOpenMode }));
  }

  onChangeAutoNightMode(autoNightMode: boolean) {
    this.store.dispatch(new AppSettingsChangeAutoNightMode({ autoNightMode }));
  }
}
