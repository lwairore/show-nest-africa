import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'snap-header',
  templateUrl: './header.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  routerEventSubscription: Subscription | undefined;

  ROOT_URL = '';

  isRoot = false;

  @Output() routeChanged = new EventEmitter<boolean>();



  constructor(
    private _router: Router,
    private _location: Location
  ) {
    this.routerEventSubscription
      = this._router.events
        .subscribe(
          (event: NavigationEvent) => {
            
            if (event instanceof NavigationEnd) {
              console.log('Route changed')
              if (this._location.path() !== this.ROOT_URL) {
                this.isRoot = false;
              } else {
                this.isRoot = true;
              }

              this.routeChanged.emit(true);
            }
          });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribeRouterEventSubscription();
  }


  private _unsubscribeRouterEventSubscription() {
    if (this.routerEventSubscription instanceof Subscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

}
