import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input('tags') tags: string[];
  @Input('currentTag') currentTag: string;
  @Input('isLoading') isLoading: boolean;
  @Input('isErrorLoading') isErrorLoading: boolean;
  @Output() selecteTag = new EventEmitter();

  onSelectTag(tag: string, currentTag: string): void {
    if (tag === currentTag) {
      return;
    }

    this.selecteTag.emit(tag);
  }
}
