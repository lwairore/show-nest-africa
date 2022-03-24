import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser, isPlatformServer, Location, SlicePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { IntToRGBPipe } from '@sharedModule/pipes/int-to-rgb.pipe';
import { AuthenticationService } from '@sharedModule/services';
import { convertItemToString, stringIsEmpty } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'snap-header',
  templateUrl: './header.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SlicePipe,
    UpperCasePipe,
    IntToRGBPipe,
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  routerEventSubscription: Subscription | undefined;

  ROOT_URL = '';

  isRoot = false;

  @Output() routeChanged = new EventEmitter<boolean>();

  currentUserDetails = Immutable.Map({
    isLoggedIn: false,
    emailFirstChar: '',
    background: ''
  });

  constructor(
    private _router: Router,
    private _location: Location,
    private platform: Platform,
    @Inject(PLATFORM_ID) private platformId: any,
    private authenticationService: AuthenticationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _slicePipe: SlicePipe,
    private _upperCasePipe: UpperCasePipe,
    private _intToRGBPipe: IntToRGBPipe,

  ) {
    this._subscribeToRouterEvents();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.validateIfUserIsLoggedIn();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeRouterEventSubscription();
  }

  private _intToRGB(value: any) {
    return this._intToRGBPipe.transform(value);
  }

  private _sliceItem(value: string, start: number, end?: number) {
    return this._slicePipe.transform(
      value, start, end);
  }

  private _upperCaseItem(value: string) {
    return this._upperCasePipe.transform(value);
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  validateIfUserIsLoggedIn(): void {
    const CURRENT_USER_EMAIL = convertItemToString(
      this.authenticationService.currentUserEmail);

    if (!stringIsEmpty(CURRENT_USER_EMAIL)) {
      this.currentUserDetails = this.currentUserDetails
        .set('isLoggedIn', true);

      const EMAIL_FIRST_CHAR = this._upperCaseItem(
        this._sliceItem(CURRENT_USER_EMAIL, 0, 1))

      this.currentUserDetails = this.currentUserDetails
        .set('emailFirstChar', EMAIL_FIRST_CHAR);

      this.currentUserDetails = this.currentUserDetails
        .set('background', this._intToRGB(
          CURRENT_USER_EMAIL));

      this._manuallyTriggerChangeDetection();
    }
  }

  private _subscribeToRouterEvents() {
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


  private _unsubscribeRouterEventSubscription() {
    if (this.routerEventSubscription instanceof Subscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

}
