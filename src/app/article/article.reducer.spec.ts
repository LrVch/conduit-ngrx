import * as fromArticle from './article.reducer';
import {
  ArticleLoadSuccess,
  ArticleDeleteRequest,
  ArticleDeleteSuccess,
  ArticleDeleteFail,
  ArticleToggleFollowingRequest,
  ArticleToggleFollowingFail,
  ArticleToggleFollowingSuccess,
  ArticleCommentsRequest,
  ArticleCommentsSuccess,
  ArticleCommentsFail,
  ArticleCommentAddRequest,
  ArticleCommentAddSuccess,
  ArticleCommentAddFail,
  ArticleCommentDeleteRequest,
  ArticleCommentDeleteSuccess,
  ArticleCommentDeleteFail,
  SetFollowingProfile,
  ClearFollowingProfile
} from './article.actions';
import {
  getArticle,
  getSomeErrors,
  getProfile,
  getComments,
  getComment
} from '@app/lib/testing';
import {
  ToggleArticleFavoriteRequest,
  ToggleArticleFavoriteSuccess,
  ToggleArticleFavoriteFail
} from '@app/articles/articles.actions';

describe('Article Reducer', () => {
  const article = getArticle();
  const errors = getSomeErrors();
  const profile = getProfile();
  const comments = getComments(3);
  const comment = getComment(0);
  const initialAuthState: fromArticle.ArticleState = {
    ...fromArticle.initialState,
    selected: article,
    comments
  };

  comments[0].id = 0;

  describe('State changes', () => {
    it('should have an initial state', () => {
      const state = fromArticle.articleReducer(initialAuthState, {
        type: '@@init'
      } as any);

      expect(state).toBe(initialAuthState);
    });

    it('should load article on success', () => {
      const init = { type: '@@init' } as any;
      const action = new ArticleLoadSuccess({ article });

      const state = [init, action].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isArticleDeleting as true on "ArticleDeleteRequest"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleDeleteRequest({ article });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isArticleDeleting as false on "ArticleDeleteSuccess"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleDeleteSuccess();

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isArticleDeleting as false and set errors on "ArticleDeleteFail"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleDeleteFail({ errors });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set selected article favoriting as true on "ToggleArticleFavoriteRequest"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ToggleArticleFavoriteRequest({ article });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set selected article on "ToggleArticleFavoriteSuccess"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ToggleArticleFavoriteSuccess({ article });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set selected article on "ToggleArticleFavoriteFail"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ToggleArticleFavoriteFail({ article });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set selected article on "ArticleToggleFollowingRequest"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleToggleFollowingRequest({ profile });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set selected article on "ArticleToggleFollowingFail"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleToggleFollowingFail({ profile });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set selected article on "ArticleToggleFollowingSuccess"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleToggleFollowingSuccess({ profile });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isCommentsLoading as true, remove comments and errors on "ArticleCommentsRequest"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentsRequest({ slug: 'slug' });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isCommentsLoading as false, set comments on "ArticleCommentsSuccess"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentsSuccess({ comments });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isCommentsLoading as false, set comments on "ArticleCommentsFail"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentsFail({ errors });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isCommentSaving as true, remove errors on "ArticleCommentAddRequest"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentAddRequest({ comment: 'c' });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isCommentSaving as false, set comments on "ArticleCommentAddSuccess"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentAddSuccess({ comment });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set isCommentSaving as false, set errors on "ArticleCommentAddFail"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentAddFail({ errors });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should update deleting comment on "ArticleCommentDeleteRequest"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentDeleteRequest({ comment });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should delete comment on "ArticleCommentDeleteSuccess"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentDeleteSuccess({ id: 0 });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should update deleting comment on "ArticleCommentDeleteFail"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ArticleCommentDeleteFail({ errors, id: 0 });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should set followingPofile on "SetFollowingProfile"', () => {
      const init = { type: '@@init' } as any;
      const actions = new SetFollowingProfile({ profile });

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });

    it('should remove followingPofile on "ClearFollowingProfile"', () => {
      const init = { type: '@@init' } as any;
      const actions = new ClearFollowingProfile();

      const state = [init, actions].reduce(
        fromArticle.articleReducer,
        initialAuthState
      );

      expect(state).toMatchSnapshot();
    });
  });
});
