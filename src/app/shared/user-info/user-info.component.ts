import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Profile } from 'src/app/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  @Input('profile') profile: Profile = {} as Profile;
  @Input('isUser') isUser = false;
  @Output() folowing = new EventEmitter<Profile>();


  onFollowedToggle(profile: Profile) {
    this.folowing.emit(profile);
  }
}
