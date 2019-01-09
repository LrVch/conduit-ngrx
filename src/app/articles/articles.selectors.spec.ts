import * as fromArticles from './articles.reducer';
import * as fromArticlesConfig from './articlesConfig.reducer';
import * as fromArticlesSelectors from './articles.selectors';
import { getArticle, getArticles } from '@app/lib/testing';
import { AppState } from '@app/reducers';

describe('Articles selectores', () => {
  const initialArticleState: fromArticles.ArticlesState =
    fromArticles.initialState;
  const initialArticlesConfigState: fromArticlesConfig.ArticlesConfigState =
    fromArticlesConfig.initialState;
  const appState: AppState = {
    articles: initialArticleState,
    articlesConfig: initialArticlesConfigState
  } as AppState;
  const config = { ...initialArticlesConfigState };

  describe('Tags', () => {
    describe('selectArticlesTagsLoading', () => {
      it('should return "loadingTags" state)', () => {
        const result = fromArticlesSelectors.selectArticlesTagsLoading(
          appState
        );

        expect(result).toBeFalsy();
      });

      it('should return "loadingTags" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesTagsLoading.projector(
          initialArticleState
        );

        expect(result).toBeFalsy();
      });
    });

    describe('selectArticlesTagsFailLoading', () => {
      it('should return "errorLoadingTags" state)', () => {
        const result = fromArticlesSelectors.selectArticlesTagsFailLoading(
          appState
        );

        expect(result).toBeFalsy();
      });

      it('should return "errorLoadingTags" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesTagsFailLoading.projector(
          initialArticleState
        );

        expect(result).toBeFalsy();
      });
    });

    describe('selectArticlesTags', () => {
      it('should return "tags" state)', () => {
        const result = fromArticlesSelectors.selectArticlesTags(appState);

        expect(result).toEqual([]);
      });

      it('should return "tags" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesTags.projector(
          initialArticleState
        );

        expect(result).toEqual([]);
      });
    });
  });

  describe('Articles', () => {
    describe('selectArticlesItems', () => {
      it('should return "articles" state)', () => {
        const result = fromArticlesSelectors.selectArticlesItems(appState);

        expect(result).toEqual(Object.values(initialArticleState.items));
      });

      it('should return "articles" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesItems.projector(
          initialArticleState
        );

        expect(result).toEqual(Object.values(initialArticleState.items));
      });
    });

    describe('selectArticlesCount', () => {
      it('should return "articlesCount" state)', () => {
        const result = fromArticlesSelectors.selectArticlesCount(appState);

        expect(result).toBe(0);
      });

      it('should return "articlesCount" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesCount.projector(
          initialArticleState
        );

        expect(result).toBe(0);
      });
    });

    describe('selectArticlesLoading', () => {
      it('should return "loadingArticles" state)', () => {
        const result = fromArticlesSelectors.selectArticlesLoading(appState);

        expect(result).toBeFalsy();
      });

      it('should return "loadingArticles" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesLoading.projector(
          initialArticleState
        );

        expect(result).toBeFalsy();
      });
    });

    describe('selectArticlesFailLoading', () => {
      it('should return "errorLoadingArticles" state)', () => {
        const result = fromArticlesSelectors.selectArticlesFailLoading(
          appState
        );

        expect(result).toBeFalsy();
      });

      it('should return "errorLoadingArticles" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesFailLoading.projector(
          initialArticleState
        );

        expect(result).toBeFalsy();
      });
    });

    describe('selectArticlesCurrentPage', () => {
      it('should return "currentPage" state)', () => {
        const result = fromArticlesSelectors.selectArticlesCurrentPage(
          appState
        );

        expect(result).toBe(1);
      });

      it('should return "currentPage" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesCurrentPage.projector(
          initialArticleState
        );

        expect(result).toBe(1);
      });
    });

    describe('selectArticlesReturnConfig', () => {
      it('should return "currentPage" state)', () => {
        const result = fromArticlesSelectors.selectArticlesReturnConfig(
          appState
        );

        expect(result).toBeNull();
      });

      it('should return "currentPage" state (projector)', () => {
        const result = fromArticlesSelectors.selectArticlesReturnConfig.projector(
          initialArticleState
        );

        expect(result).toBeNull();
      });
    });

    describe('selectFavoritingArticle', () => {
      it('should return "favoritingArticle" state)', () => {
        const result = fromArticlesSelectors.selectFavoritingArticle(appState);

        expect(result).toBeNull();
      });

      it('should return "favoritingArticle" state (projector)', () => {
        const result = fromArticlesSelectors.selectFavoritingArticle.projector(
          initialArticleState
        );

        expect(result).toBeNull();
      });
    });
  });

  describe('ArticlesConfig', () => {
    describe('getArticlesConfig', () => {
      it('should return "articlesConfigState" state)', () => {
        const result = fromArticlesSelectors.getArticlesConfig(appState);

        expect(result).toEqual(config);
      });

      it('should return "articlesConfigState" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesConfig.projector(
          initialArticlesConfigState
        );

        expect(result).toEqual(config);
      });
    });

    describe('getArticlesFiltersType', () => {
      it('should return "type" state)', () => {
        const result = fromArticlesSelectors.getArticlesFiltersType(appState);

        expect(result).toBe('all');
      });

      it('should return "type" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesFiltersType.projector(
          initialArticlesConfigState
        );

        expect(result).toBe('all');
      });
    });

    describe('getArticlesFilters', () => {
      it('should return "filters" state)', () => {
        const result = fromArticlesSelectors.getArticlesFilters(appState);

        expect(result).toEqual(config.filters);
      });

      it('should return "filters" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesFilters.projector(
          initialArticlesConfigState
        );

        expect(result).toEqual(config.filters);
      });
    });

    describe('getArticlesCurrentTag', () => {
      it('should return "filters.tag" state)', () => {
        const result = fromArticlesSelectors.getArticlesCurrentTag(appState);

        expect(result).toBe('');
      });

      it('should return "filters.tag" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesCurrentTag.projector(
          initialArticlesConfigState
        );

        expect(result).toBe('');
      });
    });

    describe('getArticlesAuthor', () => {
      it('should return "filters.author" state)', () => {
        const result = fromArticlesSelectors.getArticlesAuthor(appState);

        expect(result).toBe('');
      });

      it('should return "filters.author" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesAuthor.projector(
          initialArticlesConfigState
        );

        expect(result).toBe('');
      });
    });

    describe('getArticlesFavorited', () => {
      it('should return "filters.favorited" state)', () => {
        const result = fromArticlesSelectors.getArticlesFavorited(appState);

        expect(result).toBe('');
      });

      it('should return "filters.favorited" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesFavorited.projector(
          initialArticlesConfigState
        );

        expect(result).toBe('');
      });
    });

    describe('getArticlesLimit', () => {
      it('should return "filters.limit" state)', () => {
        const result = fromArticlesSelectors.getArticlesLimit(appState);

        expect(result).toBe(10);
      });

      it('should return "filters.limit" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesLimit.projector(
          initialArticlesConfigState
        );

        expect(result).toBe(10);
      });
    });

    describe('getArticlesPageIndex', () => {
      it('should return "filters.pageIndex" state)', () => {
        const result = fromArticlesSelectors.getArticlesPageIndex(appState);

        expect(result).toBe(0);
      });

      it('should return "filters.pageIndex" state (projector)', () => {
        const result = fromArticlesSelectors.getArticlesPageIndex.projector(
          initialArticlesConfigState
        );

        expect(result).toBe(0);
      });
    });
  });
});
