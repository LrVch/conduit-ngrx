import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Article, Errors } from '@app/core';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-article-full',
  templateUrl: './article-full.component.html',
  styleUrls: ['./article-full.component.scss']
})
export class ArticleFullComponent {
  @Input('locale') locale: string;
  @Input('article') article: Article = {} as Article;
  @Input('canModify') canModify = false;
  @Input('isDeletingArticle') isDeletingArticle = false;
  @Input('articleErrors') articleErrors: Errors = {} as Errors;
  @Output() favorited = new EventEmitter<Article>();
  @Output() folowing = new EventEmitter<Profile>();
  @Output() delete = new EventEmitter<Article>();


  onToggleFollowing(profile: Profile): void {
    this.folowing.emit(profile);
  }

  onFavoriveToggle(): void {
    this.favorited.emit(this.article);
  }

  onDeleteArticle(): void {
    this.delete.emit(this.article);
  }
}
