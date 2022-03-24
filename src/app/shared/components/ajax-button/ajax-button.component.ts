import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'snap-ajax-button',
  templateUrl: './ajax-button.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AjaxButtonComponent implements OnInit {
  busy: boolean | null = null;
  @Input() execute: any;
  @Input() parameter: any;


  @HostListener('click', ['$event'])
  onClick(event: any) {
    let result: any = this.execute(this.parameter);
    if (result instanceof Promise) {
      this.busy = true;
      result.then(
        () => {
          this.busy = null;
          this._manuallyTriggerChangeDetection();
        },
        (error: any) => {
          this.busy = null;

          this._manuallyTriggerChangeDetection();
        });
    }
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit(): void {
  }


  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
