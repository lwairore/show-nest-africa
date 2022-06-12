import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScrollService } from '@sharedModule/services';

@Component({
  selector: 'snap-home',
  templateUrl: './home.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private _scrollService: ScrollService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._backToTop();
  }

  

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }
}
