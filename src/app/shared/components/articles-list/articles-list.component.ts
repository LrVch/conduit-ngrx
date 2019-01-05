import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '@app/core';
import { range } from 'rxjs';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent {
  @Input('locale') locale: string;
  @Input('articlesList') articlesList: Article[] = [];
  @Input('isLoading') isLoading = false;
  @Input('isErrorLoading') isErrorLoading = false;
  @Output() favorited = new EventEmitter<Article>();
  @Input('contentLength') contentLength = 0;

  onFavoriteTooggle(article: Article): void {
    this.favorited.emit(article);
  }

  get dummys$() {
    return range(0, this.contentLength).pipe(toArray());
  }

  trackArticle(index: number, article: Article): string {
    return article.slug;
  }

  trackDummy(index: number): number {
    return index;
  }
}
