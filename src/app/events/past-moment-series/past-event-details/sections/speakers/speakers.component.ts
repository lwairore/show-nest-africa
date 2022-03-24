import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as Immutable from 'immutable';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { SpeakerFormatHttpResponse } from '../../custom-types';

@Component({
  selector: 'snap-speakers',
  templateUrl: './speakers.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeakersComponent {
  customOptionsForVideos: OwlOptions = {
    loop: false,
    margin: 30,
    autoplay: false,
    nav: true,
    dots: false,
    // responsiveClass: true,
    items: 2,
    slideBy: 1,
    navText: [
      `<i class="ion-ios-arrow-back"></i>`,
      `<i class="ion-ios-arrow-forward"></i>`
    ],
    responsive: {
      // Desktop
      1920: {
        items: 3,
        slideBy: 3,
      },
      1366: {
        items: 3,
        slideBy: 3,
      },
      1536: {
        items: 3,
        slideBy: 3,
      },
      1440: {
        items: 3,
        slideBy: 3,
      },
      1280: {
        items: 3,
        slideBy: 3,
      },
      1600: {
        items: 3,
        slideBy: 3,
      },
      1370: {
        items: 3,
        slideBy: 3,
      },
      1605: {
        items: 3,
        slideBy: 3,
      },
      1200: {
        items: 3,
        slideBy: 3,
      },
      1112: {
        items: 3,
        slideBy: 3,
      },
      1030: {
        items: 3,
        slideBy: 3,
      },
      1024: {
        items: 3,
        slideBy: 3,
      },



      // Laptop
      834: {
        items: 2,
        slideBy: 2,
      },
      906: {
        items: 2,
        slideBy: 2,
      },
      800: {
        items: 2,
        slideBy: 2,
      },
      962: {
        items: 2,
        slideBy: 2,
      },
      810: {
        items: 2,
        slideBy: 2,
      },
      910: {
        items: 2,
        slideBy: 2,
      },
      768: {
        items: 2,
        slideBy: 2,
      },

      // Mobile
      360: {
        items: 2,
        slideBy: 2
      },
      414: {
        items: 2,
        slideBy: 2
      },
      375: {
        items: 2,
        slideBy: 2
      },
      390: {
        items: 2,
        slideBy: 2
      },
      428: {
        items: 2,
        slideBy: 2
      },
      412: {
        items: 2,
        slideBy: 2
      },
      320: {
        items: 1,
        slideBy: 1
      },
      480: {
        items: 2,
        slideBy: 2
      },
      568: {
        items: 2,
        slideBy: 2
      },
      667: {
        items: 2,
        slideBy: 2
      },
      736: {
        items: 2,
        slideBy: 2
      },
      384: {
        items: 2,
        slideBy: 2
      },
      218: {
        items: 1,
        slideBy: 1
      },
      281: {
        items: 1,
        slideBy: 1
      },
      601: {
        items: 2,
        slideBy: 2
      },
      600: {
        items: 2,
        slideBy: 2
      },

    }
  }

  @ViewChild(CarouselComponent, { read: ElementRef, static: false })
  private _carouselCmpElRef: ElementRef | undefined;

  speakers = Immutable.fromJS([]);

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  setSpeakers(speakers: ReadonlyArray<SpeakerFormatHttpResponse>) {
    this.speakers = Immutable.fromJS(speakers);
    if (!this.speakers.isEmpty()) {
      this._manuallyTriggerChangeDetection();

      this._setTopForOwlNav();
    }
  }

  private _setTopForOwlNav() {
    if (this._carouselCmpElRef instanceof ElementRef) {
      const OWL_NAVS = this._carouselCmpElRef.nativeElement
        .querySelectorAll('.owl-nav');

      console.log({ OWL_NAVS });

      for (const NAV_EL of OWL_NAVS) {
        this._renderer.setStyle(
          NAV_EL,
          'top',
          '32%'
        );
      }
    }
  }
}
