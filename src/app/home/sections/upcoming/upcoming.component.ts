import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { EventService } from '@sharedModule/services';
import * as Immutable from 'immutable';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { HoverCollapseComponent } from 'src/app/libs/hover-collapse/hover-collapse.component';

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
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._listUpcommingEvent();
  }

  ngOnDestroy(): void {
    this._unsubscribeListUpcommingEventSubscription();
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

  public hideStartsOnCollapse(loopIndex: number): void {
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
