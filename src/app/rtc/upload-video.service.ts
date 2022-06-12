import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { LiveStream } from './db/livestream.db';
import { blobToFile, isObjectEmpty, stringIsEmpty } from '@sharedModule/utilities';
import { retryWithBackoff } from '@sharedModule/operators';
import { catchError, map } from 'rxjs/operators';
import { UploadLivestreamResponse } from './db/upload-livestream-response.db';

@Injectable({
  providedIn: 'root'
})
export class UploadVideoService {
  private _queryResultsBS = new BehaviorSubject<Array<LiveStream>>([]);

  private _markedChunkAsSent = new BehaviorSubject<boolean>(false);

  private _firstItemIdFromIndexedDbBS = new BehaviorSubject<number | null>(null);

  private _firstUploadLivestreamRepsonseBS = new BehaviorSubject<string | null>(null);

  private _allLiveStreamsBS = new BehaviorSubject<Array<LiveStream>>([]);

  private _processedFileBS = new BehaviorSubject<File | null>(null);


  constructor(
    private _httpClient: HttpClient,
  ) {
  }

  mergeBlobsToAFile(livestreams: Array<LiveStream>, mimetype: string) {
    console.log("mergeBlobsToAFile")
    console.table({ livestreams });
    console.log("mergeBlobsToAFile")
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

  reportMarkingOfChunkAsSentStatus() {
    return this._markedChunkAsSent.asObservable();
  }

  getFirstUploadLivestreamRepsonse$() {
    return this._firstUploadLivestreamRepsonseBS.asObservable();
  }

  getProcessedFile$() {
    return this._processedFileBS.asObservable();
  }


  getAllLiveStreams$() {
    return this._allLiveStreamsBS.asObservable();
  }

  getQueryResults$() {
    return this._queryResultsBS.asObservable();
  }

  getFirstItemIdFromIndexedDb$() {
    return this._firstItemIdFromIndexedDbBS.asObservable();
  }

  sendLiveStreamFile$(momentID: string, livetreamFormData: FormData, method: 'PUT' | 'POST') {
    const API = (environment.baseURL + environment.moments.rootURL
      + environment.moments.livestreamChunk.sendChunk())
      .replace(':momentID', momentID);

    if (method === 'PUT') {
      return this._httpClient.put(API,
        livetreamFormData)
        .pipe(
          retryWithBackoff(1000, 5),
        );
    }
    else {
      return this._httpClient.post(API,
        livetreamFormData)
        .pipe(
          retryWithBackoff(1000, 5),
          map((details: any) => {
            if (!isObjectEmpty(details) &&
              !stringIsEmpty(details?.file_name)) {
              const FORMATTED_DETAILS = {
                fileName: details.file_name
              }

              this._recordUploadLivestreamResponse(
                FORMATTED_DETAILS.fileName)

              return FORMATTED_DETAILS;
            } else {
              return details;
            }

          })
        );
    }

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

  retrieveFirstUploadLivestreamRepsonse() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/retrieve-first-upload-livestream-repsonse.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log("retrieveFirstUploadLivestreamRepsonse")
        console.table(data)
        this._firstUploadLivestreamRepsonseBS.next(
          stringIsEmpty(data) ? '' : data);
      };

      worker.postMessage({});
    }
  }

  queryFirstItemFromIndexedDb() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/retrieve-first-livestream-indexed-db.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log("queryFirstItemFromIndexedDb")
        console.table(data)
        this._firstItemIdFromIndexedDbBS.next(data);
      };

      worker.postMessage({});
    }
  }

  queryFromIndexedDb(key: number, decrementBy: number) {
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
        decrementBy: decrementBy
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
        console.log({ data });
      };

      worker.postMessage(LIVE_STREAM_CHUNK);
    }
  }

  private async _recordUploadLivestreamResponse(
    fileName: string) {
    console.log({ fileName });

    const FORMATTED_DATA: UploadLivestreamResponse = {
      fileName: fileName,
      recordedOn: new Date(),
    }

    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/record-upload-livestream-response.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log({ data });
      };

      worker.postMessage(FORMATTED_DATA);
    }
  }

  async resetUploadLivestreamResponseDb() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/reset-upload-livestream-response-db.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log({ data });
      };

      worker.postMessage({});
    }
  }

  async markChunksAsSent(chunks: Array<LiveStream>) {
    for (let chunk of chunks) {
      chunk.sent = true;
      chunk.sentOn = Date.now();
    }

    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./workers/mark-chunks-as-sent.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        console.log({ data });

        this._markedChunkAsSent.next(true);
      };

      worker.postMessage(chunks);
    }
  }
}
