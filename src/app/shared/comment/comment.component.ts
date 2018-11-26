import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment, User } from 'src/app/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input('comment') comment: Comment;
  @Input('user') user: User;
  @Input('canModify') canModify: boolean;
  @Output() delete = new EventEmitter<boolean>();

  deleteComment(): void {
    if (this.comment.isDeleting) {
      return;
    }

    this.delete.emit(true);
  }
}
