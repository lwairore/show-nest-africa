import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blobToFile, convertItemToNumeric, convertItemToString, ExpectedType, isANumber, isObjectEmpty, stringIsEmpty, whichValueShouldIUse } from '@sharedModule/utilities';
import { liveQuery } from 'dexie';
import * as Immutable from 'immutable';
import { defer, EMPTY, from, Observable, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { db, TodoList } from '../db/db';
import { LiveStream } from '../db/livestream.db';
import { UploadVideoService } from '../upload-video.service';


export class StRtc2Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef | undefined;

  @ViewChild('video') videoElementRef: ElementRef | undefined;

  @ViewChild('codecPreferences', { read: ElementRef })
  private _codecPreferencesElRef: ElementRef | undefined;

  @ViewChild('echoCancellationEl', { read: ElementRef })
  private _echoCancellationEl: ElementRef | undefined;

  videoElement: HTMLVideoElement | undefined;

  recordVideoElement: HTMLVideoElement | undefined;

  mediaRecorder: MediaRecorder | undefined;

  private _routeParams = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  recordedBlobs: Array<LiveStream> = [];
  isRecording: boolean = false
  downloadUrl = '';
  stream: MediaStream | undefined;

  segmentLengthInMs = 5000;

  saveChunkStreamSubscription: Subscription | undefined;

  private _getFirstItemIdFromIndexedDbSubscription: Subscription | undefined;

  private _allLiveStreamChunkItemsFromIndexedDbSubscription: Subscription | undefined;

  private _countLiveStreamChunkItemsFromIndexedDbSubscription: Subscription | undefined;

  private _addToIndexedDbSubscription: Subscription | undefined;

  private isCurrentlySubmitting = false;

  todoLists$ = liveQuery(() =>
    defer(() => from(db.todoLists.toArray())));

  todoLists = [];

  listName = 'My new list';

  readonly NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT = 2;

  queryDetails = Immutable.Map({});

  // currentDeterminingKey = this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

  readonly INCREMENT_BY = (this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT - 1);

  async addNewList() {
    await db.todoLists.add({
      title: this.listName,
    });
  }

  async resetDatabase() {
    await db.resetDatabase();
  }

  async listAllLists() {
    await db.todoLists.toArray().then(details => console.log({ details }));
  }

  async populateAll() {
    await db.populate()
  }

  identifyList(index: number, list: TodoList) {
    return `${list.id}${list.title}`;
  }

  private _getQueryResultsSubscription: Subscription | undefined;

  private _sendDataPeriodicallySubscription: Subscription | undefined;

  private _getProcessedFileSubscription: Subscription | undefined;

  private _hasStartedSubmitting = false;

  private _fileDetails = Immutable.Map({
    fileName: ''
  });

  cameraHasStarted = false;

  private _shouldStartSendingChunks = false;

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

    this.setupGetFirstItemIdFromIndexedDb();

    this._setupAllLiveStreamChunkItemsFromIndexedDb();

    this._setupGetQueryResultsSubscription();

    this._setupGetProcessedFileSubscription();

    // this.getFirstItemIdFromIndexedDb();
  }

  ngAfterViewInit() {
    this.videoElement = this.videoElementRef?.nativeElement;

    this.recordVideoElement = this.recordVideoElementRef?.nativeElement;

    this._setSupportedMimeTypes();
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

    this._unsubscribeSendDataPeriodicallySubscription();

    this._unsubscribeGetProcessedFileSubscription();

    this._unsubscribeGetFirstItemIdFromIndexedDbSubscription();
  }

  private _unsubscribeGetFirstItemIdFromIndexedDbSubscription() {
    if (this._getFirstItemIdFromIndexedDbSubscription instanceof Subscription) {
      this._getFirstItemIdFromIndexedDbSubscription.unsubscribe();
    }
  }

  setupGetFirstItemIdFromIndexedDb() {
    this._getFirstItemIdFromIndexedDbSubscription = this._uploadVideoService
      .getFirstItemIdFromIndexedDb$().subscribe(details => {
        console.table(details);
        if (isANumber(details)) {

          const currentDeterminingKey = this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

          const startFromID = currentDeterminingKey + convertItemToNumeric(
            details);

          this.queryDetails = this.queryDetails.set(
            'startFromID', startFromID);

          console.log("this.queryDetails ")
          console.log(this.queryDetails);
        }
      })
  }

  getFirstItemIdFromIndexedDb() {
    this._uploadVideoService.queryFirstItemFromIndexedDb();
  }

  private _setupAllLiveStreamChunkItemsFromIndexedDb() {
    this._allLiveStreamChunkItemsFromIndexedDbSubscription = this._uploadVideoService.getAllLiveStreams$()
      .subscribe(details => {
        console.log({ details });
        if (Array.isArray(details) && details.length > 0) {
          this.recordedBlobs = [...details];

          const FORMATTED_RECORDED_BLOBS = this.recordedBlobs.map(item => {
            return item.blob;
          });


          const MIME_TYPE = this._getSelectedMimeType();

          const superBuffer = new Blob(FORMATTED_RECORDED_BLOBS, { type: MIME_TYPE });

          this.downloadUrl = window.URL.createObjectURL(superBuffer); // you can download with <a> tag
          console.log("this.downloadUrl");
          console.log(this.downloadUrl);

          (this.recordVideoElement as HTMLVideoElement).src = this.downloadUrl;
        }
      });
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute?.parent?.params
      .subscribe(params => {
        console.log({ params })
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
      this.videoElement = this.videoElementRef?.nativeElement
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


  private _unsubscribeSendDataPeriodicallySubscription() {
    if (this._sendDataPeriodicallySubscription instanceof Subscription) {
      this._sendDataPeriodicallySubscription.unsubscribe();
    }
  }

  private _setupGetProcessedFileSubscription() {
    this._getProcessedFileSubscription = this._uploadVideoService.getProcessedFile$()
      .pipe(
        switchMap(details => {
          console.log("_setupGetProcessedFileSubscription")
          console.log({ details });

          if (details instanceof File) {
            const FORM_DATA = new FormData();

            FORM_DATA.append('chunk', details);

            const FILE_NAME = convertItemToString(
              this._fileDetails.get('fileName'));
            if (!stringIsEmpty(FILE_NAME)) {
              FORM_DATA.append('fileName', FILE_NAME)
            }

            const MOMENT_ID = this._routeParams.get('momentID');

            if (!isANumber(MOMENT_ID)) {
              throw Error('Unable to proceed! Value for "moment id" is not valid.');
            }

            return this._uploadVideoService
              .sendLiveStreamFile$(
                convertItemToString(MOMENT_ID), FORM_DATA).pipe(
                  tap(fileReminderDetails => {
                    if (!isObjectEmpty(fileReminderDetails)) {
                      this._fileDetails = this._fileDetails.set('fileName',
                        fileReminderDetails?.fileName);
                    }
                    this.isCurrentlySubmitting = false;

                    let currentDeterminingKey = convertItemToNumeric(
                      this.queryDetails.get('startFrom'));

                    currentDeterminingKey += this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

                    this.queryDetails = this.queryDetails.set('startFrom',
                      currentDeterminingKey
                    );

                    console.log("Starting sendDataPeriodically")
                    this.sendDataPeriodically();
                  }),
                  catchError(err => {
                    this.isCurrentlySubmitting = false;

                    console.log("Starting sendDataPeriodically (err)")
                    this.sendDataPeriodically();

                    return EMPTY;
                  })
                );
          }

          if (this._hasStartedSubmitting) {
            this.sendDataPeriodically();
          }

          return EMPTY;
        })
      )
      .subscribe(details => {
        console.log("Setup and sending");
        console.log({ details });
        console.log("Setup and sending");
      })
  }


  mergeBlobsToAFile(livestreams: Array<LiveStream>) {
    // For debugging purposes only to simulate lower data value
    // if (!this._hasStoppedRecording) {
    //   this._hasStoppedRecording = true;
    // }

    if (Array.isArray(livestreams) && livestreams.length) {
      if (livestreams.length === this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT) {
        const MIME_TYPE = this._getSelectedMimeType();

        console.log("Data processing has been commissioned.")
        this._uploadVideoService.mergeBlobsToAFile(livestreams, MIME_TYPE);

        console.log("Removing _unsubscribeSendDataPeriodicallySubscription")
        this._unsubscribeSendDataPeriodicallySubscription();
      } else if (
        (livestreams.length < this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT) && (
          this._shouldStartSendingChunks && !this.isRecording)) {
        const MIME_TYPE = this._getSelectedMimeType();

        console.log("Value is smaller than expected");
        console.log("Data processing has been commissioned. () ");
        this._uploadVideoService.mergeBlobsToAFile(livestreams, MIME_TYPE);

        console.log("Removing _unsubscribeSendDataPeriodicallySubscription")
        this._unsubscribeSendDataPeriodicallySubscription();
      }
    }

  }


  private _setupGetQueryResultsSubscription() {
    this._getQueryResultsSubscription = this._uploadVideoService.getQueryResults$()
      .subscribe(details => {
        console.log("Query Results")
        console.log({ details });
        console.log("Query Results");

        if (Array.isArray(details) && details.length) {
          this.mergeBlobsToAFile(details);
        }
        else {
          // Set `isCurrentlySubmitting` to `false` for a quixk fix to enable
          // `sendDataPeriodically` to try to submit data. 
          this.isCurrentlySubmitting = false;

          // Increment `startFromID` accordingly inorder to check if the next IDs
          // have a value.
          console.warn(`Increment "startFromID" accordingly inorder to check if the next IDs
          // have a value.`);

          const startFrom = whichValueShouldIUse(
            this.queryDetails.get('startFrom'), 0, ExpectedType.NUMBER);

          const startFromID = this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT + startFrom;

          this.queryDetails = this.queryDetails.set(
            'startFromID', startFromID);
        }
      });
  }

  queryFromIndexedDb(ticker?: number) {
    console.log("queryFromIndexedDb(ticker?: number) {")
    console.log("this.queryDetails.get('startFrom')")
    console.log(this.queryDetails.get('startFrom'))
    this.isCurrentlySubmitting = true;

    const startFrom = whichValueShouldIUse(
      this.queryDetails.get('startFrom'), 0, ExpectedType.NUMBER);


    console.log("queryFromIndexedDb(ticker?: number)")
    console.table(startFrom);
    console.log("queryFromIndexedDb(ticker?: number)")

    if (isANumber(startFrom) && startFrom) {
      console.log("Showing details for ticker ", ticker);
      console.log("We startFrom value is", startFrom);
      this._uploadVideoService
        .queryFromIndexedDb(startFrom, this.INCREMENT_BY);
    } else {
      console.warn("Falling back to starting from the first item (id=1) since the ID of the first item in the index DB has not been determined.")

      // // Set `isCurrentlySubmitting` to `false` for a quixk fix to enable
      // // `sendDataPeriodically` to try to submit data. 
      // this.isCurrentlySubmitting = false;

      const currentDeterminingKey = startFrom + this.NUMBER_OF_ITEMS_DESIRED_TO_BE_SENT;

      this.queryDetails = this.queryDetails.set('startFrom',
        currentDeterminingKey);

      this._uploadVideoService
        .queryFromIndexedDb(currentDeterminingKey, this.INCREMENT_BY);
    }
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

  sendChunkStream(loopIndex: number) {
    const chunkToSave = this.recordedBlobs[loopIndex];

    const chunkFile = blobToFile(chunkToSave.blob,)

    const formData = new FormData();

    formData.append('chunk', chunkFile);

    this.saveChunkStreamSubscription = this._uploadVideoService
      .sendChunkStream(formData).subscribe(details => {
        console.log({ details })
      }, err => console.error(err));
  }

  sendDataPeriodically() {

    // DEBUGGING ONLY
    if (!this._shouldStartSendingChunks) {
      this._shouldStartSendingChunks = true;
    }

    if (!this._hasStartedSubmitting) {
      this._hasStartedSubmitting = true;
    }

    let timer$ = timer(5000, 5000);

    this._sendDataPeriodicallySubscription = timer$.subscribe(ticker => {
      // this.ticks = t
      console.log("***************************************************")
      console.log("foo", ticker);
      if (!this.isCurrentlySubmitting) {
        this.queryFromIndexedDb(ticker);
      } else {
        console.log("Will skip because there's a current submission underway")
      }
      console.log("***************************************************")
    });

    // timer(5000, 1000) 
    //   .subscribe(i => console.log("foo");
    // //prints foo after 5 seconds
  }

  startRecording() {
    this.recordedBlobs = [];

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

      this._shouldStartSendingChunks = true;

      // this.sendDataPeriodically();

      this.onDataAvailableEvent();
      this.onStopRecordingEvent();

      console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    }
  }

  private _restartSendDataPeriodically() {
    this._unsubscribeSendDataPeriodicallySubscription();

    this.sendDataPeriodically();
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
          // this.recordedBlobs.push(event.data);
          // console.log("new this.recordedBlobs")
          // console.log(this.recordedBlobs);
          this._addToIndexedDb(event.data);
        }
      }
    } catch (error) {
      console.log(error)
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
