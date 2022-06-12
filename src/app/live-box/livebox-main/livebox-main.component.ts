import { ViewportRuler } from '@angular/cdk/scrolling'
import { AfterViewInit, Component, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { convertItemToNumeric, isANumber } from '@sharedModule/utilities';
import { BreakpointOptions, CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselService } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { constructResponsiveSettings } from 'src/app/shared/screen-resolution-sizes.const';

@Component({
  selector: 'snap-livebox-main',
  templateUrl: './livebox-main.component.html',
  styles: [
  ]
})
export class LiveboxMainComponent implements OnInit, AfterViewInit, OnDestroy {
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

  loadItems = false;


  @ViewChild('owlElement') owlElement: CarouselComponent | undefined;

  width: number | undefined;

  height: number | undefined;

  private readonly viewportChange = this.viewportRuler
    .change(200)
    .subscribe(() => this.ngZone.run(() => this.setSize()));

  constructor(
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone
  ) {
    // Change happens well, on change. The first load is not a change, so we init the values here. (You can use `startWith` operator too.)
    this.setSize();
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.constructAndSetResponsiveSettingsForBanner();

    this.constructAndSetResponsiveSettingsForVideos();
  }

  ngOnDestroy() {
    this.viewportChange.unsubscribe();
  }


  private setSize() {
    const { width, height } = this.viewportRuler.getViewportSize();
    this.width = width;
    this.height = height;

    this.onResize();
  }


  onResize() {
    if (this.owlElement instanceof CarouselComponent) {
      const innerWidth = convertItemToNumeric(this.width);

      if (isANumber(innerWidth)) {
        let anyService = this.owlElement as any;
        let carouselService = anyService.carouselService as CarouselService;
        carouselService?.onResize(innerWidth);
      }
    }

  }

  constructAndSetResponsiveSettingsForBanner() {
    const DESKTOP_RESPONSIVE_SETTINGS: BreakpointOptions = { items: 1 };
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
    const DESKTOP_RESPONSIVE_SETTINGS: BreakpointOptions = {
      items: 4,
      slideBy: 4
    };
    const LAPTOP_RESPONSIVE_SETTINGS: BreakpointOptions = {
      items: 3,
      slideBy: 3
    };
    const TABLET_RESPONSIVE_SETTINGS: BreakpointOptions = {
      items: 2,
      slideBy: 2
    };
    const MOBILE_RESPONSIVE_SETTINGS: BreakpointOptions = {
      items: 1,
      slideBy: 1
    };

    this.customOptionsForVideos.responsive = constructResponsiveSettings(
      DESKTOP_RESPONSIVE_SETTINGS,
      LAPTOP_RESPONSIVE_SETTINGS,
      TABLET_RESPONSIVE_SETTINGS,
      MOBILE_RESPONSIVE_SETTINGS);

  }

  refresh() {
    if (!(this.owlElement instanceof CarouselComponent)) {
      return;
    }

    const anyService = this.owlElement as any;
    const carouselService = anyService.carouselService as CarouselService;

    carouselService.refresh();
    carouselService.update();
  }
}
