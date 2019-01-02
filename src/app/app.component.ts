import { Component, ChangeDetectionStrategy, OnInit, NgZone, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { selectShowMainLoader, selectSideNav } from './layout/layout.selectors';
import { User, MainLoaderService } from './core';
import { selectAuthLoggedIn, selectUser } from './auth/auth.selectors';
import { ShowMainLoader, HideMainLoader, ToggleSideNav } from './layout/layout.actions';
import { selectAppSettingsStateLanguage } from './appSettings/app-settings.selectors';
import { Language } from './core/models/app-settings.model';
import { AppSettingsChangeLanguage } from './appSettings/app-settings.actions';

export interface Option {
  value: string;
  viewValue: string;
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
  languages: Option[] = [
    {value: 'en', viewValue: 'en'},
    {value: 'ru', viewValue: 'ru'}
  ];

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

    this.user$ = this.store.pipe(select(selectUser));
    this.sideNavOpen$ = this.store.pipe(select(selectSideNav));
  }

  onChangeLanguage(language: Language) {
    this.store.dispatch(new AppSettingsChangeLanguage({ language }));
  }

  onToggleSideNave() {
    this.store.dispatch(new ToggleSideNav());
  }
}
