import { Injectable } from '@angular/core';

@Injectable()
export class DomUtilService {

  constructor() { }

  isElementInViewport({ elem, offsetTop = 0, offsetLeft = 0 }: {
    elem: HTMLElement, offsetTop?: number, offsetLeft?: number
  } = { elem: null }): boolean {
    const rect = elem.getBoundingClientRect();

    return (
      rect.top >= offsetTop &&
      rect.left >= offsetLeft &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
