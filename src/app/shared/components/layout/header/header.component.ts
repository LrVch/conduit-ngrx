import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@app/core';
import { Language } from '@app/core/models/app-settings.model';
import { MatSelectChange } from '@angular/material';
import { avatarInOut } from '@app/shared/animations';

export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    avatarInOut
  ]
})
export class HeaderComponent {
  @Input('showLoader') showLoader = false;
  @Input('loggedIn') loggedIn = false;
  @Input('user') user: User = {} as User;
  @Input('languages') languages: Option[];
  @Input('language') language: string;
  @Output() changeLanguage = new EventEmitter<string>();
  @Output() toggleSideNave = new EventEmitter<boolean>();

  onLanguageSelect(choice: MatSelectChange) {
    this.changeLanguage.emit(choice.value as Language);
  }

  onToggleSideNave() {
    this.toggleSideNave.emit(true);
  }
}
