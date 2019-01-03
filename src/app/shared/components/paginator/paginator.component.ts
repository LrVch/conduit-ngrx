import { Component, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { mergeAll, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class PaginatorComponent extends MatPaginatorIntl implements OnDestroy {
  // unsubscribe$ = new Subject<any>();
  itemsPerPageLabel = '';

  constructor(
    private translateService: TranslateService,
  ) {
    super();

    // this.translateService.onLangChange.pipe(
    //   map(() => this.translateService.get('conduit.itemsPerPageLabel')),
    //   mergeAll(),
    //   takeUntil(this.unsubscribe$)
    // ).subscribe(res => {
    //   this.itemsPerPageLabel = res;
    //   // console.log(this.itemsPerPageLabel);
    // });

  }

  ngOnDestroy() {
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }
}
