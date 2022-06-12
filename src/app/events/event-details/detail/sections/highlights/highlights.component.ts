import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { VideoItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

@Component({
  selector: 'snap-highlights',
  templateUrl: './highlights.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightsComponent implements OnDestroy {
  highlights = Immutable.fromJS({});

  vgApi: VgApiService | undefined;

  private _getDefaultMediaSubscription: Subscription | undefined;

  MODAL_ID_FOR_VIDEO = 'eventVideos__viewHighlights';


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnDestroy() {
    this._unsubscribeGetDefaultMediaSubscription();
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _unsubscribeGetDefaultMediaSubscription() {
    if (this._getDefaultMediaSubscription instanceof Subscription) {
      this._getDefaultMediaSubscription.unsubscribe();
    }
  }

  private _checkComponentForChanges() {
    this._changeDetectorRef.markForCheck();
  }

  setEventHighlights(nameOfMoment: string, video: VideoItemPreviewFormatHttpResponse) {
    this.highlights = Immutable.fromJS({
      nameOfMoment: nameOfMoment,
      video: video
    });


    this._manuallyTriggerChangeDetection();
  }

  onPlayerReady(api: VgApiService) {
    this.vgApi = api;

    this._getDefaultMediaSubscription = api.getDefaultMedia()
      .subscriptions.ended.subscribe(
        () => {
          api.getDefaultMedia().subscriptions
            .loadedMetadata.subscribe(_ => {
              this.handlePlayers();
            });
        }
      );
  }

  pauseAllPlayers() {
    this.vgApi?.pause();
  }

  handlePlayers() {
    this.vgApi?.pause();
  }

}
