import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { SettingsPageLogoutAction, UpdateUserRequest, ClearAuthErrors } from 'src/app/auth/auth.actions';
import { Observable } from 'rxjs';
import { Errors, User } from 'src/app/core';
import { selectUser, selectAuthErrors, selectUserUpdatingInfo } from 'src/app/auth/auth.selectors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  errors$: Observable<Errors>;
  isUpdating$: Observable<boolean>;
  user$: Observable<User>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.user$ = this.store.pipe(select(selectUser));
    this.isUpdating$ = this.store.pipe(select(selectUserUpdatingInfo));
    this.errors$ = this.store.pipe(select(selectAuthErrors));

    this.store.dispatch(new ClearAuthErrors());
  }

  logout() {
    this.store.dispatch(new SettingsPageLogoutAction({ question: 'Are you sure you want to quit?' }));
  }

  onUpdateUser(user: User) {
    this.store.dispatch(new UpdateUserRequest({ user }));
  }
}
