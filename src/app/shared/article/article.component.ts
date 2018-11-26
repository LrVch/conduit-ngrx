import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from 'src/app/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
  @Input('article') article: Article;
  @Output() favorited = new EventEmitter<Article>();

  onFavoriveToggle(): void {
    this.favorited.emit(this.article);
  }
}
