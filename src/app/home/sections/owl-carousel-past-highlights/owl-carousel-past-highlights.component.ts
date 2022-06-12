import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'snap-owl-carousel-past-highlights',
  templateUrl: './owl-carousel-past-highlights.component.html',
  styles: [
  ]
})
export class OwlCarouselPastHighlightsComponent implements OnInit {
  customOptionsForBanner: OwlOptions = {
    loop: true,
    margin: 0,
    autoplay: true,
    nav: false,
    dots: false,
    // responsiveClass: true,
    items: 1,
    slideBy: 1,
    responsive: {
      // Desktop
      1920: {
        items: 1,
        slideBy: 1,
      },
      1366: {
        items: 1,
        slideBy: 1,
      },
      1536: {
        items: 1,
        slideBy: 1,
      },
      1440: {
        items: 1,
        slideBy: 1,
      },
      1280: {
        items: 1,
        slideBy: 1,
      },
      1600: {
        items: 1,
        slideBy: 1,
      },
      1370: {
        items: 1,
        slideBy: 1,
      },
      1605: {
        items: 1,
        slideBy: 1,
      },
      1200: {
        items: 1,
        slideBy: 1,
      },
      1112: {
        items: 1,
        slideBy: 1,
      },
      1030: {
        items: 1,
        slideBy: 1,
      },
      1024: {
        items: 1,
        slideBy: 1,
      },

      // Laptop
      834: {
        items: 1,
        slideBy: 1,
      },
      906: {
        items: 1,
        slideBy: 1,
      },
      800: {
        items: 1,
        slideBy: 1,
      },
      962: {
        items: 1,
        slideBy: 1,
      },
      810: {
        items: 1,
        slideBy: 1,
      },
      910: {
        items: 1,
        slideBy: 1,
      },
      768: {
        items: 1,
        slideBy: 1,
      },

      // Mobile
      360: {
        items: 1,
        slideBy: 1
      },
      414: {
        items: 1,
        slideBy: 1
      },
      375: {
        items: 1,
        slideBy: 1
      },
      390: {
        items: 1,
        slideBy: 1
      },
      428: {
        items: 1,
        slideBy: 1
      },
      412: {
        items: 1,
        slideBy: 1
      },
      320: {
        items: 1,
        slideBy: 1
      },
      480: {
        items: 1,
        slideBy: 1
      },
      568: {
        items: 1,
        slideBy: 1
      },
      667: {
        items: 1,
        slideBy: 1
      },
      736: {
        items: 1,
        slideBy: 1
      },
      384: {
        items: 1,
        slideBy: 1
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
        items: 1,
        slideBy: 1
      },
      600: {
        items: 1,
        slideBy: 1
      },

    }
  }

  constructor() { }

  ngOnInit() {
  }

}
