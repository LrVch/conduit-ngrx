import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding
} from '@angular/core';
import { Comment } from '@app/core';
import { commentAnimation } from '@app/shared/animations';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [commentAnimation]
})
export class CommentComponent {
  @Input('locale') locale = 'en';
  @Input('comment') comment: Comment = {} as Comment;
  @Input('canModify') canModify = false;
  @Output() delete = new EventEmitter<boolean>();

  @HostBinding('@commentAnimation') true;

  deleteComment(): void {
    if (this.comment.isDeleting) {
      return;
    }

    this.delete.emit(true);
  }
}
