import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
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
  ]
})
export class ModalFullscreenComponent {
  @Input() theme = {
    display: 'none',
    height: 'auto'
  }

  @Input() show = false;

  @Input() modalID = 'exampleModalCenteredScrollable';


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,

  ) { }

  // close() {
  //   this._router.navigate([
  //     { outlets: { section1: null } }
  //   ], { relativeTo: this._activatedRoute.parent });
  // }

}
