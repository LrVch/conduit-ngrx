import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input('showLoader') showLoader = false;
  @Input('loggedIn') loggedIn = false;
  @Input('user') user: User = {} as User;
}
