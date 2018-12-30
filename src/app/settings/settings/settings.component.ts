import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/reducers';
import { Store, select } from '@ngrx/store';
import { SettingsPageLogoutAction, UpdateUserRequest, ClearAuthErrors } from '@app/auth/auth.actions';
import { Observable } from 'rxjs';
import { Errors, User } from '@app/core';
import { selectUser, selectAuthErrors, selectUserUpdatingInfo } from '@app/auth/auth.selectors';
import { CanComponentDeactivate } from '@app/core/services/can-deactivate.guard';
import { DialogService } from '@app/core/services/dialog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, CanComponentDeactivate {
  errors$: Observable<Errors>;
  isUpdating$: Observable<boolean>;
  user$: Observable<User>;
  wasChanged = false;

  constructor(
    private store: Store<AppState>,
    private dialog: DialogService
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

  onWasChanged(wasChanged: boolean) {
    this.wasChanged = wasChanged;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.wasChanged) {
      return true;
    }

    const dialogRef = this.dialog.confirmation({
      data: { question: 'You\'ll lost the data you have changed!' },
    });

    return dialogRef.afterClosed();
  }
}
