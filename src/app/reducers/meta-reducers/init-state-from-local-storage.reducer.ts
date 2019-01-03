import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { LocalStorageService } from '@app/core';
import { AppState } from '../';

export function initStateFromLocalStorage(
    reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
    return function (state, action) {
        const newState = reducer(state, action);
        if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
            return { ...newState, ...LocalStorageService.loadInitialState() };
        }
        return newState;
    };
}
