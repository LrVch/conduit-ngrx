import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Article, Errors } from 'src/app/core';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-article-full',
  templateUrl: './article-full.component.html',
  styleUrls: ['./article-full.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ArticleFullComponent {
  @Input('article') article: Article;
  @Input('canModify') canModify: boolean;
  @Input('isDeletingArticle') isDeletingArticle: boolean;
  @Input('articleErrors') articleErrors: Errors;
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
