import { Article } from './article.model';

export interface Articles {
  items: {
    [key: string]: Article;
  };
  ids: string[];
  articlesCount: number;
}
