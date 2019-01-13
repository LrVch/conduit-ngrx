import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { Router } from '@angular/router';
import {
  ProfileActionTypes,
  ProfileToggleFollowingRequest,
  ProfileUnFollowingRequest,
  ProfileFollowingRequest,
  ProfileToggleFollowingSuccess,
  ProfileToggleFollowingFail,
  SetFollowingProfile,
  ClearFollowingProfile
} from './profile.actions';
import {
  retry,
  catchError,
  map,
  filter,
  mergeMap,
  withLatestFrom,
  tap,
  switchMap
} from 'rxjs/operators';
import { ProfilesService, Profile } from '../core';
import { of, Observable } from 'rxjs';
import { selectAuthLoggedIn } from '../auth/auth.selectors';
import {
  LogoutAction,
  ClearReturnStateFromRouteChange,
  AuthActionTypes,
  LoginSuccess
} from '../auth/auth.actions';
import { selectFollowingProfile } from './profile.selectors';
import { NotificationService } from '../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private profileService: ProfilesService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  @Effect()
  taggleFollowUserProfile$ = this.actions$.pipe(
    ofType<ProfileToggleFollowingRequest>(
      ProfileActionTypes.ProfileToggleFollowingRequest
    ),
    withLatestFrom(this.store.pipe(select(selectAuthLoggedIn))),
    mergeMap(
      ([action, isLoggedIn]): Observable<
        | ProfileUnFollowingRequest
        | ProfileFollowingRequest
        | SetFollowingProfile
      > => {
        if (!isLoggedIn) {
          return of(
            new SetFollowingProfile({ profile: action.payload.profile })
          );
        }
        const { profile } = action.payload;
        const { following } = profile;

        if (following) {
          return of(new ProfileUnFollowingRequest({ profile }));
        } else {
          return of(new ProfileFollowingRequest({ profile }));
        }
      }
    )
  );

  @Effect()
  setFollowingProfile$ = this.actions$.pipe(
    ofType<SetFollowingProfile>(ProfileActionTypes.SetFollowingProfile),
    map(() => new LogoutAction())
  );

  @Effect()
  clearReturnStateFromRouteChange$ = this.actions$.pipe(
    ofType<ClearReturnStateFromRouteChange>(
      AuthActionTypes.ClearReturnStateFromRouteChange
    ),
    map(() => new ClearFollowingProfile())
  );

  @Effect()
  loginSuccessProfile$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    withLatestFrom(this.store.pipe(select(selectFollowingProfile))),
    filter(([action, profile]) => !!profile),
    map(([action, profile]) => new ProfileFollowingRequest({ profile }))
  );

  @Effect()
  profileFollowing$ = this.actions$.pipe(
    ofType<ProfileFollowingRequest>(ProfileActionTypes.ProfileFollowingRequest),
    withLatestFrom(this.store.pipe(select(selectFollowingProfile))),
    mergeMap(([action, favoritingProfile]) => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.follow(username).pipe(
        map(result => {
          return new ProfileToggleFollowingSuccess({
            profile: result.profile,
            showNotification: !favoritingProfile
          });
        }),
        retry(3),
        catchError(error => {
          console.error(error);
          return of(
            new ProfileToggleFollowingFail({
              profile,
              showNotification: !favoritingProfile
            })
          );
        })
      );
    })
  );

  @Effect()
  profileUnFollowing$ = this.actions$.pipe(
    ofType<ProfileUnFollowingRequest>(
      ProfileActionTypes.ProfileUnFollowingRequest
    ),
    mergeMap(action => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.unfollow(username).pipe(
        map(result => {
          return new ProfileToggleFollowingSuccess({ profile: result.profile });
        }),
        retry(3),
        catchError(error => {
          console.error(error);
          return of(new ProfileToggleFollowingFail({ profile }));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  profileToggleFollowingSuccess$ = this.actions$.pipe(
    ofType<ProfileToggleFollowingSuccess>(
      ProfileActionTypes.ProfileToggleFollowingSuccess
    ),
    filter(action => action.payload.showNotification),
    map(action => action.payload.profile),
    switchMap((profile: Profile) =>
      this.translateService.get('conduit.profile.follow.succes', {
        value: profile.username
      })
    ),
    tap((notification: string) =>
      this.notificationService.default({ message: notification })
    )
  );

  @Effect({ dispatch: false })
  profileToggleFollowingFail$ = this.actions$.pipe(
    ofType<ProfileToggleFollowingFail>(
      ProfileActionTypes.ProfileToggleFollowingFail
    ),
    filter(action => action.payload.showNotification),
    map(action => action.payload.profile),
    switchMap((profile: Profile) =>
      this.translateService.get('conduit.profile.follow.fail', {
        value: profile.username
      })
    ),
    tap((notification: string) =>
      this.notificationService.error({ message: notification })
    )
  );
}
