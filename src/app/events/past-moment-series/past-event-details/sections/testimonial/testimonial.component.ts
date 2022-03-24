import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { convertItemToNumeric, convertItemToString, isANumber, stringIsEmpty } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PastEventDetailsService } from '../../past-event-details.service';

@Component({
  selector: 'snap-testimonial',
  templateUrl: './testimonial.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialComponent implements OnInit, AfterViewInit {
  testimonials = Immutable.fromJS([]);

  paginationDetailsForTestimonial = Immutable.Map({
    next: 0,
  });

  private _routeParams = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _listTestimonialSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  loadingTestimonials = false;

  hasNoTestimonials = false;

  MODAL_ID_FOR_TESTIMONIAL_LIST = 'event__testimonialList';

  MODAL_ID_FOR_FULL_REVIEW = 'event__testimonialList__fullReview';

  MODAL_ID_FOR_REVIEW_VIDEO = 'event__testimonialList__reviewVideo';

  selectedTestimonialDetails = Immutable.fromJS({});

  selectedVideoCommentDetails = Immutable.fromJS({});

  breadcrumbDetails = Immutable.fromJS({});

  constructor(
    private _eventDetailsService: PastEventDetailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._extractRouteParams();
  }

  ngAfterViewInit(): void {
    this._loadRequiredDetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeListTestimonialSubscription();

    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  resetReviewVideoPlacedOnModal(){
    this.selectedVideoCommentDetails = Immutable.fromJS({});
  }

  viewReviewVideo(loopIndex: number) {
    const REVIEW_VIDEO_COMMENT = this.testimonials
      .getIn([loopIndex, 'videoComment']);

    console.log({ REVIEW_VIDEO_COMMENT });

    if (Immutable.isMap(REVIEW_VIDEO_COMMENT)) {
      this.selectedVideoCommentDetails = Immutable.fromJS({
        src: REVIEW_VIDEO_COMMENT.get('src'),
        thumbnail: {
          src: REVIEW_VIDEO_COMMENT.getIn(['thumbnail', 'src']),
        },
        description: REVIEW_VIDEO_COMMENT.get('description')
      });
    }

    console.log("this.selectedVideoCommentDetails")
    console.log(this.selectedVideoCommentDetails)
  }

  viewFullTestimonialReview(loopIndex: number) {
    const REVIEW = this.testimonials
      .getIn([loopIndex, 'review']);

    console.log({ REVIEW });

    this.selectedTestimonialDetails = Immutable.fromJS(
      {
        'review': REVIEW
      });
  }

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute?.params
      .subscribe(params => {
        const MOMENT_ID = convertItemToNumeric(
          params['momentID']);

        if (!isANumber(MOMENT_ID)) {
          return;
        }

        this._routeParams = this._routeParams.set(
          'momentID', MOMENT_ID);
      });
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }


  private _unsubscribeListTestimonialSubscription() {
    if (this._listTestimonialSubscription instanceof Subscription) {
      this._listTestimonialSubscription.unsubscribe();
    }
  }

  private _listTestimonial$(momentID: number, pageNumber: number) {
    return this._eventDetailsService
      .listTestimonial$(
        convertItemToString(
          momentID), convertItemToString(pageNumber))
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForTestimonial = this.paginationDetailsForTestimonial
              .set('next', convertItemToNumeric(
                details.next));

            const newVal = Immutable.fromJS(details.results);

            this.testimonials = Immutable.mergeDeep(
              this.testimonials, newVal);

            if (!newVal.isEmpty()) {
              this.loadingTestimonials = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this.hasNoTestimonials = true;

            this._manuallyTriggerChangeDetection();
          }
        })
      )
  }

  private _loadRequiredDetails() {
    const MOMENT_ID = convertItemToNumeric(
      this._routeParams.get('momentID'));
    if (!isANumber(MOMENT_ID)) {
      return;
    }

    const FETCH_PAGE_NUMBER = 1

    const LIST_TESTIMONIAL$ = this._listTestimonial$(
      MOMENT_ID, (FETCH_PAGE_NUMBER));

    const RETRIEVE_MOMENT_DETAILS$ = this._eventDetailsService
      .retrieveMomentDetailsForBreadcrumb$(MOMENT_ID)
      .pipe(
        tap(details => {
          this.breadcrumbDetails = Immutable.fromJS(details);
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_TESTIMONIAL$,
      RETRIEVE_MOMENT_DETAILS$
    ]).subscribe(_ => { }, (err => console.error(err)))
  }

  listTestimonial() {
    const MOMENT_ID = convertItemToNumeric(
      this._routeParams.get('momentID'));
    if (!isANumber(MOMENT_ID)) {
      return;
    }

    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForTestimonial.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingTestimonials) {
      this.loadingTestimonials = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listTestimonialSubscription = this._listTestimonial$(
      MOMENT_ID, FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err => {
        console.error(err)
      }))
  }

}
