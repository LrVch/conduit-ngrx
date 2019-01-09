import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';

import { AppState } from '@app/reducers';
import { Store, select } from '@ngrx/store';
import { selectAuthLoggedIn } from '@app/auth/auth.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective implements OnInit, OnDestroy {
  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }

  destroy$ = new Subject<any>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store<AppState>
  ) {}

  condition: boolean;

  ngOnInit() {
    this.store
      .pipe(
        select(selectAuthLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(isAuthenticated => {
        if (
          (isAuthenticated && this.condition) ||
          (!isAuthenticated && !this.condition)
        ) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
