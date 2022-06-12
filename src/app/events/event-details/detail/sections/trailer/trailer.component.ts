import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { TrailerHttpResponse } from '../../../custom-types';
import { VideoItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

@Component({
  selector: 'snap-trailer',
  templateUrl: './trailer.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerComponent implements OnDestroy {
  trailer = Immutable.fromJS({});

  vgApi: VgApiService | undefined;

  private _getDefaultMediaSubscription: Subscription | undefined;

  MODAL_ID_FOR_VIDEO = 'eventVideos__viewTrailer';


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnDestroy() {
    this._unsubscribeGetDefaultMediaSubscription();
  }

  private _unsubscribeGetDefaultMediaSubscription() {
    if (this._getDefaultMediaSubscription instanceof Subscription) {
      this._getDefaultMediaSubscription.unsubscribe();
    }
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _checkComponentForChanges() {
    this._changeDetectorRef.markForCheck();
  }

  setEventTrailer(nameOfMoment: string, video: VideoItemPreviewFormatHttpResponse) {
    this.trailer = Immutable.fromJS({
      nameOfMoment: nameOfMoment,
      video: video
    });

    this._manuallyTriggerChangeDetection();
  }

  onPlayerReady(api: VgApiService) {
    this.vgApi = api;

    this._getDefaultMediaSubscription = api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(succ => {
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
