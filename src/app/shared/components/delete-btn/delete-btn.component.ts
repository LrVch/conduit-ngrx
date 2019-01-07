import { Component, Input, Output, EventEmitter } from '@angular/core';
import { deleteButtonAnimationY, deleteButtonAnimationX } from '@app/shared/animations';

type AnimationType = 'x' | 'y';

@Component({
  selector: 'app-delete-btn',
  templateUrl: './delete-btn.component.html',
  styleUrls: ['./delete-btn.component.scss'],
  animations: [
    deleteButtonAnimationY,
    deleteButtonAnimationX
  ]
})
export class DeleteBtnComponent  {
  @Input('type') type: AnimationType = 'y';
  @Input('showConfirm') showConfirm = true;
  @Input('isDeleting') isDeleting = false;
  @Output() delete = new EventEmitter<null>();

  isOpenConfirm = false;

  onDelete() {
    this.delete.emit();
  }
}
