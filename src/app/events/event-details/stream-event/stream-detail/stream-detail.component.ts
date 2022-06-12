import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription, interval } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { StreamEventService } from '../services';
import { convertItemToNumeric, convertItemToString, whichValueShouldIUse, fieldValueHasBeenUpdated } from '@sharedModule/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { BackendCheckupFormatHttpResponse } from '../custom-types';

@Component({
  selector: 'snap-stream-detail',
  templateUrl: './stream-detail.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _retrieveStreamDetailSubscription: Subscription | undefined;

  streamDetails = Immutable.fromJS({});

  streamControls = Immutable.Map({
    startStream: false,
    pauseStream: false,
    resetStream: false,
    canStream: false
  });

  errorDetails = Immutable.fromJS({});

  currentShowingSection = '';

  private _interval_MSEC = 10000;

  private _backendCheckUpSubscription: Subscription | undefined;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _loadingScreenService: LoadingScreenService,
    private _streamEventService: StreamEventService,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this._retrieveStreamDetail();
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeRetrieveStreamDetailSubscription();

    this._unsubscribeBeCheckUpSubscription();

  }

  private _unsubscribeBeCheckUpSubscription() {
    if (this._backendCheckUpSubscription instanceof Subscription) {
      this._backendCheckUpSubscription.unsubscribe();
    }
  }

  private _backendCheck() {
    const MOMENT_ID = this.momentID;

    this._backendCheckUpSubscription = interval(
      this._interval_MSEC)
      .pipe(
        switchMap(() =>
          this._streamEventService.backendCheckup$(MOMENT_ID)
            .pipe(
              tap(details => {
                let runChangeDetection = false;

                const updateRunChangeDetection = () => {
                  if (!runChangeDetection) {
                    runChangeDetection = true;
                  }
                }

                const resetStream = details.resetStream;
                const storedResetStream = this.streamControls.get('resetStream');
                if (fieldValueHasBeenUpdated(storedResetStream, resetStream)) {
                  this.streamControls = this.streamControls
                    .set('resetStream', resetStream);

                  updateRunChangeDetection();
                }

                const canStream = details.canStream;
                const storedCanStream = this.streamControls.get('canStream');
                if (fieldValueHasBeenUpdated(storedCanStream, canStream)) {
                  this.streamControls = this.streamControls
                    .set('canStream', canStream);

                  updateRunChangeDetection();
                }

                const pauseStream = details.pauseStream;
                const storedPauseStream = this.streamControls.get('pauseStream');
                if (fieldValueHasBeenUpdated(storedPauseStream, pauseStream)) {
                  this.streamControls = this.streamControls
                    .set('pauseStream', pauseStream);

                  updateRunChangeDetection();
                }

                if (runChangeDetection) {
                  this._manuallyTriggerChangeDetection();
                }

              })
            )
        )
      )
      .subscribe(_ => { }, (err) => console.error(err));
  }

  switchToSection(section: string) {
    this.currentShowingSection = section;
  }

  refresh() {
    this.switchToSection('');

    if (!this.errorDetails.isEmpty()) {
      this.errorDetails = Immutable.fromJS({});
    }

    // this._manuallyTriggerChangeDetection();

    this._retrieveStreamDetail();
  }

  private _unsubscribeRetrieveStreamDetailSubscription() {
    if (this._retrieveStreamDetailSubscription instanceof Subscription) {
      this._retrieveStreamDetailSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute
      ?.parent?.parent?.parent?.params
      .subscribe(params => {
        const MOMENT_ID = convertItemToNumeric(
          params['momentID']);

        this.routeParams = this.routeParams.set(
          'momentID', MOMENT_ID);
      });
  }

  get momentID() {
    const MOMENT_ID = convertItemToString(
      this.routeParams.get('momentID'));

    return MOMENT_ID;
  }

  private _retrieveStreamDetail() {
    this._startLoading();

    const MOMENT_ID = this.momentID;

    this._retrieveStreamDetailSubscription = this._streamEventService
      .retrieveMomentStream$(MOMENT_ID)
      .subscribe(details => {
        this.streamDetails = Immutable.fromJS(details);

        const resetStream = details.controlDetails.resetStream;
        const storedResetStream = this.streamControls.get('resetStream');
        if (fieldValueHasBeenUpdated(storedResetStream, resetStream)) {
          this.streamControls = this.streamControls
            .set('resetStream', resetStream);
        }

        const canStream = details.controlDetails.canStream;
        const storedCanStream = this.streamControls.get('canStream');
        if (fieldValueHasBeenUpdated(storedCanStream, canStream)) {
          this.streamControls = this.streamControls
            .set('canStream', canStream);
        }

        const pauseStream = details.controlDetails.pauseStream;
        const storedPauseStream = this.streamControls.get('pauseStream');
        if (fieldValueHasBeenUpdated(storedPauseStream, pauseStream)) {
          this.streamControls = this.streamControls
            .set('pauseStream', pauseStream);
        }

        this.switchToSection('streamDetails');

        this._backendCheck();

        this._manuallyTriggerChangeDetection();

        this._stopLoading();
      }, (err: HttpErrorResponse) => {
        this._stopLoading();

        const defaultErrorDetails = {
          title: 'Something Went Wrong, Please Try Again',
          description: 'We\'re sorry, but something went wrong. Please try again.',
          solution: {
            hint: 'should__tryAgain',
            ctaTextContent: '',
          },
        }

        let errorDetails = {}

        if (err.status === 0) {
          errorDetails = {
            title: 'No network connection',
            description: 'No internet connection. Connect to the internet and try again.',
            solution: {
              ctaTextContent: 'Refresh',
              hint: 'should__connectToInternet'
            }
          }
        }
        else {
          errorDetails = {
            title: whichValueShouldIUse(
              err.error?.title, defaultErrorDetails.title),
            solution: {
              ctaTextContent: whichValueShouldIUse(
                err.error?.solution?.cta_text_content,
                defaultErrorDetails.solution.ctaTextContent),

              hint: whichValueShouldIUse(
                err.error?.solution?.hint,
                defaultErrorDetails.solution.hint),
            },

            description: whichValueShouldIUse(
              err.error?.description,
              defaultErrorDetails.description),
          }
        }

        this.errorDetails = Immutable.fromJS(errorDetails);

        this.switchToSection('errorSection');

        this._manuallyTriggerChangeDetection();
      });
  }

  navigateToGetTickets() {
    this._router.navigate(
      ['..', 'get-tickets'],
      { relativeTo: this._activatedRoute.parent?.parent });
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
