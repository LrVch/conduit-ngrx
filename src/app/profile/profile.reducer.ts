import { Profile } from '../core';
import { ProfileActions, ProfileActionTypes } from './profile.actions';


export interface ProfileState {
  profile: Profile;
}

export const initialState: ProfileState = {
  profile: null
};

export function profileReducer(state = initialState, action: ProfileActions): ProfileState {
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
    default:
      return state;
  }
}
