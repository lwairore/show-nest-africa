import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blobToFile, convertItemToNumeric, convertItemToString, isANumber, isObjectEmpty, stringIsEmpty } from '@sharedModule/utilities';
import { liveQuery } from 'dexie';
import * as Immutable from 'immutable';
import { defer, EMPTY, from, Observable, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { db, TodoList } from '../db/db';
import { LiveStream } from '../db/livestream.db';
import { UploadVideoService } from '../upload-video.service';

@Component({
  selector: 'snap-st-rtc',
  templateUrl: './st-rtc.component.html',
  styles: [
    `video {
      background: #222;
      margin: 0 0 20px 0;
      --width: 100%;
      width: var(--width);
      height: calc(var(--width) * 0.75);
    }`
  ]
})
export class StRtcComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef | undefined;

  @ViewChild('video') videoElementRef: ElementRef | undefined;

  @ViewChild('codecPreferences', { read: ElementRef })
  private _codecPreferencesElRef: ElementRef | undefined;

  @ViewChild('echoCancellationEl', { read: ElementRef })
  private _echoCancellationEl: ElementRef | undefined;

  videoElement: HTMLVideoElement | undefined;

  recordVideoElement: HTMLVideoElement | undefined;

  mediaRecorder: MediaRecorder | undefined;

  recordedBlobs: Array<LiveStream> = [];
  isRecording: boolean = false
  downloadUrl = '';
  stream: MediaStream | undefined;

  segmentLengthInMs = 5000;

  saveChunkStreamSubscription: Subscription | undefined;

  private _allLiveStreamChunkItemsFromIndexedDbSubscription: Subscription | undefined;

  private _countLiveStreamChunkItemsFromIndexedDbSubscription: Subscription | undefined;

  private _addToIndexedDbSubscription: Subscription | undefined;

  NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT = 2;

  queryDetails = Immutable.Map({});

  readonly DECREMENT_BY = this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

  private _getQueryResultsSubscription: Subscription | undefined;

  private _getProcessedFileSubscription: Subscription | undefined;

  private _fileDetails = Immutable.Map({
    fileName: ''
  });

  isCurrentUploading = false;

  cameraHasStarted = false;

  private _routeParams = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _getFirstItemIdFromIndexedDbSubscription: Subscription | undefined;

  private _retrieveFirstUploadLivestreamRepsonseSubscription: Subscription | undefined;

  private _livestreamsCurrentlyBeingUploaded: Array<LiveStream> = [];

  private _reportMarkingOfChunkAsSentStatusSubscription: Subscription | undefined;

  constructor(
    private _uploadVideoService: UploadVideoService,
    private _renderer2: Renderer2,
    private _activatedRoute: ActivatedRoute,
  ) { }

  private _getSelectedMimeType() {
    let mimeType = 'video/webm';

    if (this._codecPreferencesElRef instanceof ElementRef) {
      const CODEC_NATIVE_ELEMENT = this._codecPreferencesElRef.nativeElement;

      mimeType = CODEC_NATIVE_ELEMENT.options[CODEC_NATIVE_ELEMENT.selectedIndex].value.split(';', 1)[0];
    }

    return mimeType;
  }

  ngOnInit() {
    this._extractRouteParams();

    this._setupAllLiveStreamChunkItemsFromIndexedDb();

    this._setupGetQueryResultsSubscription();

    this._setupGetProcessedFileSubscription();

    this.setupGetFirstItemIdFromIndexedDb();

    this._setupRetrieveFirstUploadLivestreamRepsonseSubscription();

    this._setupReportMarkingOfChunkAsSentStatus();
  }

  ngAfterViewInit() {
    this._setSupportedMimeTypes();

    this._retrieveFirstUploadLivestreamRepsonse();

    this.videoElement = this.videoElementRef?.nativeElement;

    this.recordVideoElement = this.recordVideoElementRef?.nativeElement;
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    if (this.saveChunkStreamSubscription instanceof Subscription) {
      this.saveChunkStreamSubscription.unsubscribe();
    }

    if (this._allLiveStreamChunkItemsFromIndexedDbSubscription instanceof Subscription) {
      this._allLiveStreamChunkItemsFromIndexedDbSubscription.unsubscribe();
    }

    if (this._countLiveStreamChunkItemsFromIndexedDbSubscription instanceof Subscription) {
      this._countLiveStreamChunkItemsFromIndexedDbSubscription.unsubscribe();
    }

    if (this._addToIndexedDbSubscription instanceof Subscription) {
      this._addToIndexedDbSubscription.unsubscribe();
    }

    this._unsubscribeGetQueryResultsSubscription();

    this._unsubscribeGetProcessedFileSubscription();

    this._unsubscribeGetFirstItemIdFromIndexedDbSubscription();

    this._unsubscribeRetrieveFirstUploadLivestreamRepsonseSubscription();

    this._unsubscribeReportMarkingOfChunkAsSentStatusSubscription();
  }

  private _unsubscribeRetrieveFirstUploadLivestreamRepsonseSubscription() {
    if (this._retrieveFirstUploadLivestreamRepsonseSubscription instanceof Subscription) {
      this._retrieveFirstUploadLivestreamRepsonseSubscription.unsubscribe();
    }
  }

  private _getFirstItemIdFromIndexedDb() {
    this._uploadVideoService.queryFirstItemFromIndexedDb();
  }

  private _setupAllLiveStreamChunkItemsFromIndexedDb() {
    this._allLiveStreamChunkItemsFromIndexedDbSubscription = this._uploadVideoService.getAllLiveStreams$()
      .subscribe(details => {
        if (Array.isArray(details) && details.length > 0) {
          this.recordedBlobs = [...details];

          const FORMATTED_RECORDED_BLOBS = this.recordedBlobs.map(item => {
            return item.blob;
          });


          const MIME_TYPE = this._getSelectedMimeType();

          const superBuffer = new Blob(FORMATTED_RECORDED_BLOBS, { type: MIME_TYPE });

          this.downloadUrl = window.URL.createObjectURL(superBuffer); // you can download with <a> tag

          (this.recordVideoElement as HTMLVideoElement).src = this.downloadUrl;
        }
      });
  }

  private _unsubscribeReportMarkingOfChunkAsSentStatusSubscription() {
    if (this._reportMarkingOfChunkAsSentStatusSubscription instanceof Subscription) {
      this._reportMarkingOfChunkAsSentStatusSubscription.unsubscribe();
    }
  }

  private _setupReportMarkingOfChunkAsSentStatus() {
    this._reportMarkingOfChunkAsSentStatusSubscription = this._uploadVideoService
      .reportMarkingOfChunkAsSentStatus()
      .subscribe(details => {
        if (!this.isCurrentUploading) {
          console.warn(`Aborting any operations after command "markedChunkAsSent" since it has been prematurely issued.`);

          return;
        }

        const startFrom = this.queryDetails.get('startFrom') as number;
        const bumpedStartFrom = startFrom + this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

        this.queryDetails = this.queryDetails.set('startFrom',
          bumpedStartFrom);

        this.isCurrentUploading = false;

        this._livestreamsCurrentlyBeingUploaded = [];
      })
  }

  private _markChunksAsSent() {
    this._uploadVideoService.markChunksAsSent(
      this._livestreamsCurrentlyBeingUploaded);
  }

  private _unsubscribeGetFirstItemIdFromIndexedDbSubscription() {
    if (this._getFirstItemIdFromIndexedDbSubscription instanceof Subscription) {
      this._getFirstItemIdFromIndexedDbSubscription.unsubscribe();
    }
  }


  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute?.parent?.params
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

  getSupportedMimeTypes() {
    const possibleTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/mp4;codecs=h264,aac',
    ];
    return possibleTypes.filter(mimeType => {
      return MediaRecorder.isTypeSupported(mimeType);
    });
  }

  async init(constraints: MediaStreamConstraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.handleSuccess(stream);
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
      console.error(`navigator.getUserMedia error:${(e as any)?.toString()}`)
    }
  }

  private _setSupportedMimeTypes() {
    if (this._codecPreferencesElRef instanceof ElementRef) {
      const SELECT_NATIVE_EL = this._codecPreferencesElRef.nativeElement;

      const SUPPORTED_MIME_TYPES = this.getSupportedMimeTypes();

      if (SUPPORTED_MIME_TYPES.length) {
        SUPPORTED_MIME_TYPES.forEach(mimeType => {
          const OPTION_EL = this._renderer2.createElement('option');

          this._renderer2.setValue(OPTION_EL,
            mimeType);

          this._renderer2.setProperty(OPTION_EL
            , 'textContent',
            mimeType);

          this._renderer2.appendChild(SELECT_NATIVE_EL,
            OPTION_EL);
        });

        this._renderer2.removeAttribute(SELECT_NATIVE_EL,
          'disabled');
      }

    }
  }

  handleSuccess(stream: MediaStream | undefined) {
    console.log('getUserMedia() got stream:', stream);

    if (this.videoElementRef instanceof ElementRef) {
      this.videoElement = this.videoElementRef?.nativeElement;

      this.recordVideoElement = this.recordVideoElementRef?.nativeElement;

      if (stream instanceof MediaStream) {
        this.stream = stream;

        if (this.videoElement instanceof HTMLVideoElement) {
          this.videoElement.srcObject = this.stream;
        }
      }
    }
  }


  async startCamera() {
    this.cameraHasStarted = true;

    let hasEchoCancellation = false;

    if (this._echoCancellationEl instanceof ElementRef) {
      hasEchoCancellation = this._echoCancellationEl
        .nativeElement?.checked;
    }

    const constraints = {
      audio: {
        echoCancellation: { exact: hasEchoCancellation }
      },
      video: {
        width: 1280, height: 720
      }
    };

    console.log('Using media constraints:', constraints);

    await this.init(constraints);
  }

  private _unsubscribeGetProcessedFileSubscription() {
    if (this._getProcessedFileSubscription instanceof Subscription) {
      this._getProcessedFileSubscription.unsubscribe();
    }
  }

  private async _retrieveFirstUploadLivestreamRepsonse() {
    this._uploadVideoService
      .retrieveFirstUploadLivestreamRepsonse();
  }

  private _setupRetrieveFirstUploadLivestreamRepsonseSubscription() {
    this._retrieveFirstUploadLivestreamRepsonseSubscription = this._uploadVideoService
      .getFirstUploadLivestreamRepsonse$()
      .subscribe(details => {
        console.log("_setupRetrieveFirstUploadLivestreamRepsonseSubscription_setupRetrieveFirstUploadLivestreamRepsonseSubscription")
        console.log({ details })
        const PREVIOUS_FILE_NAME = convertItemToString(
          this._fileDetails.get('fileName'));

        if (!stringIsEmpty(PREVIOUS_FILE_NAME)) {
          console.warn(`Aborted...resetting of value of "fileName" on "_fileDetails" since value has already been set.`)

          return;
        }

        if (!stringIsEmpty(details)) {
          console.log("_setupRetrieveFirstUploadLivestreamRepsonseSubscription this._fileDetailsthis._fileDetailsthis._fileDetails")
          this._fileDetails = this._fileDetails.set('fileName',
            details as string);
        }
      })
  }


  private _setupGetProcessedFileSubscription() {
    this._getProcessedFileSubscription = this._uploadVideoService.getProcessedFile$()
      .pipe(
        // take(1),
        // BUG: Keeps resending the same request.
        switchMap(details => {

          if (details instanceof File) {
            const FORM_DATA = new FormData();

            FORM_DATA.append('chunk', details);

            console.log("this.fileDetails");
            console.log(this._fileDetails);



            const FILE_NAME = convertItemToString(
              this._fileDetails.get('fileName'));

            console.log({ FILE_NAME });

            if (!stringIsEmpty(FILE_NAME)) {
              FORM_DATA.append('fileName', FILE_NAME)
            }

            const MOMENT_ID = this._routeParams.get('momentID');

            if (!isANumber(MOMENT_ID)) {
              throw Error('Unable to proceed! Value for "moment id" is not valid.');
            }

            let sendLiveStreamFile$!: Observable<any>;

            if (stringIsEmpty(FILE_NAME)) {
              sendLiveStreamFile$ = this._uploadVideoService
                .sendLiveStreamFile$(
                  convertItemToString(MOMENT_ID),
                  FORM_DATA, 'POST');
            } else {
              sendLiveStreamFile$ = this._uploadVideoService
                .sendLiveStreamFile$(
                  convertItemToString(MOMENT_ID),
                  FORM_DATA, 'PUT');
            }

            return sendLiveStreamFile$.pipe(
              tap(fileReminderDetails => {
                if (!isObjectEmpty(fileReminderDetails) && !stringIsEmpty(fileReminderDetails?.fileName)) {
                  console.log("Setting this._fileDetails");
                  this._fileDetails = this._fileDetails.set('fileName',
                    fileReminderDetails?.fileName);

                  console.table(fileReminderDetails)

                  console.log(this._fileDetails)
                }

                this._markChunksAsSent();
              }),
              catchError(err => {
                this.isCurrentUploading = false;

                if (err.status === 404) {
                  this._uploadVideoService
                    .resetUploadLivestreamResponseDb();

                  const STORED_FILE_NAME = this._fileDetails.get('fileName');

                  if (!stringIsEmpty(STORED_FILE_NAME)) {
                    this._fileDetails = this._fileDetails.set(
                      'fileName', '');
                  }
                }

                return EMPTY;
              })
            );
          }

          return EMPTY;
        })
      )
      .subscribe(details => {
        console.log({ details });
      })
  }



  mergeBlobsToAFile(livestreams: Array<LiveStream>) {
    if (!this.isCurrentUploading) {
      console.warn(`Prevented any attempt to merge "livestreams" since "uploadChunks" command has not been issued.`);

      return;
    }

    livestreams = livestreams.filter(item => !item.sent);

    if (Array.isArray(livestreams) && livestreams.length) {
      if (livestreams.length === this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT) {
        this._livestreamsCurrentlyBeingUploaded = [...livestreams];

        const MIME_TYPE = this._getSelectedMimeType();

        this._uploadVideoService.mergeBlobsToAFile(livestreams, MIME_TYPE);

      } else if (
        (livestreams.length < this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT) && (
          !this.isRecording)) {
        this._livestreamsCurrentlyBeingUploaded = [...livestreams];
        const MIME_TYPE = this._getSelectedMimeType();

        this._uploadVideoService.mergeBlobsToAFile(livestreams, MIME_TYPE);

      } else {
        this.isCurrentUploading = false;
      }
    }
    else {
      console.warn(`Unable to merge blobs.`);
      console.warn(`Not livestreams have been provided.`);
      console.warn(`This may occur if 'ID' of the first livestream is ahead of the query ID.`);
      console.warn(`Or, if there aren't any stored livestreams`);
      console.warn(`Or they have already been sent.`);


      if (this.isCurrentUploading) {
        console.warn(`Will know bump the query ID.`);

        const startFrom = this.queryDetails.get('startFrom') as number;
        const bumpedStartFrom = startFrom + this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

        this.queryDetails = this.queryDetails.set('startFrom',
          bumpedStartFrom);
      }

      this.isCurrentUploading = false;
    }

  }

  setupGetFirstItemIdFromIndexedDb() {
    this._getFirstItemIdFromIndexedDbSubscription = this._uploadVideoService
      .getFirstItemIdFromIndexedDb$().subscribe(details => {
        if (!this.isCurrentUploading) {
          console.warn(`Preventing setting of the starting point since "uploadChunk" command has not been issued.`);
          return;
        }

        this.isCurrentUploading = false;

        const startFrom = this.queryDetails.get('startFrom');
        if (isANumber(startFrom)) {
          console.warn(`Can't reset the "startFrom" value since it has already been set.`)
          return;
        }

        console.log({ details });

        if (isANumber(details)) {

          const currentDeterminingKey = this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

          const startFrom = currentDeterminingKey + convertItemToNumeric(
            details);

          this.queryDetails = this.queryDetails.set(
            'startFrom', startFrom);

          console.log("this.queryDetails ")
          console.log(this.queryDetails);

          this.uploadChunkStream();
        } else {
          console.warn(`Unable to trigger command "uploadChunkStream" since the starting point has not been determined.`);

          return;
        }
      })
  }

  uploadChunkStream() {
    if (this.isCurrentUploading) {
      console.warn('Action not permitted!');
      console.warn(`Will ignore command because there's a current submission underway`)
      return;
    }

    this.isCurrentUploading = true;

    const startFrom = this.queryDetails.get('startFrom');
    console.log({ startFrom });

    if (isANumber(startFrom)) {
      this._queryFromIndexedDb();
    } else {
      console.warn(`Issuing command "_getFirstItemIdFromIndexedDb" since 'startFrom' is unknown.`);

      this._getFirstItemIdFromIndexedDb();
    }
  }

  private _setupGetQueryResultsSubscription() {
    this._getQueryResultsSubscription = this._uploadVideoService.getQueryResults$()
      .subscribe((details: LiveStream[]) => {
        this.mergeBlobsToAFile(details);
      });
  }

  private _queryFromIndexedDb() {
    const startFrom = this.queryDetails.get('startFrom') as number;

    this._uploadVideoService
      .queryFromIndexedDb(startFrom,
        this.DECREMENT_BY);
  }

  private _unsubscribeGetQueryResultsSubscription() {
    if (this._getQueryResultsSubscription instanceof Subscription) {
      this._getQueryResultsSubscription.unsubscribe();
    }
  }

  displayAllStoredChunks() {
    this._uploadVideoService
      .listLivestreams();
  }

  startRecording() {
    this.recordedBlobs = [];

    console.log("this._codecPreferencesElRef instanceof ElementRef")
    console.log(this._codecPreferencesElRef instanceof ElementRef)

    if (this._codecPreferencesElRef instanceof ElementRef) {
      const codecNativeElement = this._codecPreferencesElRef.nativeElement;

      const mimeType = codecNativeElement.options[codecNativeElement.selectedIndex].value;
      const options = { mimeType };

      try {
        this.mediaRecorder = new MediaRecorder(
          <MediaStream>this.stream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        console.error(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
        return;
      }

      (this.mediaRecorder as MediaRecorder)?.start(
        this.segmentLengthInMs
      ) // collect 100ms of data

      this.isRecording = true;

      this.onDataAvailableEvent();
      this.onStopRecordingEvent();

      console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    }
  }

  stopRecording() {
    (this.mediaRecorder as MediaRecorder)?.stop()

    console.log('Recorded Blobs: ', this.recordedBlobs);
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.')
      return
    }
    (this.recordVideoElement as HTMLVideoElement)?.play()
  }

  onDataAvailableEvent() {
    try {
      (this.mediaRecorder as MediaRecorder).ondataavailable = (event: BlobEvent) => {
        console.log('Data', event.data);

        if (event.data && event.data.size > 0) {
          this._addToIndexedDb(event.data);
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  private _addToIndexedDb(blob: Blob) {
    this._uploadVideoService
      .addToIndexedDb(blob);
  }


  onStopRecordingEvent() {
    try {
      (this.mediaRecorder as MediaRecorder).onstop = (event: Event) => {
        this.isRecording = false;

        this.displayAllStoredChunks();
      }
    } catch (error) {
      console.log(error)
    }
  }
}
