import { schema } from 'normalizr';

export const articleSchema = new schema.Entity(
  'articles',
  {},
  { idAttribute: 'slug' }
);
export const responceArticleSchema = { article: articleSchema };
export const responceArticlesSchema = { articles: [articleSchema] };
