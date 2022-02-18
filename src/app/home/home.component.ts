import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'snap-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  customOptionsForBanner: OwlOptions = {
    loop: true,
    margin: 0,
    autoplay: true,
    nav: false,
    dots: false,
    // responsiveClass: true,

    slideBy: 1,
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 1,
        slideBy: 1,
        nav: false,
      },
      991: {
        items: 1,
        slideBy: 1,
        nav: false,
      },
      1024: {
        items: 1,
        slideBy: 1,
        autoplay: true
      }
    },
  }

  customOptionsForVideos: OwlOptions = {
    loop: false,
    margin: 30,
    autoplay: false,
    nav: false,
    dots: false,
    // responsiveClass: true,
    items: 3,
    slideBy: 1,
    // responsive: {
    //   0: {
    //     items: 1
    //   },
    //   480: {
    //     items: 1,
    //     slideBy: 1,
    //     nav: false,
    //   },
    //   991: {
    //     items: 4,
    //     slideBy: 1,
    //     nav: false,
    //   },
    //   1024: {
    //     items: 4,
    //     slideBy: 1,
    //     autoplay: true
    //   }
    // },
  }

  customOptionsForImages: OwlOptions = {
    loop: true,
    margin: 30,
    autoplay: true,
    nav: false,
    dots: true,
    // responsiveClass: true,
    items: 1,
    slideBy: 1,

  }

  constructor() { }

  ngOnInit(): void {
  }

}
