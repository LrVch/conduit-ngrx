import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material';

export interface Theme {
  value: string;
  viewValue: string;
  color: string;
}

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent {
  @Input('theme') theme: string;
  @Input('themes') themes: string;
  @Output() changeTheme = new EventEmitter<string>();

  onChangeTheme(selection: MatSelectChange) {
    this.changeTheme.emit(selection.value.toUpperCase());
  }
}
