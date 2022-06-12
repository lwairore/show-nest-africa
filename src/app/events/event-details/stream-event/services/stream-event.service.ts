import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import {
  BackendCheckupFormatHttpResponse,
  BackedCheckupHttpResponse as BackendCheckupHttpResponse,
  MomentStreamHttpResponse,
  MomentStreamFormatHttpResponse,
  YoutubeLiveStreamFormatHttpResponse,
  YoutubeLiveStreamHttpResponse,
} from '../custom-types';
import {
  constructMediaSrc,
  convertItemToString,
  ExpectedType,
  isANumber,
  isObjectEmpty,
  formatShowcaseItemWithVideo,
  whichValueShouldIUse,
  stringIsEmpty,
  getBoolean,
  formatShowcaseItemWithPhoto
} from '@sharedModule/utilities';


@Injectable({
  providedIn: 'root'
})
export class StreamEventService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  backendCheckup$(momentID: string) {
    const API = (environment.baseURL +
      environment.streamEvent.backendCheckup())
      .replace(':momentID', momentID);

    return this._httpClient.get<BackendCheckupHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: BackendCheckupFormatHttpResponse = {
            resetStream: getBoolean(details.reset_stream),
            canStream: getBoolean(details.can_stream),
            pauseStream: getBoolean(details.pause_stream),
          }

          return FORMATTED_DETAILS;
        })
      )
  }

  retrieveMomentStream$(momentID: string) {
    const API = (environment.baseURL +
      environment.streamEvent.retrieveStreamDetail())
      .replace(':momentID', momentID);

    return this._httpClient.get<MomentStreamHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: MomentStreamFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
            startsOn: convertItemToString(details.starts_on),
            eventIs: convertItemToString(details.event_is),
            streamEndedOn: convertItemToString(details.stream_ended_on),
            streamDetails: {
              canStream: getBoolean(details.stream_details?.can_stream),
              localLiveStream: formatShowcaseItemWithVideo(details.stream_details?.local_live_stream),
              youtubeLiveStream: this._formatYoutubeLiveStream(details.stream_details?.youtube_live_stream)
            },
            replayDetails: {
              playsOn: convertItemToString(details.replay_details?.plays_on),
              replayIs: convertItemToString(details.replay_details?.replay_is),
              streamEndedOn: convertItemToString(details.replay_details?.stream_ended_on),
            },
            controlDetails: {
              canStream: getBoolean(details.control_details
                ?.can_stream),
              resetStream: getBoolean(details.control_details
                ?.reset_stream),
              pauseStream: getBoolean(details.control_details
                ?.pause_stream),
            }
          };

          return FORMATTED_DETAILS;
        })
      )
  }


  private _formatYoutubeLiveStream(youtubeLiveStream?: YoutubeLiveStreamHttpResponse) {
    if (!youtubeLiveStream) {
      return undefined;
    }

    const FORMATTED_YOUTUBE_LIVE_STREAM: YoutubeLiveStreamFormatHttpResponse = {
      width: whichValueShouldIUse(youtubeLiveStream.width, undefined, ExpectedType.NUMBER),
      height: whichValueShouldIUse(youtubeLiveStream.height, undefined, ExpectedType.NUMBER),
      videoID: convertItemToString(youtubeLiveStream.video_id),
      playerVars: {
        autoplay: this._convertValueTo0or1(youtubeLiveStream.player_vars?.autoplay),
        controls: this._convertValueTo0or1(youtubeLiveStream.player_vars?.controls),
        disablekb: this._convertValueTo0or1(youtubeLiveStream.player_vars?.disablekb),
        fs: this._convertValueTo0or1(youtubeLiveStream.player_vars?.fs),
        loop: this._convertValueTo0or1(youtubeLiveStream.player_vars?.loop),
        modestbranding: this._convertValueTo0or1(youtubeLiveStream.player_vars?.modestbranding),
        playsinline: this._convertValueTo0or1(youtubeLiveStream.player_vars?.playsinline),
        rel: this._convertValueTo0or1(youtubeLiveStream.player_vars?.rel),
        showinfo: this._convertValueTo0or1(youtubeLiveStream.player_vars?.showinfo),
      }
    };

    return FORMATTED_YOUTUBE_LIVE_STREAM;
  }

  private _convertValueTo0or1(value: any) {
    const convertedValue = getBoolean(value) ? 1 : 0;

    return convertedValue;
  }
}
