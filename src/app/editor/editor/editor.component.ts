import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article, Errors } from 'src/app/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectArticle, selectArticleSaving, selectEditorErrors } from '../editor.selectors';
import { EditorArticleSaveRequest, EditorArticleClear, ClearEditorErrors } from '../editor.actions';


export interface Tag {
  name: string;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  errors$: Observable<Errors>;
  isSubmitting$: Observable<boolean>;
  article$: Observable<Article>;

  constructor(
    private store: Store<AppState>
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
}
