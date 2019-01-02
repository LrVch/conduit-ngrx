import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Article } from '@app/core';
import { Tag } from '../editor/editor.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BaseFromComponent } from '@app/shared';
import { withLatestFrom, debounceTime, map, startWith, takeUntil, tap, distinctUntilChanged } from 'rxjs/operators';
import { of, Observable, Subject, combineLatest, BehaviorSubject, merge, asyncScheduler } from 'rxjs';

@Component({
  selector: 'app-editor-form',
  templateUrl: './editor-form.component.html'
})
export class EditorFormComponent extends BaseFromComponent implements OnInit, OnDestroy {
  @Input('article') article: Article = {} as Article;
  @Output() onsubmit = new EventEmitter<Article>();
  @Output() wasChanged = new EventEmitter<boolean>();

  initState$ = new BehaviorSubject<{ form: {}, tags: Tag[] }>({ form: {}, tags: [] });
  unsubscribe$ = new Subject<any>();
  tags$ = new BehaviorSubject<Tag[]>([]);
  tagsObs$ = this.tags$.asObservable();

  tags: Tag[] = [];
  tagConfig = {
    selectable: true,
    removable: true,
    addOnBlur: true
  };

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });

    if (this.article) {
      this.form.patchValue(this.article);
      this.tags = this.article.tagList.map(tag => ({ name: tag }));
    }

    this.initState$.next({ form: this.form.value, tags: this.tags });
    this.tags$.next(this.tags);

    combineLatest(this.form.valueChanges.pipe(startWith(this.form.value)), this.tagsObs$).pipe(
      map(([form, tags]) => ({ form, tags })),
      tap(console.log),
      withLatestFrom(this.initState$),
      debounceTime(200),
      map(([form, initState]) => JSON.stringify(form) === JSON.stringify(initState)),
      startWith(true),
      takeUntil(this.unsubscribe$)
    ).subscribe(value => {
      this.wasChanged.emit(!value);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.tags$.complete();
  }

  addTag($event) {
    const tagName = $event.value;
    const input = $event.input;

    if ((tagName || '').trim() && this.tags.indexOf(tagName) < 0) {
      this.tags = [...this.tags, { name: tagName.trim() }];
      this.tags$.next(this.tags);
    }

    input.value = '';
  }

  removeTag(tagToRemove: Tag) {
    this.tags = this.tags.filter(tag => tag.name !== tagToRemove.name);
    this.tags$.next(this.tags);
  }

  submit() {
    if (this.form.valid) {
      const article = Object.assign({}, this.article, this.form.value);
      article.tagList = this.tags.map(tag => tag.name);

      this.initState$.next({ form: this.form.value, tags: this.tags });
      this.onsubmit.emit(article);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  get titleControl() {
    return this.form.get('title');
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  get bodyControl() {
    return this.form.get('body');
  }

  get requiredTitle() {
    return this.titleControl.hasError('required');
  }

  get requiredDescription() {
    return this.descriptionControl.hasError('required');
  }

  get requiredBody() {
    return this.bodyControl.hasError('required');
  }
}
