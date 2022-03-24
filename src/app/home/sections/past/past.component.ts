import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { EventService } from '@sharedModule/services';
import * as Immutable from 'immutable';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { HoverCollapseComponent } from 'src/app/libs/hover-collapse/hover-collapse.component';

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
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._listPastEvent();
  }

  ngOnDestroy(): void {
    this._unsubscribeListPastEventSubscription();
  }

  public hideArtistNameCollapse(loopIndex: number): void {
    this._toggleArtistNameCollapse(loopIndex);
  }

  private _toggleArtistNameCollapse(loopIndex: number) {
    const hoverCollapseCmp = this._artistNameCollapseQl?.toArray()[loopIndex];

    console.log({ hoverCollapseCmp });

    if (hoverCollapseCmp instanceof HoverCollapseComponent) {
      hoverCollapseCmp.toggleCollapse();
    }
  }

  public showArtistNameCollapse(loopIndex: number) {
    console.log({ loopIndex })
    this._toggleArtistNameCollapse(loopIndex);
  }

  public hideEndsOnCollapse(loopIndex: number): void {
    this._toggleEndsOnCollapse(loopIndex);
  }

  private _toggleEndsOnCollapse(loopIndex: number) {
    const hoverCollapseCmp = this._endsOnCollapseQl?.toArray()[loopIndex];

    console.log({ hoverCollapseCmp });

    if (hoverCollapseCmp instanceof HoverCollapseComponent) {
      hoverCollapseCmp.toggleCollapse();
    }
  }

  public showEndsOnCollapse(loopIndex: number) {
    console.log({ loopIndex })
    this._toggleEndsOnCollapse(loopIndex);
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
