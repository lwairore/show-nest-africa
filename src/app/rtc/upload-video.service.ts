import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of } from 'rxjs';
import { LiveStream } from './db/livestream.db';
import { blobToFile, isObjectEmpty } from '@sharedModule/utilities';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadVideoService {
  private _queryResultsBS = new BehaviorSubject<Array<LiveStream>>([]);

  private _allLiveStreamsBS = new BehaviorSubject<Array<LiveStream>>([]);

  private _processedFileBS = new BehaviorSubject<File | null>(null);


  constructor(
    private _httpClient: HttpClient,
  ) {
  }

  mergeBlobsToAFile(livestreams: Array<LiveStream>, mimetype: string) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/merge-blobs-to-file.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log({ data });
        this._processedFileBS.next(data);
      };

      const DATA = {
        mimetype: mimetype,
        streams: livestreams
      }

      worker.postMessage(DATA);
    }
  }

  getProcessedFile$() {
    return this._processedFileBS.asObservable();
  }


  getAllLiveStreams$() {
    return this._allLiveStreamsBS.asObservable();
  }

  getQueryResults() {
    return this._queryResultsBS.asObservable();
  }

  sendLiveStreamFile$(livetreamFormData: FormData) {
    const API = environment.baseURL + environment.manualChunkUpload
      .sendChunkStream();

    return this._httpClient.post(API,
      livetreamFormData)
      .pipe(
        retryWithBackoff(1000, 5),
        map((details: any) => {
          return isObjectEmpty(details) ? details : {
            fileName: details?.file
          }
        })
      );
  }

  sendChunkStream(chunkFormData: FormData) {
    const API = environment.baseURL + environment.manualChunkUpload
      .sendChunkStream();

    return this._httpClient.post(API,
      chunkFormData);
  }

  listLivestreams() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/retrieve-all-livestreams-indexed-db.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log({ data })

        this._allLiveStreamsBS.next([...data]);
      };

      worker.postMessage({});
    }
  }

  queryFromIndexedDb(key: number, incrementBy?: number) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/query.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log("queryFromIndexedDb")
        console.table(data)
        this._queryResultsBS.next(data);
      };

      const BETWEEN_CONFIGS = {
        key: key,
        incrementBy: incrementBy
      }

      worker.postMessage(BETWEEN_CONFIGS);
    }
  }

  addToIndexedDb(chunk: Blob) {
    // const chunkArrayBuffer = blobToArrayBuffer(chunk);
    console.log({ chunk });

    const LIVE_STREAM_CHUNK: LiveStream = {
      blob: chunk,
      addedOn: Date.now(),
      sent: false,
    }

    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/add-to-indexed-db.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log({ data })
      };

      worker.postMessage(LIVE_STREAM_CHUNK);
    }
  }
}
