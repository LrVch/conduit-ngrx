import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@app/core';
import { Language } from '@app/core/models/app-settings.model';
import { MatSelectChange } from '@angular/material';
import { trigger, style, transition, animate, group } from '@angular/animations';

export interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('avatarInOut', [
      transition(':enter', [
        style({ opacity: 0, width: 0, 'min-width': 0, transform: 'scale(0,1)' }),
        group([
          animate(100, style({  width: '*' })),
          animate(200, style({ opacity: 1, transform: 'scale(1,1)' })),
        ])
      ]),
      transition(':leave', [
        style({ 'min-width': 0}),
        group([
          animate(100, style({ opacity: 0, transform: 'scale(0,1)' })),
          animate(200, style({  width: 0, })),
        ])
      ])
    ])
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
