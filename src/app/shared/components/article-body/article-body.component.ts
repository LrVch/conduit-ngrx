import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-article-body',
  templateUrl: './article-body.component.html',
  styleUrls: ['./article-body.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleBodyComponent {
  @Input('body') body: string = '' as string;
}
