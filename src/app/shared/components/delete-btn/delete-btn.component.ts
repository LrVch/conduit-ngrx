import { Component, Input, Output, EventEmitter } from '@angular/core';
import { deleteButtonAnimation } from '@app/shared/animations';

type AnimationType = 'x' | 'y';

@Component({
  selector: 'app-delete-btn',
  templateUrl: './delete-btn.component.html',
  styleUrls: ['./delete-btn.component.scss'],
  animations: [
    deleteButtonAnimation,
  ]
})
export class DeleteBtnComponent  {
  @Input('type') type: AnimationType = 'y';
  @Input('direction') direction = 'forward';
  @Input('showConfirm') showConfirm = true;
  @Input('isDeleting') isDeleting = false;
  @Output() delete = new EventEmitter<null>();

  isOpenConfirm = false;

  onDelete() {
    this.delete.emit();
  }
}
