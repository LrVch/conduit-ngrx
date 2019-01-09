import * as fromProfile from './profile.reducer';
import * as fromProfileSelectors from './profile.selectors';
import { AppState } from '@app/reducers';
import { getProfile } from '@app/lib/testing';

describe('Article selectores', () => {
  const profile = getProfile();
  const initialProfileState: fromProfile.ProfileState = {
    ...fromProfile.initialState,
    profile
  };
  const appState: AppState = { profile: initialProfileState } as AppState;

  describe('selectProfile', () => {
    it('should return "profile" state)', () => {
      const result = fromProfileSelectors.selectProfile(appState);

      expect(result).toEqual(profile);
    });

    it('should return "profile" state (projector)', () => {
      const result = fromProfileSelectors.selectProfile.projector(
        initialProfileState
      );

      expect(result).toEqual(profile);
    });
  });

  describe('selectProfileUsername', () => {
    it('should return "profile" state)', () => {
      const result = fromProfileSelectors.selectProfileUsername(appState);

      expect(result).toBe('username');
    });

    it('should return "profile" state (projector)', () => {
      const result = fromProfileSelectors.selectProfileUsername.projector(
        initialProfileState
      );

      expect(result).toBe('username');
    });
  });

  describe('selectFollowingProfile', () => {
    it('should return "followingProfile" state)', () => {
      const result = fromProfileSelectors.selectFollowingProfile(appState);

      expect(result).toBeFalsy();
    });

    it('should return "followingProfile" state (projector)', () => {
      const result = fromProfileSelectors.selectFollowingProfile.projector(
        initialProfileState
      );

      expect(result).toBeFalsy();
    });
  });
});
