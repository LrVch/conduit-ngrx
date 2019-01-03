import { Action } from '@ngrx/store';
import { Profile } from '@app/core';

export enum ProfileActionTypes {
  ProfileLoadRequest = '[Profile] Profile Load Request',
  ProfileLoadSuccess = '[Profile] Profile Load Success',
  ProfileLoadFail = '[Profile] Profile Load Fail',
  ProfileClear = '[Profile] Profile Clear',

  ProfileToggleFollowingRequest = '[Profile] Profile Toggle Following Request',
  ProfileToggleFollowingSuccess = '[Profile] Profile Toggle Following Success',
  ProfileToggleFollowingFail = '[Profile] Profile Toggle Following Fail',
  ProfileFollowingRequest = '[Profile] Profile Following Request',
  ProfileUnFollowingRequest = '[Profile] Profile UnFollowing Request',

  SetFollowingProfile = '[Profile] Set Following Profile',
  ClearFollowingProfile = '[Profile] Clear Following Profile'
}

export class ProfileLoadRequest implements Action {
  readonly type = ProfileActionTypes.ProfileLoadRequest;

  constructor(public payload: { username: string }) { }
}

export class ProfileLoadSuccess implements Action {
  readonly type = ProfileActionTypes.ProfileLoadSuccess;

  constructor(public payload: { profile: Profile }) { }
}

export class ProfileLoadFail implements Action {
  readonly type = ProfileActionTypes.ProfileLoadFail;
}

export class ProfileClear implements Action {
  readonly type = ProfileActionTypes.ProfileClear;
}

export class ProfileToggleFollowingRequest implements Action {
  readonly type = ProfileActionTypes.ProfileToggleFollowingRequest;

  constructor(public payload: { profile: Profile }) { }
}

export class ProfileToggleFollowingSuccess implements Action {
  readonly type = ProfileActionTypes.ProfileToggleFollowingSuccess;

  constructor(public payload: { profile: Profile, showNotification?: boolean }) { }
}

export class ProfileToggleFollowingFail implements Action {
  readonly type = ProfileActionTypes.ProfileToggleFollowingFail;

  constructor(public payload?: { profile: Profile, showNotification?: boolean }) { }
}

export class ProfileFollowingRequest implements Action {
  readonly type = ProfileActionTypes.ProfileFollowingRequest;

  constructor(public payload: { profile: Profile }) { }
}

export class ProfileUnFollowingRequest implements Action {
  readonly type = ProfileActionTypes.ProfileUnFollowingRequest;

  constructor(public payload: { profile: Profile }) { }
}

export class SetFollowingProfile implements Action {
  readonly type = ProfileActionTypes.SetFollowingProfile;

  constructor(public payload: { profile: Profile }) { }
}

export class ClearFollowingProfile implements Action {
  readonly type = ProfileActionTypes.ClearFollowingProfile;
}

export type ProfileActions =
  ProfileLoadRequest
  | ProfileLoadSuccess
  | ProfileLoadFail
  | ProfileClear
  | ProfileToggleFollowingRequest
  | ProfileToggleFollowingSuccess
  | ProfileToggleFollowingFail
  | ProfileFollowingRequest
  | ProfileUnFollowingRequest
  | SetFollowingProfile
  | ClearFollowingProfile;
