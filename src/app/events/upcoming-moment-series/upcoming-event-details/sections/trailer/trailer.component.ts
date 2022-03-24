import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { TrailerFormatHttpResponse } from '../../custom-types';

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

  ngOnDestroy(): void {
    this._unsubscribeGetDefaultMediaSubscription();
  }

  private _unsubscribeGetDefaultMediaSubscription() {
    if (this._getDefaultMediaSubscription instanceof Subscription) {
      this._getDefaultMediaSubscription.unsubscribe();
    }
  }

  private _checkComponentForChanges() {
    this._changeDetectorRef.markForCheck();
  }

  setEventTrailer(details: Readonly<TrailerFormatHttpResponse>) {
    console.log({ details })
    this.trailer = Immutable.fromJS(details);

    console.log("this.trailer video")
    console.log(this.trailer)

    if (!this.trailer.isEmpty()) {
      this._checkComponentForChanges();
    }
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
