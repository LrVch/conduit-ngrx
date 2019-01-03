import { Component, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { mergeAll, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class PaginatorComponent extends MatPaginatorIntl implements OnDestroy {
  unsubscribe$ = new Subject<any>();
  itemsPerPageLabel = '';
  lastPageLabel: string;
  firstPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;

  constructor(
    private translateService: TranslateService,
  ) {
    super();

    const soures = [
      'conduit.paginator.firstPageLabel',
      'conduit.paginator.lastPageLabel',
      'conduit.paginator.nextPageLabel',
      'conduit.paginator.previousPageLabel',
    ];

    this.translateService.onLangChange.pipe(
      map(() => this.translateService.get(soures)),
      mergeAll(),
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      this.firstPageLabel = res['conduit.paginator.firstPageLabel'];
      this.lastPageLabel = res['conduit.paginator.lastPageLabel'];
      this.nextPageLabel = res['conduit.paginator.nextPageLabel'];
      this.previousPageLabel = res['conduit.paginator.previousPageLabel'];
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
