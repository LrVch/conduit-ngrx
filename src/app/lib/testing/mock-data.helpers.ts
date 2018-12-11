import { Article } from 'src/app/core';

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
    return <any>Array.from({length: amount}).fill(getArticle());
};



