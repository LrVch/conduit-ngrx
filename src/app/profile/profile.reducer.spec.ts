import * as fromProfile from './profile.reducer';
import {
  ProfileLoadSuccess,
  ProfileClear,
  ProfileToggleFollowingRequest,
  ProfileToggleFollowingFail,
  ProfileToggleFollowingSuccess,
  SetFollowingProfile,
  ClearFollowingProfile
} from './profile.actions';
import { getProfile } from '../lib/testing';

describe('Editor Reducer', () => {
  describe('State changes', () => {
    const profile = getProfile();
    const initialProfileState: fromProfile.ProfileState =
      fromProfile.initialState;

    it('should have an initial state', () => {
      const state = fromProfile.profileReducer(initialProfileState, {
        type: '@@init'
      } as any);

      expect(state).toBe(initialProfileState);
    });

    it('should set pofile on "ProfileLoadSuccess"', () => {
      const init = { type: '@@init' } as any;
      const action = new ProfileLoadSuccess({ profile });

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });

    it('should remove pofile on "ProfileClear"', () => {
      const init = { type: '@@init' } as any;
      const action = new ProfileClear();

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isFollowLoading as true in profile on "ProfileToggleFollowingRequest"', () => {
      const init = { type: '@@init' } as any;
      const action = new ProfileToggleFollowingRequest({ profile });

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isFollowLoading as false in profile on "ProfileToggleFollowingFail"', () => {
      const init = { type: '@@init' } as any;
      const action = new ProfileToggleFollowingFail();

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set profile on "ProfileToggleFollowingSuccess"', () => {
      const init = { type: '@@init' } as any;
      const action = new ProfileToggleFollowingSuccess({ profile });

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set followingProfile on "SetFollowingProfile"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetFollowingProfile({ profile });

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });

    it('should remove followingProfile on "ClearFollowingProfile"', () => {
      const init = { type: '@@init' } as any;
      const action = new ClearFollowingProfile();

      const state = [init, action].reduce(
        fromProfile.profileReducer,
        initialProfileState
      );

      expect(state).toMatchSnapshot();
    });
  });
});
