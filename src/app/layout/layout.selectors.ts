import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { LayoutState } from './layout.reducer';

export const selectLayoutState = createFeatureSelector<AppState, LayoutState>('layout');

export const selectShowMainLoader = createSelector(
  selectLayoutState,
  (layoutState: LayoutState) => layoutState.showMainLoader
);
