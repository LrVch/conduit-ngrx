import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article, Errors } from 'src/app/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectArticle, selectArticleSaving, selectEditorErrors } from '../editor.selectors';
import { EditorArticleSaveRequest, EditorArticleClear, ClearEditorErrors } from '../editor.actions';
import { CanComponentDeactivate } from 'src/app/core/services/can-deactivate.guard';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from 'src/app/shared';


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

  wasChanged: boolean;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
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
    // console.log(this.wasChanged);
  }

  canDeactivate(): Observable<boolean> | boolean {
    // console.log(this.wasChanged)
    if (!this.wasChanged) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: { question: 'You\'ll lost the data you have changed!' }
    });

    return dialogRef.afterClosed();
  }
}
