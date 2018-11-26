import { ArticlesActionTypes, ArticlesActions } from './articles.actions';

export interface FiltersState {
  tag: string;
  author: string;
  favorited: string;
  offset: number;
  limit: number;
}

export interface ArticlesConfigState {
  type: string;
  filters: FiltersState;
}

export const initialFiltersState: FiltersState = {
  tag: '',
  author: '',
  favorited: '',
  offset: 0,
  limit: 10,
};

export const initialState: ArticlesConfigState = {
  type: 'all',
  filters: initialFiltersState
};

export function filtersReducer(state = initialFiltersState, action: ArticlesActions): FiltersState {
  switch (action.type) {
    case ArticlesActionTypes.SetTag:
      return { ...state, tag: action.payload.tag };
    case ArticlesActionTypes.SetAuthor:
      return { ...state, author: action.payload.author };
    case ArticlesActionTypes.SetOffset:
      return { ...state, offset: action.payload.offset };
    case ArticlesActionTypes.SetLimit:
      return { ...state, limit: action.payload.limit };
    case ArticlesActionTypes.SetFavorited:
      return { ...state, favorited: action.payload.favorited };
    case ArticlesActionTypes.ResetConfig:
      return {
        ...state,
        tag: '',
        author: '',
        favorited: '',
        offset: 0,
        limit: 10
      };
    default:
      return state;
  }
}

export function articlesConfigReducer(state = initialState, action: ArticlesActions): ArticlesConfigState {
  switch (action.type) {
    case ArticlesActionTypes.SetTypeOfFeed:
      return { ...state, type: action.payload.type };
    case ArticlesActionTypes.SetTag:
      return { ...state, filters: filtersReducer(state.filters, action) };
    case ArticlesActionTypes.SetAuthor:
      return { ...state, filters: filtersReducer(state.filters, action) };
    case ArticlesActionTypes.SetOffset:
      return { ...state, filters: filtersReducer(state.filters, action) };
    case ArticlesActionTypes.SetLimit:
      return { ...state, filters: filtersReducer(state.filters, action) };
    case ArticlesActionTypes.SetFavorited:
      return { ...state, filters: filtersReducer(state.filters, action) };
    case ArticlesActionTypes.ResetConfig:
      return {
        ...state,
        type: 'all',
        filters: filtersReducer(state.filters, action)
      };
    default:
      return state;
  }
}
