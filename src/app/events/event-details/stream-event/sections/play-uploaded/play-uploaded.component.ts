import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import * as Immutable from 'immutable';
import { ActivatedRoute, Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { convertItemToString, fieldValueHasBeenUpdated, getBoolean } from '@sharedModule/utilities';

@Component({
  selector: 'snap-play-uploaded',
  templateUrl: './play-uploaded.component.html',
  styles: [
    `video::-internal-media-controls-download-button {
      display:none;
  }
  
  video::-webkit-media-controls-enclosure {
      overflow:hidden;
  }
  
  video::-webkit-media-controls-panel {
      width: calc(100% + 30px); /* Adjust as needed */
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayUploadedComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() localLiveStream = Immutable.fromJS({});

  private _streamControlDetails = Immutable.Map({
    pauseStream: false,
    resetStream: false,
    canStream: false
  });

  @Input()
  set controlDetails(details: any) {
    if (Immutable.isMap(details)) {
      const pauseStream = getBoolean(details.get('pauseStream'));
      const storedPauseStream = this._streamControlDetails.get('pauseStream');
      if (fieldValueHasBeenUpdated(storedPauseStream, pauseStream)) {
        this._streamControlDetails = this._streamControlDetails.set(
          'pauseStream', pauseStream);
      }

      const resetStream = getBoolean(details.get('resetStream'));
      const storedStopStream = this._streamControlDetails.get('resetStream');
      if (fieldValueHasBeenUpdated(storedStopStream, resetStream)) {
        this._streamControlDetails = this._streamControlDetails.set(
          'resetStream', resetStream);
      }

      const canStream = getBoolean(details.get('canStream'));
      const storedCanStream = this._streamControlDetails.get('canStream');
      if (fieldValueHasBeenUpdated(storedCanStream, canStream)) {
        this._streamControlDetails = this._streamControlDetails.set(
          'canStream', canStream);
      }

      this._toggleVideoPlayback();
    }
  }

  startMin = '0.5';

  endMins = 1.2;

  @ViewChild('videoEl', { read: ElementRef })
  private _videoEl: ElementRef<HTMLVideoElement> | undefined;

  private _supposedCurrentTime = 0;


  constructor(
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  private _toggleVideoPlayback() {
    if (!(this._videoEl instanceof ElementRef)) {
      return;
    }

    const canStream = getBoolean(
      this._streamControlDetails.get('canStream'));
    if (canStream) {
      const resetStream = getBoolean(
        this._streamControlDetails.get('resetStream'));
      if (resetStream) {
        // Video not allowed to play
        const currentTime = this._videoEl.nativeElement.currentTime;

        if (currentTime > 0) {
          const isPaused = this._videoEl.nativeElement.paused;

          this._videoEl.nativeElement.load();
          if (!isPaused) {
            this._videoEl.nativeElement.play();
          }
        }
      } {
        const pauseStream = getBoolean(
          this._streamControlDetails.get('pauseStream'));

        const isPaused = this._videoEl.nativeElement.paused;

        if (pauseStream) {
          if (!isPaused) {
            this._videoEl.nativeElement.pause();
          }
        } else {
          this._videoEl.nativeElement.play();
        }
      }
    }
    else {

      const nativeElement = this._videoEl.nativeElement;

      const isPaused = nativeElement.paused;
      if (isPaused) {
        // Do nothing if playback is paused
      } else {
        nativeElement.pause();
      }
    }
  }

  seekToTime(ts: number) {
    if (!(this._videoEl instanceof ElementRef)) {
      return;
    }

    const nativeElement = this._videoEl.nativeElement

    // try and avoid pauses after seeking
    nativeElement.pause();
    nativeElement.currentTime = ts; // if this is far enough away from current, it implies a "play" call as well...oddly. I mean seriously that is junk.
    // however if it close enough, then we need to call play manually
    // some shenanigans to try and work around this:
    var timer = setInterval(function () {
      if (nativeElement.paused && nativeElement.readyState == 4 || !nativeElement.paused) {
        nativeElement.play();
        clearInterval(timer);
      }
    }, 50);
  }

  handlePlay() {
    if (!(this._videoEl instanceof ElementRef)) {
      return;
    }

    const canStream = getBoolean(
      this._streamControlDetails.get('canStream'));
    if (canStream) {
      const pauseStream = getBoolean(
        this._streamControlDetails.get('pauseStream'));
      if (pauseStream) {
        const isPaused = this._videoEl.nativeElement.paused;
        if (!isPaused) {
          this._videoEl.nativeElement.pause();
        }
      }
    }
    else {
      const nativeElement = this._videoEl.nativeElement;
      nativeElement.pause();
    }

  }

  timeupdateHandler() {
    if (!(this._videoEl instanceof ElementRef)) {
      return;
    }

    const nativeElement = this._videoEl.nativeElement;

    if (!nativeElement.seeking) {
      this._supposedCurrentTime = nativeElement.currentTime;
    }

    console.log(`this.supposedCurrentTime`);
    console.log(this._supposedCurrentTime);
  }

  resetVideoState() {
    // reset state in order to allow for rewind
    this._supposedCurrentTime = 0;
  }

  preventUserFromSeeking() {
    // guard agains infinite recursion:
    // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
    if (this._videoEl instanceof ElementRef) {
      const nativeElement = this._videoEl.nativeElement;

      let delta = nativeElement.currentTime - this._supposedCurrentTime;
      delta = Math.abs(delta); // disable seeking previous content if you want
      if (delta > 0.01) {
        nativeElement.currentTime = this._supposedCurrentTime;
      }
    }
  }

  // onPlayerReady(api: VgApiService) {
  //   this.vgApi = api;

  //   let d = new Date();
  //   let mins = d.getMinutes();
  //   let secs = d.getSeconds();

  //   let startSecs = parseInt(this.startMin) * 60;
  //   let currentSeconds = secs + (mins * 60);
  //   let timeDiff = currentSeconds - startSecs;

  //   console.log('time start seconds ' + startSecs);
  //   console.log('time seconds ' + currentSeconds);
  //   console.log('time delay ' + timeDiff);

  //   console.log({ api })

  //   if (mins < this.endMins) {

  //     api.seekTime(timeDiff);

  //   }

  //   // this._getDefaultMediaSubscription = api.getDefaultMedia()
  //   //   .subscriptions.ended.subscribe(
  //   //     () => {
  //   //       api.getDefaultMedia().subscriptions
  //   //         .loadedMetadata.subscribe(_ => {
  //   //           this.handlePlayers();
  //   //         });
  //   //     }
  //   //   );
  // }
}
