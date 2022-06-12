import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as Immutable from 'immutable';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { PrivacyNoticeService } from './services';
import { environment } from 'src/environments/environment';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';
import { ScrollService } from '@sharedModule/services';

@Component({
  selector: 'snap-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styles: [
    `.active {
      color: var(--primary-color);
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyNoticeComponent implements OnInit, AfterViewInit, OnDestroy {
  private _retrievePrivacyNoticeSubscription: Subscription | undefined;

  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  privacyNoticeDetails = Immutable.fromJS({});


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _loadingScreenService: LoadingScreenService,
    private _privacyNoticeService: PrivacyNoticeService,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();

    this._retrievePrivacyNotice();
  }

  ngOnDestroy() {
    this._unsubscribeRetrievePrivacyNoticeSubscription();
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _setBreadcrumbDetails() {
    const breadcrumbDetails = Immutable.fromJS({
      poster: {
        src: 'assets/images/background/asset-25.jpeg'
      },
    });

    if (this._breadcrumbCmpElRef instanceof BreadcrumbComponent) {
      this._breadcrumbCmpElRef.breadcrumbDetails = breadcrumbDetails;

      if (!this._breadcrumbCmpElRef.breadcrumbDetails.isEmpty()) {
        this._breadcrumbCmpElRef.manuallyTriggerChangeDetection();
      }
    }
  }

  get HOST_FULL_URL() {
    return environment.baseURL + this._router.url;
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _unsubscribeRetrievePrivacyNoticeSubscription() {
    if (this._retrievePrivacyNoticeSubscription instanceof Subscription) {
      this._retrievePrivacyNoticeSubscription.unsubscribe();
    }
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _retrievePrivacyNotice() {
    this._backToTop();
    
    this._startLoading();

    this._retrievePrivacyNoticeSubscription = this._privacyNoticeService
      .retrievePrivacyNotice$()
      .subscribe(details => {
        this.privacyNoticeDetails = Immutable.fromJS(details);

        this._manuallyTriggerChangeDetection();

        this._stopLoading();

      }, (err) => console.error(err));
  }

}
