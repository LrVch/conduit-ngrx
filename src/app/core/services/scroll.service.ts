import { Injectable, NgZone } from '@angular/core';
import { resolve } from 'dns';
import { DomUtilService } from './dom-util.service';



@Injectable()
export class ScrollService {
  bodyElement: HTMLElement;

  constructor(
    private ngZone: NgZone,
    private domUtilService: DomUtilService
  ) {
    this.bodyElement = document.documentElement;
  }

  scrollToElem({ elem, offsetTop = 0, duration = 500 }: {
    elem: HTMLElement,
    offsetTop?: number,
    duration?: number
  } = {
      elem: null
    }): Promise<any> {
    if (!elem || !(elem instanceof HTMLElement)) {
      return;
    }

    const isElementInViewport = this.domUtilService.isElementInViewport({
      elem,
      offsetTop: offsetTop
    });

    if (isElementInViewport) {
      return Promise.resolve();
    }

    const top = elem.getBoundingClientRect().top;

    return new Promise(res => {
      this.ngZone.runOutsideAngular(() => {
        this.scrollTo(this.bodyElement, top + pageYOffset - offsetTop, duration)
          .then(res);
      });
    });
  }

  easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  scrollTo(element, to, duration) {
    const start = element.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    return new Promise((res) => {
      const animateScroll = () => {
        currentTime += increment;
        const val = this.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
          setTimeout(() => {
            animateScroll();
          }, increment);
        } else {
          res();
        }
      };
      animateScroll();
    });
  }
}
