import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { constructResponsiveSettings } from '../shared/screen-resolution-sizes.const';

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
    items: 1,
    slideBy: 1,
  }

  customOptionsForVideos: OwlOptions = {
    loop: false,
    margin: 30,
    autoplay: false,
    nav: true,
    dots: false,
    // responsiveClass: true,
    items: 3,
    slideBy: 1,
    navText: [
      `<i class="ion-ios-arrow-back"></i>`,
      `<i class="ion-ios-arrow-forward"></i>`
    ]
  }

  customOptionsForImages: OwlOptions = {
    loop: true,
    margin: 30,
    autoplay: true,
    nav: false,
    dots: false,
    // responsiveClass: true,
    items: 1,
    slideBy: 1,

  }

  constructor() { }

  ngOnInit(): void {
    this.constructAndSetResponsiveSettingsForBanner();

    this.constructAndSetResponsiveSettingsForVideos();

    this.constructAndSetResponsiveSettingsForImages();
  }

  constructAndSetResponsiveSettingsForBanner() {
    const DESKTOP_RESPONSIVE_SETTINGS = { items: 1 };
    const LAPTOP_RESPONSIVE_SETTINGS = { items: 1 };
    const TABLET_RESPONSIVE_SETTINGS = { items: 1 };
    const MOBILE_RESPONSIVE_SETTINGS = { items: 1 };

    this.customOptionsForBanner.responsive = constructResponsiveSettings(
      DESKTOP_RESPONSIVE_SETTINGS,
      LAPTOP_RESPONSIVE_SETTINGS,
      TABLET_RESPONSIVE_SETTINGS,
      MOBILE_RESPONSIVE_SETTINGS);

  }

  constructAndSetResponsiveSettingsForVideos() {
    const DESKTOP_RESPONSIVE_SETTINGS = { items: 4 };
    const LAPTOP_RESPONSIVE_SETTINGS = { items: 3 };
    const TABLET_RESPONSIVE_SETTINGS = { items: 2 };
    const MOBILE_RESPONSIVE_SETTINGS = { items: 1 };

    this.customOptionsForVideos.responsive = constructResponsiveSettings(
      DESKTOP_RESPONSIVE_SETTINGS,
      LAPTOP_RESPONSIVE_SETTINGS,
      TABLET_RESPONSIVE_SETTINGS,
      MOBILE_RESPONSIVE_SETTINGS);
  }

  constructAndSetResponsiveSettingsForImages() {
    const DESKTOP_RESPONSIVE_SETTINGS = { items: 1 };
    const LAPTOP_RESPONSIVE_SETTINGS = { items: 1 };
    const TABLET_RESPONSIVE_SETTINGS = { items: 1 };
    const MOBILE_RESPONSIVE_SETTINGS = { items: 1 };

    this.customOptionsForImages.responsive = constructResponsiveSettings(
      DESKTOP_RESPONSIVE_SETTINGS,
      LAPTOP_RESPONSIVE_SETTINGS,
      TABLET_RESPONSIVE_SETTINGS,
      MOBILE_RESPONSIVE_SETTINGS);
  }
}
