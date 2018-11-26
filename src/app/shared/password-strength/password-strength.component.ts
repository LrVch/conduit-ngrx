import { Component, Input } from '@angular/core';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent {
  @Input() set password(password: string) {
    if (!password) {
      this.items = [];
      return;
    }
    this.result = zxcvbn(password).score + 1;
    this.items = Array.from({length: this.result});
  }

  result: number;
  items: any[];

  get clases() {
    return {
      'worst-pass': this.result === 1,
      'bad-pass': this.result === 2,
      'weak-pass': this.result === 3,
      'good-pass': this.result === 4,
      'strong-pass': this.result === 5,
    };
  }
}
