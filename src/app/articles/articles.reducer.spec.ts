import * as fromArticles from './articles.reducer';
import * as fromArticlesConfig from './articlesConfig.reducer';
import {
  LoadArticlesRequest,
  LoadArticlesLoaded,
  LoadArticlesFail,
  ToggleArticleFavoriteRequest,
  ToggleArticleFavoriteSuccess,
  ToggleArticleFavoriteFail,
  SetReturnArticlesConfig,
  ClearReturnArticlesConfig,
  SetFavoritingArticle,
  ClearFavoritingArticle,
  LoadTagsRequest,
  LoadTagsLoaded,
  LoadTagsFail
} from './articles.actions';
import { getArticle } from '../lib/testing';

describe('Article Reducer', () => {
  const article = getArticle();
  const initialArticlesState: fromArticles.ArticlesState = {
    ...fromArticles.initialState,
    items: { 'slug': article, '1': article }, ids: ['slug', '1'], articlesCount: 2
  };
  const returnConfig = fromArticlesConfig.initialState;

  describe('State changes', () => {
    it('should have an initial state', () => {
      const state = fromArticles.articlesReducer(initialArticlesState, { type: '@@init' } as any);

      expect(state).toBe(initialArticlesState);
    });

    it('should clear items, ids, set loadingArticles as true on "LoadArticlesRequest"', () => {
      const init = { type: '@@init' } as any;
      const action = new LoadArticlesRequest();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set items, ids, articlesCount, set loadingArticles as false on "LoadArticlesLoaded"', () => {
      const init = { type: '@@init' } as any;
      const action = new LoadArticlesLoaded({ articles: { items: { '0': article, '1': article }, ids: ['0', '1'], articlesCount: 2 } });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set errorLoadingArticles as true on "LoadArticlesFail"', () => {
      const init = { type: '@@init' } as any;
      const action = new LoadArticlesFail();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set article favoriting as true on "ToggleArticleFavoriteRequest"', () => {
      const init = { type: '@@init' } as any;
      const action = new ToggleArticleFavoriteRequest({ article });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set article favoriting as false on "ToggleArticleFavoriteSuccess"', () => {
      const init = { type: '@@init' } as any;
      const action = new ToggleArticleFavoriteSuccess({ article });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set article favoriting as false on "ToggleArticleFavoriteFail"', () => {
      const init = { type: '@@init' } as any;
      const action = new ToggleArticleFavoriteFail({ article });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set returnConfig on "SetReturnArticlesConfig"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetReturnArticlesConfig({ config: returnConfig });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should remove returnConfig on "ClearReturnArticlesConfig"', () => {
      const init = { type: '@@init' } as any;
      const action = new ClearReturnArticlesConfig();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set favoritingArticle on "SetFavoritingArticle"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetFavoritingArticle({ article });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should remove favoritingArticle on "ClearFavoritingArticle"', () => {
      const init = { type: '@@init' } as any;
      const action = new ClearFavoritingArticle();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should remove favoritingArticle on "ClearFavoritingArticle"', () => {
      const init = { type: '@@init' } as any;
      const action = new ClearFavoritingArticle();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set loadingTags as true on "LoadTagsRequest"', () => {
      const init = { type: '@@init' } as any;
      const action = new LoadTagsRequest();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set tags on "LoadTagsLoaded"', () => {
      const init = { type: '@@init' } as any;
      const action = new LoadTagsLoaded({ tags: ['one', 'two'] });

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });

    it('should set errorLoadingTags as true on "LoadTagsFail"', () => {
      const init = { type: '@@init' } as any;
      const action = new LoadTagsFail();

      const state = [init, action].reduce(fromArticles.articlesReducer, initialArticlesState);

      expect(state).toMatchSnapshot();
    });
  });
});
