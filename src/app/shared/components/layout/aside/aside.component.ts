import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange, MatSlideToggleChange } from '@angular/material';
import { AsideOpenMode } from '@app/core/models/app-settings.model';

export interface Theme {
  value: string;
  viewValue: string;
  color: string;
}

export interface AsideMode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent {
  @Input('autoNightModeFrom') autoNightModeFrom: number;
  @Input('autoNightModeTo') autoNightModeTo: number;
  @Input('autoNightMode') autoNightMode: boolean;
  @Input('asideOpenMode') asideOpenMode: AsideOpenMode;
  @Input('asideOpenModes') asideOpenModes: AsideMode[];
  @Input('theme') theme: string;
  @Input('themes') themes: Theme[];
  @Input('stickyHeader') stickyHeader: boolean;
  @Output() changeTheme = new EventEmitter<string>();
  @Output() changeStickyHeader = new EventEmitter<boolean>();
  @Output() changeAsideOpenMode = new EventEmitter<AsideOpenMode>();
  @Output() changeAutoNightMode = new EventEmitter<boolean>();
  @Output() changeAutoNightModeFrom = new EventEmitter<number>();
  @Output() changeAutoNightModeTo = new EventEmitter<number>();

  onChangeTheme(selection: MatSelectChange) {
    this.changeTheme.emit(selection.value.toUpperCase());
  }

  onStickyHeaderToggle(selection: MatSlideToggleChange) {
    this.changeStickyHeader.emit(selection.checked);
  }

  onChangeAsideOpenMode(selection: MatSelectChange) {
    this.changeAsideOpenMode.emit(selection.value);
  }

  onChangeAutoNightMode(selection: MatSlideToggleChange) {
    this.changeAutoNightMode.emit(selection.checked);
  }

  onChangeAutoNightModeFrom(outTime: string) {
    const time = outTime.split(':').join('.');
    this.changeAutoNightModeFrom.emit(Number(time));
  }

  oncangeAutoNightModeTo(outTime: string) {
    const time = outTime.split(':').join('.');
    this.changeAutoNightModeTo.emit(Number(time));
  }
}
