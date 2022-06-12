import { Component, OnInit, ChangeDetectionStrategy, Inject, Input, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as Immutable from 'immutable';
import { convertItemToString, stringIsEmpty, isObjectEmpty } from '@sharedModule/utilities';
import { YTPlayerVar } from '../../custom-types';

const WINDOW = (window as { [key: string]: any });

@Component({
  selector: 'snap-ytiframe-api',
  templateUrl: './ytiframe-api.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YTIFrameAPIComponent implements OnInit {
  youtubeLiveStream = Immutable.fromJS({});

  @Input()
  set streamDetails(details: any) {
    this.youtubeLiveStream = details;

    this.init();
  }

  // 1. Some required variables which will be used by YT API
  YT: any;
  player: any;
  reframed = false;

  isRestricted = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit() {
  }

  // 2. Initiliaze method for YT IFrame API
  init() {
    // Return if Player is already created
    if (WINDOW['YT']) {
      this.startVideo();

      return;
    }

    const tag = this._document.createElement('script');

    tag.src = 'http://www.youtube.com/iframe_api';

    const firstScriptTag = this._document.getElementsByTagName('script')[0];

    firstScriptTag.parentNode
      ?.insertBefore(tag, firstScriptTag);

    // 3. startVideo() will create an <iframe> (and YouTube player) after the API code downloads.
    WINDOW['onYouTubeIframeAPIReady'] = () => this.startVideo();
  }

  startVideo() {
    const videoID = convertItemToString(
      this.youtubeLiveStream
        ?.get('videoID'));
    if (stringIsEmpty(videoID)) {
      return;
    }

    this.reframed = false;

    const playerVars = this.youtubeLiveStream
      ?.get('playerVars') as Immutable.Collection<string, 0 | 1 | undefined>;

    let formattedPlayerVars: YTPlayerVar | undefined;

    if (Immutable.isImmutable(playerVars)) {
      formattedPlayerVars = {
        autoplay: playerVars.get('autoplay', 1),
        controls: playerVars.get('controls', 1),
        disablekb: playerVars.get('disablekb', 1),
        fs: playerVars.get('fs', 0),
        loop: playerVars.get('loop', 0),
        modestbranding: playerVars.get('modestbranding', 1),
        playsinline: playerVars.get('playsinline', 1),
        rel: playerVars.get('rel', 0),
        showinfo: playerVars.get('showinfo', 0)
      }
    } else {
      formattedPlayerVars = {
        autoplay: 1,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1
      }
    }

    this.player = new WINDOW['YT'].Player('ytiframe__player', {
      videoId: videoID,
      playerVars: formattedPlayerVars,
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this),
        'onError': this.onPlayerError.bind(this),
        'onReady': this.onPlayerReady.bind(this)
      }
    });
  }

  // 4. It will be called when the Video player is ready
  onPlayerReady(event: any) {
    if (this.isRestricted) {
      event.target.mute();

      event.target.playVideo();
    }
    else {
      event.target.playVideo();
    }

    const iframeElement = this._document
      .getElementById('ytiframe__player');

    if (iframeElement instanceof HTMLElement) {
      this._renderer2.addClass(
        iframeElement,
        'embed-responsive-item');
    }
  }

  // 5. API will call this function when Player State changes like PLAYING, PAUSED, ENDED.
  onPlayerStateChange(event: any) {
    switch (event.data) {
      case WINDOW['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          console.log('started ' + this.cleanTime());
        }
        else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case WINDOW['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('Paused' + ' @ ' + this.cleanTime());
        }
        break;
      case WINDOW['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
      default:
        break;
    }
  }

  cleanTime() {
    return Math.round(
      this.player.getCurrentTime());
  }

  onPlayerError(event: any) {
    switch (event.data) {
      case 2:
        const videoID = convertItemToString(
          this.youtubeLiveStream
            ?.get('videoID'));

        console.log('' + videoID);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
      default:
        break;
    }
  }
}
