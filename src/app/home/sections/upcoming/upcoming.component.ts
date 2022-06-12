import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { EventService } from '@sharedModule/services';
import * as Immutable from 'immutable';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { HoverCollapseComponent } from 'src/app/libs/hover-collapse/hover-collapse.component';
import { Router } from '@angular/router';

@Component({
  selector: 'snap-upcoming',
  templateUrl: './upcoming.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingComponent implements OnInit, AfterViewInit, OnDestroy {
  customOptionsForVideos: OwlOptions = {
    loop: false,
    margin: 30,
    touchDrag: false,
    mouseDrag: false,
    autoplay: false,
    nav: true,
    dots: false,
    // responsiveClass: true,
    items: 3,
    slideBy: 1,
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
        items: 2,
        slideBy: 2
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

  upcommingEvents = Immutable.fromJS([]);

  private _listUpcommingEventSubscription: Subscription | undefined;

  loadingDetails = false;

  collapseConfigs = Immutable.Map({
    artistName: 'collapse__collapseUsername',
    startsOn: 'collapse__collapseStartsOn'
  });

  @ViewChildren('artistNameCollapseEl', { read: HoverCollapseComponent })
  private _artistNameCollapseQl: QueryList<HoverCollapseComponent> | undefined;

  @ViewChildren('startsOnCollapseEl', { read: HoverCollapseComponent })
  private _startsOnCollapseQl: QueryList<HoverCollapseComponent> | undefined;


  constructor(
    private _eventService: EventService,
    private _renderer: Renderer2,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._listUpcommingEvent();
  }

  ngOnDestroy() {
    this._unsubscribeListUpcommingEventSubscription();
  }

  navigateToMomentDetail(momentID: number) {
    this._router.navigate([
      '/moments',
      momentID,
      'details'
    ]);
  }

  public hideArtistNameCollapse(loopIndex: number) {
    this._toggleArtistNameCollapse(loopIndex);
  }

  private _toggleArtistNameCollapse(loopIndex: number) {
    const hoverCollapseCmp = this._artistNameCollapseQl?.toArray()[loopIndex];

    if (hoverCollapseCmp instanceof HoverCollapseComponent) {
      hoverCollapseCmp.toggleCollapse();
    }
  }

  public showArtistNameCollapse(loopIndex: number) {
    this._toggleArtistNameCollapse(loopIndex);
  }

  public hideStartsOnCollapse(loopIndex: number) {
    this._toggleStartsOnCollapse(loopIndex);
  }

  private _toggleStartsOnCollapse(loopIndex: number) {
    const hoverCollapseCmp = this._startsOnCollapseQl?.toArray()[loopIndex];

    console.log({ hoverCollapseCmp });

    if (hoverCollapseCmp instanceof HoverCollapseComponent) {
      hoverCollapseCmp.toggleCollapse();
    }
  }

  public showStartsOnCollapse(loopIndex: number) {
    console.log({ loopIndex })
    this._toggleStartsOnCollapse(loopIndex);
  }

  private _unsubscribeListUpcommingEventSubscription() {
    if (this._listUpcommingEventSubscription instanceof Subscription) {
      this._listUpcommingEventSubscription.unsubscribe();
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

  private _listUpcommingEvent() {
    if (!this.loadingDetails) {
      this.loadingDetails = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listUpcommingEventSubscription = this._eventService
      .listUpcommingEvent$().subscribe(details => {
        this.upcommingEvents = Immutable.fromJS(details.results);

        if (!this.upcommingEvents.isEmpty()) {
          this.loadingDetails = false;

          this._manuallyTriggerChangeDetection();

          this._setTopForOwlNav();
        }

        console.log("this.loadingDetails")
        console.log(this.loadingDetails)
      }, err => {
        console.error(err);
      });
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
