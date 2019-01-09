import * as fromArticlesConfig from './articlesConfig.reducer';
import {
  SetTypeOfFeed,
  SetTag,
  SetAuthor,
  SetOffset,
  SetLimit,
  SetPageIndex,
  SetFavorited,
  ResetConfig
} from './articles.actions';

describe('ArticleConfig Reducer', () => {
  describe('State changes', () => {
    const initialArticleConfigState: fromArticlesConfig.ArticlesConfigState =
      fromArticlesConfig.initialState;

    it('should have an initial state', () => {
      const state = fromArticlesConfig.articlesConfigReducer(
        initialArticleConfigState,
        { type: '@@init' } as any
      );

      expect(state).toBe(initialArticleConfigState);
    });

    it('should type as "all" on "SetTag"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetTypeOfFeed({ type: 'all' });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should tag as "color" on "SetTag"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetTag({ tag: 'color' });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should author as "author" on "SetAuthor"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetAuthor({ author: 'author' });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should offset as "20" on "SetOffset"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetOffset({ offset: 20 });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should limit as "20" on "SetLimit"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetLimit({ limit: 20 });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should pageIndex as "20" on "SetPageIndex"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetPageIndex({ pageIndex: 20 });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should favorited as "favorited" on "SetFavorited"', () => {
      const init = { type: '@@init' } as any;
      const action = new SetFavorited({ favorited: 'favorited' });

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });

    it('should reset config on "ResetConfig"', () => {
      const init = { type: '@@init' } as any;
      const action = new ResetConfig();

      const state = [init, action].reduce(
        fromArticlesConfig.articlesConfigReducer,
        initialArticleConfigState
      );

      expect(state).toMatchSnapshot();
    });
  });
});
