import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User, Comment } from '@app/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  @Input('locale') locale: string;
  @Input('comments') comments: Comment[] = [];
  @Input('user') user: User = {} as User;
  @Input('loading') loading = false;
  @Input('isSubmitting') isSubmitting = false;
  @Output() delete = new EventEmitter<Comment>();
  @Output() submitComment = new EventEmitter<Comment>();

  @Input('reset') reset = false;

  deleteComment(comment: Comment): void {
    this.delete.emit(comment);
  }

  addComment(comment) {
    this.submitComment.emit(comment);
  }
}
