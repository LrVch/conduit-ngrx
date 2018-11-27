import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input('tags') tags: string[] = [];
  @Input('currentTag') currentTag = '';
  @Input('isLoading') isLoading = false;
  @Input('isErrorLoading') isErrorLoading = false;
  @Output() selecteTag = new EventEmitter();

  onSelectTag(tag: string, currentTag: string): void {
    if (tag === currentTag) {
      return;
    }

    this.selecteTag.emit(tag);
  }
}
