import { Component, Input } from '@angular/core';

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
    this.result = this.checkPassStrength(password);
    this.items = Array.from({ length: this.result });
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

  evaluateIt(pass: string): number {
    let score = 0;
    if (!pass) {
      return score;
    }

    // award every unique letter until 5 repetitions
    const letters = {};
    for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      special: /[\~\`\_\-\=\:\;\'\"\!\^\@\#\$\&\*\(\)\%\{\}\[\]\<\>,\.\?\s]/.test(
        pass
      ),
      nonWords: /\W/.test(pass)
    };

    let variationCount = 0;
    for (const check in variations) {
      if (variations[check]) {
        variationCount += 1;
      } else {
        variationCount += 0;
      }
    }
    score += (variationCount - 1) * 10;

    return score;
  }

  checkPassStrength(pass: string): number {
    const score: number = this.evaluateIt(pass);
    if (score >= 80) {
      return 5;
    }
    if (score >= 70) {
      return 4;
    }
    if (score >= 60) {
      return 3;
    }
    if (score >= 30) {
      return 2;
    }
    return 1;
  }
}
