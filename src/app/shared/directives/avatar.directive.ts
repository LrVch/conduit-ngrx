import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  NgZone,
  Input
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';

@Directive({
  selector: '[appAvatar]'
})
export class AvatarDirective implements AfterViewInit, OnDestroy {
  @Input('appAvatar') disableTransition: boolean;
  destroyStream$ = new Subject<any>();

  DEFAULT_AVATAR = '/assets/images/default-avatar.png';
  TIMEOUT = 2000;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      const img = this.el.nativeElement;
      const src = img.getAttribute('src');

      this.renderer.addClass(img, 'img-loading');

      if (this.disableTransition) {
        this.renderer.addClass(img, 'img-disable-transiton');
      }

      setTimeout(() => {
        if (!this.isImageOk()) {
          this.renderer.addClass(img, 'img-loaded');
          this.renderer.setAttribute(img, 'src', this.DEFAULT_AVATAR);
          // console.error(`image load timeout, image src is "${src}" `);
        }
      }, this.TIMEOUT);

      if (src.includes('smiley-cyrus')) {
        this.renderer.setAttribute(img, 'src', this.DEFAULT_AVATAR);
      }

      if (this.isImageOk()) {
        this.renderer.addClass(img, 'img-loaded-ok');
      }

      fromEvent(img, 'load')
        .pipe(takeUntil(this.destroyStream$))
        .subscribe(event => {
          this.renderer.addClass(img, 'img-loaded');
        });

      fromEvent(img, 'error')
        .pipe(
          first(),
          takeUntil(this.destroyStream$)
        )
        .subscribe(event => {
          this.renderer.addClass(img, 'img-loaded');
          // console.error(event);
          this.renderer.setAttribute(img, 'src', this.DEFAULT_AVATAR);
        });
    });
  }

  ngOnDestroy() {
    this.destroyStream$.next();
    this.destroyStream$.complete();
  }

  isImageOk() {
    const img = this.el.nativeElement;
    if (!img.complete) {
      return false;
    }

    if (img.naturalWidth === 0) {
      return false;
    }

    return true;
  }
}
