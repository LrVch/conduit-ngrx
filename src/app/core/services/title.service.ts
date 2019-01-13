import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap, take } from 'rxjs/operators';

import { environment as env } from '@env/environment';

@Injectable()
export class TitleService {
  constructor(
    private translateService: TranslateService,
    private title: Title
  ) {}

  setTitle(
    snapshot: ActivatedRouteSnapshot,
    lazyTranslateService?: TranslateService
  ) {
    let lastChild = snapshot;
    while (lastChild.children.length) {
      lastChild = lastChild.children[0];
    }
    const { title } = lastChild.data;
    const translate = lazyTranslateService || this.translateService;
    if (title) {
      translate
        .get(title)
        .pipe(take(1))
        .subscribe(translatedTitle => {
          this.title.setTitle(`${translatedTitle} - ${env.appName}`);
        }, console.error);
    } else {
      this.title.setTitle(env.appName);
    }
  }
}
