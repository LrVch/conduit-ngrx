import { Action } from '@ngrx/store';
import { LayoutActionTypes } from './layout.actions';


export interface LayoutState {
  showMainLoader: boolean;
}

export const initialState: LayoutState = {
  showMainLoader: false
};

export function layoutReducer(state = initialState, action: Action): LayoutState {
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
    default:
      return state;
  }
}
