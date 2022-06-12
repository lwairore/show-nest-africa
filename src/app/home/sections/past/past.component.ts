import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { EventService } from '@sharedModule/services';
import * as Immutable from 'immutable';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { HoverCollapseComponent } from 'src/app/libs/hover-collapse/hover-collapse.component';
import { Router } from '@angular/router';

@Component({
  selector: 'snap-past',
  templateUrl: './past.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PastComponent implements OnInit, AfterViewInit, OnDestroy {
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

  pastEvents = Immutable.fromJS([]);

  private _listPastEventSubscription: Subscription | undefined;

  loadingDetails = false;

  collapseConfigs = Immutable.Map({
    endsOn: 'collapse__collapseStartsOn'
  });

  @ViewChildren('artistNameCollapseEl', { read: HoverCollapseComponent })
  private _artistNameCollapseQl: QueryList<HoverCollapseComponent> | undefined;

  @ViewChildren('endsOnCollapseEl', { read: HoverCollapseComponent })
  private _endsOnCollapseQl: QueryList<HoverCollapseComponent> | undefined;


  constructor(
    private _eventService: EventService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _renderer: Renderer2,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._listPastEvent();
  }

  ngOnDestroy() {
    this._unsubscribeListPastEventSubscription();
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

  trackByMomentID(index: number, moment: any) {
    return moment?.get('id');
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

  public hideEndsOnCollapse(loopIndex: number) {
    this._toggleEndsOnCollapse(loopIndex);
  }

  private _toggleEndsOnCollapse(loopIndex: number) {
    const hoverCollapseCmp = this._endsOnCollapseQl?.toArray()[loopIndex];

    if (hoverCollapseCmp instanceof HoverCollapseComponent) {
      hoverCollapseCmp.toggleCollapse();
    }
  }

  public showEndsOnCollapse(loopIndex: number) {
    this._toggleEndsOnCollapse(loopIndex);
  }

  private _setTopForOwlNav() {
    if (this._carouselCmpElRef instanceof ElementRef) {
      const OWL_NAVS = this._carouselCmpElRef.nativeElement
        .querySelectorAll('.owl-nav');

      for (const NAV_EL of OWL_NAVS) {
        this._renderer.setStyle(
          NAV_EL,
          'top',
          '32%'
        );
      }
    }
  }

  private _unsubscribeListPastEventSubscription() {
    if (this._listPastEventSubscription instanceof Subscription) {
      this._listPastEventSubscription.unsubscribe();
    }
  }

  private _listPastEvent() {
    if (!this.loadingDetails) {
      this.loadingDetails = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listPastEventSubscription = this._eventService
      .listPastEvent$().subscribe(details => {
        this.pastEvents = Immutable.fromJS(details.results);

        if (!this.pastEvents.isEmpty()) {
          this.loadingDetails = false;

          this._manuallyTriggerChangeDetection();

          this._setTopForOwlNav();
        }
      }, err => {
        console.error(err);
      });
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
