import { Profile } from '@app/core';
import { ProfileActions, ProfileActionTypes } from './profile.actions';

export interface ProfileState {
  profile: Profile;
  followingProfile: Profile | null;
}

export const initialState: ProfileState = {
  profile: null,
  followingProfile: null
};

export function profileReducer(
  state = initialState,
  action: ProfileActions
): ProfileState {
  switch (action.type) {
    case ProfileActionTypes.ProfileLoadSuccess:
      return {
        ...state,
        profile: action.payload.profile
      };
    case ProfileActionTypes.ProfileClear:
      return {
        ...state,
        profile: null
      };
    case ProfileActionTypes.ProfileToggleFollowingRequest:
      return {
        ...state,
        profile: { ...state.profile, isFollowLoading: true }
      };
    case ProfileActionTypes.ProfileToggleFollowingFail:
      return {
        ...state,
        profile: { ...state.profile, isFollowLoading: false }
      };
    case ProfileActionTypes.ProfileToggleFollowingSuccess:
      return {
        ...state,
        profile: action.payload.profile
      };
    case ProfileActionTypes.SetFollowingProfile:
      return {
        ...state,
        followingProfile: action.payload.profile
      };
    case ProfileActionTypes.ClearFollowingProfile:
      return {
        ...state,
        followingProfile: null
      };
    default:
      return state;
  }
}
