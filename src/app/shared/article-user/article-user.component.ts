import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Article } from 'src/app/core';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-article-user',
  templateUrl: './article-user.component.html',
  styleUrls: ['./article-user.component.scss']
})
export class ArticleUserComponent {
  @Input('article') article: Article;
  @Input('canModify') canModify: boolean;
  @Input('isDeletingArticle') isDeletingArticle: boolean;
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
