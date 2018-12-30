import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ScrollService } from '@app/core';

@Directive({
  selector: '[appAccentOnInvalidFromField]'
})
export class AccentOnInvalidFromFieldDirective {

  @Input('appAccentOnInvalidFromField') appAccentOnInvalidFromField: NgForm;

  constructor(
    private el: ElementRef,
    private scrollService: ScrollService
  ) { }

  @HostListener('submit', ['$event'])
  onSubmit(event) {
    event.preventDefault();

    if (!this.appAccentOnInvalidFromField.valid) {
      let target;

      target = this.el.nativeElement.querySelector('textarea.ng-invalid, input.ng-invalid');

      if (target) {
        this.scrollService.scrollToElem({
          elem: target,
          offsetTop: 140
        }).then(_ => {
          target.focus();
        });
      }
    }
  }
}
