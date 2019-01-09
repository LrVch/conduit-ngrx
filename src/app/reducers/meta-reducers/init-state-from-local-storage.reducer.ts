import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { LocalStorageService } from '@app/core';
import { AppState } from '../';

export function initStateFromLocalStorage(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function(state, action) {
    const oldState = reducer(state, action);
    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      const localKeys = Object.keys(LocalStorageService.loadInitialState());
      const localState = LocalStorageService.loadInitialState();
      const newLocalState = localKeys.reduce((acc, key) => {
        localState[key] = Object.keys(localState[key]).reduce((obj, prop) => {
          if (prop in oldState[key]) {
            obj[prop] = localState[key][prop];
            return obj;
          }
          return obj;
        }, {});
        acc[key] = { ...oldState[key], ...localState[key] };
        return acc;
      }, {});
      const resultState = { ...oldState, ...newLocalState };
      return resultState;
    }
    return oldState;
  };
}
