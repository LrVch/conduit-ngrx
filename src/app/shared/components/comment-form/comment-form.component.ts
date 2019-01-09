import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { User } from '@app/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFromComponent } from '../base-from/base-from.component';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent extends BaseFromComponent implements OnInit {
  @ViewChild('f') myNgForm;
  @Input('user') user: User = {} as User;
  @Input('reset') set reset(isReset: boolean) {
    if (isReset) {
      if (this.myNgForm && this.form) {
        this.myNgForm.resetForm();
      }
    }
  }
  @Output() submitComment = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      comment: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.submitComment.emit(this.form.get('comment').value.trim());
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  get commentControl() {
    return this.form.get('comment');
  }

  get requiredComment() {
    return this.commentControl.hasError('required');
  }
}
