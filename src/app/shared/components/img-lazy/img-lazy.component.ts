import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { getBoolean } from '@sharedModule/utilities';
import * as Immutable from 'immutable';

@Component({
  selector: 'snap-img-lazy',
  templateUrl: './img-lazy.component.html',
  styles: [
    `.moment-img-container {
      width: 100%;
      height: 320px;
      margin: auto;
      overflow: hidden;
  }

  @media (min-width: 1200px) {
      .moment-img-container {
          width: 100%;
          height: 450.125px;
      }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
      .moment-img-container {
          width: 100%;
          height: 450.75px;
      }
  }

  @media (min-width: 768px) and (max-width: 991px) {
      .moment-img-container {
          width: 100%;
          height: 409.5px;
      }
  }

  .moment-round-img-card {
      border-bottom-left-radius: 5%;
      border-bottom-right-radius: 5%;
      border-top-left-radius: 5%;
      border-top-right-radius: 5%;
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgLazyComponent implements OnInit {
  @Input() src = '';

  @Input() alt = '';

  @Input() height = '100%';

  @Input() width = '100%';

  @Output() isVisible = new EventEmitter();

  @Output() imageClicked = new EventEmitter<boolean>();



  @Input() appearance: ('' | 'line' | 'circle') = '';

  @Input() momentRoundImgCard = true;

  @Input() imgClass = '';

  // Modify with setState
  state = Immutable.Map({
    visible: false,
    loaded: false
  });

  getBoolean = getBoolean;


  constructor(
    private _elementRef: ElementRef,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._calcVisibility();
  }

  reportImageClicked() {
    this.imageClicked.emit(true);
  }

  private _setState(key: string, value: boolean) {
    this.state = this.state.set(key, value);

    this._changeDetectionRef.detectChanges();
  }

  private _calcVisibility() {
    const top = this._elementRef.nativeElement.getBoundingClientRect().top;
    // `getBoundingClientRect` will give us the actual measurement of that element.

    const visibleState = this.getBoolean(this.state.get('visible'));

    if (top <= window.innerHeight && !visibleState) {
      // Change value and render
      this._setState('visible', true);

      // // Emit a custom public event
      // this.customEmit(true);
    }


  }

  @HostListener('window:scroll', ['$event'])
  onscroll(e: any) {
    this._calcVisibility();
  }

  onLoad() {
    this._setState('loaded', true);
  }
}
