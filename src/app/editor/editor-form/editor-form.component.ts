import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Article } from 'src/app/core';
import { Tag } from '../editor/editor.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-editor-form',
  templateUrl: './editor-form.component.html'
})
export class EditorFormComponent implements OnInit {
  @Input('article') article: Article = {} as Article;
  @Input('disabled') disabled: boolean;
  @Output() onsubmit = new EventEmitter<Article>();

  articleForm: FormGroup;
  tags: Tag[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder
  ) {
    this.articleForm = this.fb.group({
      title: '',
      description: '',
      body: ''
    });
  }

  ngOnInit() {
    if (this.article) {
      this.articleForm.patchValue(this.article);
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

  submitForm() {
    const result = Object.assign({}, this.article, this.articleForm.value);
    result.tagList = this.tags.map(tag => tag.name);

    this.onsubmit.emit(result);
  }
}
