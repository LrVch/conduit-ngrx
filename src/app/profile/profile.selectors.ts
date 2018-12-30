import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { ProfileState } from './profile.reducer';

export const selectProfileState = createFeatureSelector<AppState, ProfileState>('profile');

export const selectProfile = createSelector(
  selectProfileState,
  (profileState: ProfileState) => profileState.profile
);

export const selectProfileUsername = createSelector(
  selectProfileState,
  (profileState: ProfileState) => profileState.profile && profileState.profile.username
);

export const selectFollowingProfile = createSelector(
  selectProfileState,
  (profileState: ProfileState) => profileState.followingProfile
);
