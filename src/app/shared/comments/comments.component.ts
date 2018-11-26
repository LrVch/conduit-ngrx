import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User, Comment } from 'src/app/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  @Input('comments') comments: Comment[];
  @Input('user') user: User;
  @Input('loading') loading: boolean;
  @Input('isSubmitting') isSubmitting: boolean;
  @Input('isDeleting') isDeleting: boolean;
  @Output() delete = new EventEmitter<Comment>();
  @Output() submitComment = new EventEmitter<Comment>();

  @Input('reset') set reset(isReset: boolean) {
    if (isReset) {
      this.commentControl.setValue('');
    }
  }

  commentControl = new FormControl('');

  deleteComment(comment: Comment): void {
    this.delete.emit(comment);
  }

  addComment() {
    this.submitComment.emit(this.commentControl.value.trim());
  }
}
