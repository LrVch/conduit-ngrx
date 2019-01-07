import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '@app/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
  @Input('canModify') canModify = false;
  @Input('locale') locale = 'en';
  @Input('article') article: Article = {} as Article;
  @Output() favorited = new EventEmitter<Article>();
  @Output() delete = new EventEmitter<Article>();

  onFavoriveToggle(): void {
    this.favorited.emit(this.article);
  }

  onDelete(): void {
    this.delete.emit(this.article);
  }
}
