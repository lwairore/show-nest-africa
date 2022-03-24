import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as Immutable from 'immutable';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { SocialMediaLinkFormatHttpResponse } from '../../custom-types';

@Component({
  selector: 'snap-social-media-links',
  templateUrl: './social-media-links.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaLinksComponent {
  socialMediaOwlCarouselConfigs: OwlOptions = {
    loop: false,
    margin: 20,
    autoplay: false,
    nav: true,
    dots: false,
    // responsiveClass: true,
    items: 4,
    slideBy: 2,
    navText: [
      `<i class="ion-ios-arrow-back"></i>`,
      `<i class="ion-ios-arrow-forward"></i>`
    ],
    responsive: {
      // Desktop
      1920: {
        items: 5,
        slideBy: 5,
      },
      1366: {
        items: 5,
        slideBy: 5,
      },
      1536: {
        items: 5,
        slideBy: 5,
      },
      1440: {
        items: 5,
        slideBy: 5,
      },
      1280: {
        items: 5,
        slideBy: 5,
      },
      1600: {
        items: 5,
        slideBy: 5,
      },
      1370: {
        items: 5,
        slideBy: 5,
      },
      1605: {
        items: 5,
        slideBy: 5,
      },
      1200: {
        items: 5,
        slideBy: 5,
      },
      1112: {
        items: 5,
        slideBy: 5,
      },
      1030: {
        items: 5,
        slideBy: 5,
      },
      1024: {
        items: 5,
        slideBy: 5,
      },



      // Laptop
      834: {
        items: 4,
        slideBy: 4,
      },
      906: {
        items: 4,
        slideBy: 4,
      },
      800: {
        items: 4,
        slideBy: 4,
      },
      962: {
        items: 4,
        slideBy: 4,
      },
      810: {
        items: 4,
        slideBy: 4,
      },
      910: {
        items: 4,
        slideBy: 4,
      },
      768: {
        items: 4,
        slideBy: 4,
      },

      // Mobile
      360: {
        items: 4,
        slideBy: 4
      },
      414: {
        items: 4,
        slideBy: 4
      },
      375: {
        items: 4,
        slideBy: 4
      },
      390: {
        items: 4,
        slideBy: 4
      },
      428: {
        items: 4,
        slideBy: 4
      },
      412: {
        items: 4,
        slideBy: 4
      },
      320: {
        items: 2,
        slideBy: 2
      },
      480: {
        items: 4,
        slideBy: 4
      },
      568: {
        items: 4,
        slideBy: 4
      },
      667: {
        items: 4,
        slideBy: 4
      },
      736: {
        items: 4,
        slideBy: 4
      },
      384: {
        items: 4,
        slideBy: 4
      },
      218: {
        items: 2,
        slideBy: 2
      },
      281: {
        items: 2,
        slideBy: 2
      },
      601: {
        items: 4,
        slideBy: 4
      },
      600: {
        items: 4,
        slideBy: 4
      },

    }
  }

  @ViewChild(CarouselComponent, { read: ElementRef, static: false })
  private _carouselCmpElRef: ElementRef | undefined;

  socialMediaLinks = Immutable.fromJS([]);

  @Input() showHeader = true;

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  setSocialMediaLinks(contactInfos: ReadonlyArray<SocialMediaLinkFormatHttpResponse>) {
    this.socialMediaLinks = Immutable.fromJS(contactInfos);

    if (!this.socialMediaLinks.isEmpty()) {
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
          '1%'
        );
      }
    }
  }

}
