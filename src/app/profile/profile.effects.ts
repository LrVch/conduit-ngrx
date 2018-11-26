import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router } from '@angular/router';
import {
  ProfileActionTypes,
  ProfileLoadRequest,
  ProfileLoadSuccess,
  ProfileLoadFail,
  ProfileToggleFollowingRequest,
  ProfileUnFollowingRequest,
  ProfileFollowingRequest,
  ProfileToggleFollowingSuccess,
  ProfileToggleFollowingFail
} from './profile.actions';
import { switchMap, retry, catchError, finalize, tap, map, filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ProfilesService } from '../core';
import { of, Observable } from 'rxjs';
import { selectAuthLoggedIn } from '../auth/auth.selectors';
import { LogoutAction } from '../auth/auth.actions';


@Injectable()
export class ProfileEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private profileService: ProfilesService
  ) { }

  @Effect()
  taggleFollowUser$ = this.actions$.pipe(
    ofType<ProfileToggleFollowingRequest>(ProfileActionTypes.ProfileToggleFollowingRequest),
    withLatestFrom(this.store.select(selectAuthLoggedIn)),
    mergeMap(([action, isLoggedIn]): Observable<ProfileUnFollowingRequest | ProfileFollowingRequest  | LogoutAction> => {
      if (!isLoggedIn) {
        return of(new LogoutAction());
      }
      const { profile } = action.payload;
      const { following } = profile;

      if (following) {
        return of(new ProfileUnFollowingRequest({ profile }));
      } else {
        return of(new ProfileFollowingRequest({ profile }));
      }
    })
  );

  @Effect()
  profileFollowing$ = this.actions$.pipe(
    ofType<ProfileFollowingRequest>(ProfileActionTypes.ProfileFollowingRequest),
    mergeMap(action => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.follow(username)
        .pipe(
        map(result => {
          return new ProfileToggleFollowingSuccess({ profile: result.profile });
        }),
        retry(3),
        catchError(error => {
          console.error(error);
          return of(new ProfileToggleFollowingFail());
        })
      );
    })
  );

  @Effect()
  profileUnFollowing$ = this.actions$.pipe(
    ofType<ProfileUnFollowingRequest>(ProfileActionTypes.ProfileUnFollowingRequest),
    mergeMap(action => {
      const { profile } = action.payload;
      const { username } = profile;

      return this.profileService.unfollow(username)
        .pipe(
        map(result => {
          return new ProfileToggleFollowingSuccess({ profile: result.profile });
        }),
        retry(3),
        catchError(error => {
          console.error(error);
          return of(new ProfileToggleFollowingFail());
        })
      );
    })
  );
}
