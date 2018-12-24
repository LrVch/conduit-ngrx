import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-base-from',
  templateUrl: './base-from.component.html'
})
export class BaseFromComponent implements OnInit {
  @Input() set isSubmitting(isSubmitting: boolean) {
    this.submitting = isSubmitting;
    this.toggleDisableFields(this.form, isSubmitting);
  }

  submitting = false;
  form: FormGroup;

  ngOnInit() {
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  toggleDisableFields(formGroup: FormGroup, disable: boolean): void {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (disable) {
          control.disable();
        } else {
          control.enable();
        }
      } else if (control instanceof FormGroup) {
        this.toggleDisableFields(control, disable);
      }
    });
  }
}
