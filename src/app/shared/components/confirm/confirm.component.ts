import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  question: string;
  successText: string;
  rejectText: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
  question: string;
  successText: string;
  rejectText: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    data = data || {} as DialogData;
    this.question = data.question || '';
    this.successText = data.successText || 'Ok';
    this.rejectText = data.rejectText || 'No Thanks';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
