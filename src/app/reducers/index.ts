import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '@env/environment';
import { AuthState, authReducer } from '@app/auth/auth.reducer';
import { ArticlesState, articlesReducer } from '@app/articles/articles.reducer';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';
import { ArticlesConfigState, articlesConfigReducer } from '@app/articles/articlesConfig.reducer';
import { ProfileState, profileReducer } from '@app/profile/profile.reducer';
import { layoutReducer, LayoutState } from '@app/layout/layout.reducer';
import { EditorState, editorReducer } from '@app/editor/editor.reducer';
import { ArticleState, articleReducer } from '@app/article/article.reducer';


export interface AppState {
  auth: AuthState;
  articles: ArticlesState;
  router: any;
  articlesConfig: ArticlesConfigState;
  profile: ProfileState;
  layout: LayoutState;
  editor: EditorState;
  article: ArticleState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  articles: articlesReducer,
  router: routerReducer,
  articlesConfig: articlesConfigReducer,
  profile: profileReducer,
  layout: layoutReducer,
  editor: editorReducer,
  article: articleReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
