import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '@app/core';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent {
  @Input('articlesList') articlesList: Article[] = [];
  @Input('isLoading') isLoading = false;
  @Input('isErrorLoading') isErrorLoading = false;
  @Output() favorited = new EventEmitter<Article>();

  onFavoriteTooggle(article: Article): void {
    this.favorited.emit(article);
  }
}
