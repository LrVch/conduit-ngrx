import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '@app/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input('comment') comment: Comment = {} as Comment;
  @Input('canModify') canModify = false;
  @Output() delete = new EventEmitter<boolean>();

  deleteComment(): void {
    if (this.comment.isDeleting) {
      return;
    }

    this.delete.emit(true);
  }
}
