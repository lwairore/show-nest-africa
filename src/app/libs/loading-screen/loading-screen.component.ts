import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ScrollService } from '@sharedModule/services';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoadingScreenService } from './loading-screen.service';

@Component({
  selector: 'snap-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingScreenComponent implements AfterViewInit, OnDestroy {
  private _debounceTime = 200;

  private _loadingSubscription: Subscription | undefined;

  constructor(
    private _loadingScreenService: LoadingScreenService,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private _scrollService: ScrollService,
  ) { }

  ngAfterViewInit() {
    this._controlLoadingScreenWrapper();
  }

  ngOnDestroy() {
    this._unsubscribeLoadingSubscription();
  }

  private _controlLoadingScreenWrapper() {
    this._elementRef.nativeElement.style.display = 'none';

    this._setupLoadingScreenSubscription();
  }

  private _setupLoadingScreenSubscription() {
    this._loadingSubscription = this._loadingScreenService
      .loadingStatus
      .pipe(
        debounceTime(
          this._debounceTime
        ),
        distinctUntilChanged(),
        // DEBOUNCETIME meant to solve 
        // `The screen will appear even fast API calls but just for a short time which will cause a flickering on the screen.`
        //  Adding a threshold of about 200ms to call the load screen function.
      )
      .subscribe(status => {
        console.log({ status });
        if (status) {
          this._backToTop();

          this._renderer2.setStyle(
            this._elementRef.nativeElement,
            'display',
            'block'
          );

          this._renderer2.setStyle(
            this._document.body,
            'overflow',
            'hidden'
          )

        } else {
          this._renderer2.setStyle(
            this._elementRef.nativeElement,
            'display',
            'none'
          );

          this._renderer2.setStyle(
            this._document.body,
            'overflow',
            ''
          )
        }

        this._changeDetectionDetectChanges();
      });
  }

  private _unsubscribeLoadingSubscription() {
    if (this._loadingSubscription instanceof Subscription) {
      this._loadingSubscription.unsubscribe();
    }
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }


  private _changeDetectionDetectChanges() {
    this._changeDetectorRef.detectChanges();
  }
}
