import { Article, User, Comment, Errors, ErrorsObj } from '@app/core';
import { Credentials } from '@app/core/models/credentials.model';

export const getProfile = () => {
    return {
        username: 'username',
        bio: 'bio',
        image: 'image',
        following: false,
        isFollowLoading: false
    };
};

export const getArticle = (id = 'slug'): Article => {
    return {
        slug: id,
        title: 'title',
        description: 'desc',
        body: 'body',
        tagList: ['list'],
        createdAt: '1544505543896',
        updatedAt: '1544505523896',
        favorited: false,
        favoritesCount: 0,
        author: getProfile(),
        favoriting: false,
    };
};

export const getArticles = (amount): Article[] => {
    return <any>Array.from({ length: amount }).fill(getArticle());
};

export const getUser = (): User => {
    return {
        email: 'email',
        token: 'token',
        username: 'usernam',
        bio: 'bil',
        image: 'image'
    };
};

export const getComment = (id = Math.random()): Comment => {
    return {
        id: id,
        body: 'body',
        createdAt: '1544784339002',
        author: getProfile(),
        isDeleting: false,
    };
};

export const getComments = (amount): Comment[] => {
    return <any>Array.from({ length: amount }).map((e, i) => getComment(i));
};

export const getAuthErrors = (): Errors => {
    return new ErrorsObj({ type: 'error', body: ['some error'] });
};

export const getSomeErrors = (): Errors => {
    return new ErrorsObj({ type: 'error', body: ['some error'] });
};

export const getCredentials = (): Credentials => {
    return {
        email: 'string',
        username: 'string',
        password: 'string',
    };
};
