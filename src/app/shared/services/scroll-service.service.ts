import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor(
    private viewportScroller: ViewportScroller,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  scrollToAnchor(anchor: string) {
    this.viewportScroller.scrollToAnchor(anchor);
  }

  scrollToPosition(x: number, y: number) {
    this.viewportScroller.scrollToPosition([x, y]);
  }

  animatedScrollToTop() {
    const BACK_TO_TOP_EL = this._document.getElementById('top');

    console.log({BACK_TO_TOP_EL})
    if (BACK_TO_TOP_EL instanceof HTMLAnchorElement) {
      BACK_TO_TOP_EL.click();
    }
  }
}