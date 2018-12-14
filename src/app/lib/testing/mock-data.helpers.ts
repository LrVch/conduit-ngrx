import { Article, User, Comment } from 'src/app/core';

export const getProfile = () => {
    return {
        username: 'username',
        bio: 'bio',
        image: 'image',
        following: false,
        isFollowLoading: false
    };
};

export const getArticle = (): Article => {
    return {
        slug: 'slug',
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

export const getComment = (id): Comment => {
    return {
        id: id || Math.random(),
        body: 'body',
        createdAt: '1544784339002',
        author: getProfile(),
        isDeleting: false,
    };
};

export const getComments = (amount): Comment[] => {
    return <any>Array.from({ length: amount }).map((e, i) => getComment(i));
};

