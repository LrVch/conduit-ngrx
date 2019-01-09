import { Action } from '@ngrx/store';
import { LayoutActionTypes, LayoutActions } from './layout.actions';

export interface LayoutState {
  showMainLoader: boolean;
  sideNavOpen: boolean;
}

export const initialState: LayoutState = {
  showMainLoader: false,
  sideNavOpen: false
};

export function layoutReducer(
  state = initialState,
  action: LayoutActions
): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.ShowMainLoader:
      return {
        ...state,
        showMainLoader: true
      };
    case LayoutActionTypes.HideMainLoader:
      return {
        ...state,
        showMainLoader: false
      };
    case LayoutActionTypes.ToggleSideNav:
      const close = action.payload && action.payload.close;
      const newsState = close ? false : !state.sideNavOpen;
      return {
        ...state,
        sideNavOpen: newsState
      };
    default:
      return state;
  }
}
