import { Article, Errors, Comment, Profile } from '@app/core';
import { ArticleActionTypes, ArticleActions } from './article.actions';
import {
  ArticlesActionTypes,
  ArticlesActions
} from '@app/articles/articles.actions';

export interface ArticleState {
  selected: Article;
  comments: Comment[];
  errors: Errors;
  isArticleDeleting: boolean;
  getCommentsErrors: Errors;
  addCommentErrors: Errors;
  deleteCommentErrors: Errors;
  isCommentsLoading: boolean;
  isCommentSaving: boolean;
  isCommentReset: boolean;
  followingPofile: Profile | null;
}

export const initialState: ArticleState = {
  selected: null,
  comments: [],
  errors: {
    errors: {}
  },
  isArticleDeleting: false,
  getCommentsErrors: {
    errors: {}
  },
  addCommentErrors: {
    errors: {}
  },
  deleteCommentErrors: {
    errors: {}
  },
  isCommentsLoading: false,
  isCommentSaving: false,
  isCommentReset: false,
  followingPofile: null
};

export function articleReducer(
  state = initialState,
  action: ArticleActions | ArticlesActions
): ArticleState {
  switch (action.type) {
    case ArticleActionTypes.ArticleLoadSuccess:
      return {
        ...state,
        selected: action.payload.article
      };
    case ArticleActionTypes.ArticleDeleteRequest:
      return {
        ...state,
        errors: {
          errors: {}
        },
        isArticleDeleting: true
      };
    case ArticleActionTypes.ArticleDeleteSuccess:
      return {
        ...state,
        selected: null,
        errors: {
          errors: {}
        },
        isArticleDeleting: false
      };
    case ArticleActionTypes.ArticleDeleteFail:
      return {
        ...state,
        errors: { ...action.payload.errors },
        isArticleDeleting: false
      };

    case ArticlesActionTypes.ToggleArticleFavoriteRequest:
      return {
        ...state,
        selected: { ...state.selected, favoriting: true }
      };
    case ArticlesActionTypes.ToggleArticleFavoriteSuccess:
      return {
        ...state,
        selected: action.payload.article
      };
    case ArticlesActionTypes.ToggleArticleFavoriteFail:
      return {
        ...state,
        selected: action.payload.article
      };

    case ArticleActionTypes.ArticleToggleFollowingRequest:
      return {
        ...state,
        selected: {
          ...state.selected,
          author: { ...state.selected.author, isFollowLoading: true }
        }
      };
    case ArticleActionTypes.ArticleToggleFollowingFail:
      return {
        ...state,
        selected: {
          ...state.selected,
          author: { ...state.selected.author, isFollowLoading: false }
        }
      };
    case ArticleActionTypes.ArticleToggleFollowingSuccess:
      const following = action.payload.profile.following;
      return {
        ...state,
        selected: {
          ...state.selected,
          author: {
            ...state.selected.author,
            isFollowLoading: false,
            following: following
          }
        }
      };

    case ArticleActionTypes.ArticleCommentsRequest:
      return {
        ...state,
        isCommentsLoading: true,
        comments: [],
        getCommentsErrors: {
          errors: {}
        }
      };
    case ArticleActionTypes.ArticleCommentsSuccess:
      return {
        ...state,
        isCommentsLoading: false,
        comments: action.payload.comments,
        getCommentsErrors: {
          errors: {}
        }
      };
    case ArticleActionTypes.ArticleCommentsFail:
      return {
        ...state,
        isCommentsLoading: false,
        getCommentsErrors: action.payload.errors
      };

    case ArticleActionTypes.ArticleCommentAddRequest:
      return {
        ...state,
        isCommentSaving: true,
        addCommentErrors: {
          errors: {}
        },
        isCommentReset: false
      };
    case ArticleActionTypes.ArticleCommentAddSuccess:
      return {
        ...state,
        isCommentSaving: false,
        addCommentErrors: {
          errors: {}
        },
        comments: [action.payload.comment, ...state.comments],
        isCommentReset: true
      };
    case ArticleActionTypes.ArticleCommentAddFail:
      return {
        ...state,
        isCommentSaving: false,
        addCommentErrors: action.payload.errors
      };

    case ArticleActionTypes.ArticleCommentDeleteRequest: {
      const { id } = action.payload.comment;
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === id ? { ...comment, isDeleting: true } : comment
        ),
        deleteCommentErrors: {
          errors: {}
        }
      };
    }

    case ArticleActionTypes.ArticleCommentDeleteSuccess:
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment.id !== action.payload.id
        ),
        deleteCommentErrors: {
          errors: {}
        }
      };
    case ArticleActionTypes.ArticleCommentDeleteFail: {
      const { id, errors } = action.payload;
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === id ? { ...comment, isDeleting: false } : comment
        ),
        deleteCommentErrors: errors
      };
    }

    case ArticleActionTypes.SetFollowingProfile: {
      return {
        ...state,
        followingPofile: action.payload.profile
      };
    }
    case ArticleActionTypes.ClearFollowingProfile: {
      return {
        ...state,
        followingPofile: null
      };
    }

    default:
      return state;
  }
}
