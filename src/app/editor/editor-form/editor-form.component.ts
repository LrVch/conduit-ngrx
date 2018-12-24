import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Article } from 'src/app/core';
import { Tag } from '../editor/editor.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BaseFromComponent } from 'src/app/shared';

@Component({
  selector: 'app-editor-form',
  templateUrl: './editor-form.component.html'
})
export class EditorFormComponent extends BaseFromComponent implements OnInit {
  @Input('article') article: Article = {} as Article;
  @Output() onsubmit = new EventEmitter<Article>();

  articleForm: FormGroup;
  tags: Tag[] = [];
  tagaConfig = {
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
  }

  addTag($event) {
    const tagName = $event.value;
    const input = $event.input;

    if ((tagName || '').trim() && this.tags.indexOf(tagName) < 0) {
      this.tags = [...this.tags, { name: tagName.trim() }];
    }

    input.value = '';
  }

  removeTag(tagToRemove: Tag) {
    this.tags = this.tags.filter(tag => tag.name !== tagToRemove.name);
  }

  submit() {
    if (this.form.valid) {
      const article = Object.assign({}, this.article, this.form.value);
      article.tagList = this.tags.map(tag => tag.name);

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
