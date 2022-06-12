import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { convertItemToNumeric, convertItemToString, isANumber, stringIsEmpty } from '@sharedModule/utilities';

@Component({
  selector: 'snap-errornote',
  templateUrl: './errornote.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrornoteComponent implements OnInit {
  @Input() totalInvalidFormControls = 0;
  @Input() errorMessage = '';

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.resetTotalInvalidControlsAndErrorMessage();
  }

  resetTotalInvalidControlsAndErrorMessage() {
    this._resetTotalInvalidFormControls();

    this._resetErrorMessage();
  }

  private _resetTotalInvalidFormControls() {
    this.totalInvalidFormControls = 0;
  }

  private _resetErrorMessage() {
    this.errorMessage = '';
  }

  showErrorNote(
    totalInvalidFormControls = 0, errorMessage = '') {
    if (isANumber(totalInvalidFormControls)) {
      this.totalInvalidFormControls = convertItemToNumeric(totalInvalidFormControls);
    }

    if (!stringIsEmpty(errorMessage)) {
      this.errorMessage = convertItemToString(errorMessage);
    }
  }

  manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

}
