import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import * as Immutable from 'immutable';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { Subscription } from 'rxjs';
import { TermsOfUseService } from './services';
import { environment } from 'src/environments/environment';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';
import { ScrollService } from '@sharedModule/services';

@Component({
  selector: 'snap-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styles: [
    `.active {
      color: var(--primary-color);
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfUseComponent implements OnInit, AfterViewInit, OnDestroy {
  private _retrieveTermsOfUseSubscription: Subscription | undefined;

  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  termsOfUseDetails = Immutable.fromJS({});

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _loadingScreenService: LoadingScreenService,
    private _termsOfUseService: TermsOfUseService,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();

    this._retrieveTermsOfUse();
  }

  ngOnDestroy() {
    this._unsubscribeRetrieveTermsOfUseSubscription();
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

  private _unsubscribeRetrieveTermsOfUseSubscription() {
    if (this._retrieveTermsOfUseSubscription instanceof Subscription) {
      this._retrieveTermsOfUseSubscription.unsubscribe();
    }
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _retrieveTermsOfUse() {
    this._backToTop();
    
    this._startLoading();

    this._retrieveTermsOfUseSubscription = this._termsOfUseService
      .retrieveTermsOfUse$()
      .subscribe(details => {
        this.termsOfUseDetails = Immutable.fromJS(details);

        this._manuallyTriggerChangeDetection();

        this._stopLoading();

      }, (err) => console.error(err))
  }


}
