import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit, Component, Inject, Input, OnInit, Renderer2,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ContentChild,
  AfterContentInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'snap-modal-fullscreen',
  templateUrl: './modal-fullscreen.component.html',
  styles: [
    `  .modal.modal-fullscreen .modal-dialog {
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      max-width: none;
  }

  .modal.modal-fullscreen .modal-content {
      height: auto;
      height: 100vh;
      border-radius: 0;
      border: none;
  }

  .modal.modal-fullscreen .modal-body {
      overflow-y: auto;
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFullscreenComponent implements AfterViewInit {
  @Input() theme = {
    display: 'none',
    height: 'auto'
  }

  @Input() modalID = 'exampleModalCenteredScrollable';


  @ViewChild('modalFullscreenTriggerEl', { read: ElementRef })
  private _modalFullscreenTriggerElRef: ElementRef | undefined;

  @ContentChild('dataModalTitleNgContent', { read: ElementRef })
  private _dataModalTitleElRef: ElementRef | undefined;

  @ContentChild('dataModalBodyNgContent', { read: ElementRef })
  private _dataModalBodyElRef: ElementRef | undefined;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _renderer2: Renderer2,
  ) { }

  ngAfterViewInit() {
  }

  setModalBody(value: string) {
    if (this._dataModalBodyElRef instanceof ElementRef) {
      this._renderer2.setProperty(
        this._dataModalBodyElRef.nativeElement,
        'innerHTML',
        value);

      this.manuallyTriggerModal();
    }
  }

  setModalTitle(value: string) {
    if (this._dataModalTitleElRef instanceof ElementRef) {
      this._renderer2.setProperty(
        this._dataModalTitleElRef.nativeElement,
        'innerHTML',
        value);

      this.manuallyTriggerModal();
    }
  }

  // close() {
  //   this._router.navigate([
  //     { outlets: { section1: null } }
  //   ], { relativeTo: this._activatedRoute.parent });
  // }

  manuallyTriggerModal() {
    if (this._modalFullscreenTriggerElRef instanceof ElementRef) {
      this._modalFullscreenTriggerElRef.nativeElement.click();
    }
  }
}
