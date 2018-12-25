import * as fromArticle from './article.reducer';
import * as fromArticleSelectors from './aritcle.selectors';
import {
  getArticle
} from '../lib/testing';
import { AppState } from '../reducers';

describe('Article selectores', () => {
  const aritcle = getArticle();
  const initialArticleState: fromArticle.ArticleState = fromArticle.initialState;

  const aritcleState = { ...initialArticleState, selected: aritcle };
  const appState: AppState = { article: aritcleState } as AppState;

  describe('selectArticle', () => {
    it('should return "selected" state)', () => {
      const result = fromArticleSelectors.selectArticle(appState);

      expect(result).toEqual(aritcle);
    });

    it('should return "selected" state (projector)', () => {
      const result = fromArticleSelectors.selectArticle.projector(
        aritcleState
      );

      expect(result).toEqual(aritcle);
    });
  });

  describe('selectArticleDeleting', () => {
    it('should return "selected" state)', () => {
      const result = fromArticleSelectors.selectArticleDeleting(appState);

      expect(result).toBe(false);
    });

    it('should return "selected" state (projector)', () => {
      const result = fromArticleSelectors.selectArticleDeleting.projector(
        aritcleState
      );

      expect(result).toBe(false);
    });
  });

  describe('selectArticleDeleting', () => {
    it('should return "isArticleDeleting" state)', () => {
      const result = fromArticleSelectors.selectArticleDeleting(appState);

      expect(result).toBe(false);
    });

    it('should return "isArticleDeleting" state (projector)', () => {
      const result = fromArticleSelectors.selectArticleDeleting.projector(
        aritcleState
      );

      expect(result).toBe(false);
    });
  });

  describe('selectArticleErrors', () => {
    it('should return "errors" state)', () => {
      const result = fromArticleSelectors.selectArticleErrors(appState);

      expect(result).toEqual({errors: {}});
    });

    it('should return "errors" state (projector)', () => {
      const result = fromArticleSelectors.selectArticleErrors.projector(
        aritcleState
      );

      expect(result).toEqual({errors: {}});
    });
  });

  describe('selectComments', () => {
    it('should return "comments" state)', () => {
      const result = fromArticleSelectors.selectComments(appState);

      expect(result).toEqual([]);
    });

    it('should return "comments" state (projector)', () => {
      const result = fromArticleSelectors.selectComments.projector(
        aritcleState
      );

      expect(result).toEqual([]);
    });
  });

  describe('selectGetCommentsErrors', () => {
    it('should return "getCommentsErrors" state)', () => {
      const result = fromArticleSelectors.selectGetCommentsErrors(appState);

      expect(result).toEqual({errors: {}});
    });

    it('should return "getCommentsErrors" state (projector)', () => {
      const result = fromArticleSelectors.selectGetCommentsErrors.projector(
        aritcleState
      );

      expect(result).toEqual({errors: {}});
    });
  });

  describe('selectCommentLoading', () => {
    it('should return "isCommentsLoading" state)', () => {
      const result = fromArticleSelectors.selectCommentLoading(appState);

      expect(result).toBeFalsy();
    });

    it('should return "isCommentsLoading" state (projector)', () => {
      const result = fromArticleSelectors.selectCommentLoading.projector(
        aritcleState
      );

      expect(result).toBeFalsy();
    });
  });

  describe('selectCommentSaving', () => {
    it('should return "isCommentSaving" state)', () => {
      const result = fromArticleSelectors.selectCommentSaving(appState);

      expect(result).toBeFalsy();
    });

    it('should return "isCommentSaving" state (projector)', () => {
      const result = fromArticleSelectors.selectCommentSaving.projector(
        aritcleState
      );

      expect(result).toBeFalsy();
    });
  });

  describe('selectAddCommentErrors', () => {
    it('should return "addCommentErrors" state)', () => {
      const result = fromArticleSelectors.selectAddCommentErrors(appState);

      expect(result).toEqual({errors: {}});
    });

    it('should return "addCommentErrors" state (projector)', () => {
      const result = fromArticleSelectors.selectAddCommentErrors.projector(
        aritcleState
      );

      expect(result).toEqual({errors: {}});
    });
  });

  describe('selecCommentReset', () => {
    it('should return "isCommentReset" state)', () => {
      const result = fromArticleSelectors.selecCommentReset(appState);

      expect(result).toBeFalsy();
    });

    it('should return "isCommentReset" state (projector)', () => {
      const result = fromArticleSelectors.selecCommentReset.projector(
        aritcleState
      );

      expect(result).toBeFalsy();
    });
  });

  describe('selectDeleteCommentErrors', () => {
    it('should return "deleteCommentErrors" state)', () => {
      const result = fromArticleSelectors.selectDeleteCommentErrors(appState);

      expect(result).toEqual({errors: {}});
    });

    it('should return "deleteCommentErrors" state (projector)', () => {
      const result = fromArticleSelectors.selectDeleteCommentErrors.projector(
        aritcleState
      );

      expect(result).toEqual({errors: {}});
    });
  });

  describe('selectFollowingProfile', () => {
    it('should return "followingPofile" state)', () => {
      const result = fromArticleSelectors.selectFollowingProfile(appState);

      expect(result).toBeNull();
    });

    it('should return "followingPofile" state (projector)', () => {
      const result = fromArticleSelectors.selectFollowingProfile.projector(
        aritcleState
      );

      expect(result).toBeNull();
    });
  });
});
