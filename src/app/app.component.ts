import { Component, ChangeDetectionStrategy, OnInit, NgZone, AfterViewChecked } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { selectShowMainLoader, selectSideNav } from './layout/layout.selectors';
import { User, MainLoaderService } from './core';
import { selectAuthLoggedIn, selectUser } from './auth/auth.selectors';
import { ShowMainLoader, HideMainLoader, ToggleSideNav } from './layout/layout.actions';
import { selectAppSettingsStateLanguage, selectAppSettingsStateLanguages, selectAppSettingsEffectiveTheme } from './appSettings/app-settings.selectors';
import { Language } from './core/models/app-settings.model';
import { AppSettingsChangeLanguage } from './appSettings/app-settings.actions';
import { map } from 'rxjs/operators';

export class Option {
  value: string;
  viewValue: string;
  constructor(language: string) {
    this.value = language;
    this.viewValue = language;
  }
}

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
  languages$: Observable<Option[]>;
  theme$: Observable<string>;

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
      map(langs => langs.map(lang => new Option(lang)))
    );

    this.user$ = this.store.pipe(select(selectUser));
    this.sideNavOpen$ = this.store.pipe(select(selectSideNav));

    this.theme$ = this.store.pipe(select(selectAppSettingsEffectiveTheme));
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
}
