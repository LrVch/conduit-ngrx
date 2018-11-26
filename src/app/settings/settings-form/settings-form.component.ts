import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { User } from 'src/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnChanges {
  @Input('disabled') disabled: boolean;
  @Input('user') user: User;

  @Output() updateUser = new EventEmitter<User>();

  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.settingsForm = this.fb.group({
      image: '',
      username: ['', Validators.required],
      bio: '',
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue) {
      this.settingsForm.patchValue(changes.user.currentValue);
    }
  }

  submitForm({ value, valid }) {
    this.updateUser.emit(value);
  }
}
