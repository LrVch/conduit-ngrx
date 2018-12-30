import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Errors } from '@app/core';

@Component({
  selector: 'app-list-error',
  templateUrl: './list-error.component.html',
  styleUrls: ['./list-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListErrorComponent {
  formattedErrors: Array<string> = [];

  @Input()
  set errors(errorList: Errors) {
    this.formattedErrors = Object.keys(errorList.errors || {})
      .map(key => `${key} ${errorList.errors[key]}`);
  }

  get errorList(): string[] {
    return this.formattedErrors;
  }
}
