import { Component, Input } from '@angular/core';
// import * as zxcvbn from 'zxcvbn';

// const zxcvbnFn = zxcvbn || (<any>window).zxcvbn;

enum strength {
  worst = 1,
  bad = 2,
  weak = 3,
  good = 4,
  strong = 5
}

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
    // this.result = zxcvbnFn(password).score + 1;
    // this.items = Array.from({ length: this.result });
  }

  result: number;
  items: any[];

  get clases() {
    return {
      'worst-pass': this.result === strength.worst,
      'bad-pass': this.result === strength.bad,
      'weak-pass': this.result === strength.weak,
      'good-pass': this.result === strength.good,
      'strong-pass': this.result === strength.strong
    };
  }
}
