import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article, Errors } from '@app/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { selectArticle, selectArticleSaving, selectEditorErrors } from '@app/editor/editor.selectors';
import { EditorArticleSaveRequest, EditorArticleClear, ClearEditorErrors } from '@app/editor/editor.actions';
import { CanComponentDeactivate } from '@app/core/services/can-deactivate.guard';
import { DialogService } from '@app/core/services/dialog.service';


export interface Tag {
  name: string;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  errors$: Observable<Errors>;
  isSubmitting$: Observable<boolean>;
  article$: Observable<Article>;

  wasChanged = false;

  constructor(
    private store: Store<AppState>,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.article$ = this.store.pipe(select(selectArticle));
    this.isSubmitting$ = this.store.pipe(select(selectArticleSaving));
    this.errors$ = this.store.pipe(select(selectEditorErrors));

    this.store.dispatch(new ClearEditorErrors());
  }

  ngOnDestroy() {
    this.store.dispatch(new EditorArticleClear());
  }

  onSubmit(article: Article) {
    this.store.dispatch(new EditorArticleSaveRequest({ article }));
  }

  onWasChanged(wasChanged: boolean) {
    this.wasChanged = wasChanged;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.wasChanged) {
      return true;
    }

    const dialogRef = this.dialog.confirmation({
      data: { question: 'You\'ll lost the data you have changed!' },
    });

    return dialogRef.afterClosed();
  }
}
