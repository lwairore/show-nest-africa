import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { stringIsEmpty } from '@sharedModule/utilities';

@Component({
  selector: 'snap-item-description',
  templateUrl: './item-description.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SlicePipe,
  ]
})
export class ItemDescriptionComponent implements OnInit {
  private _text = '';

  @Input()
  set itemDescription(value: string) {
    this._text = value;

    this._determineView();
  }

  @Input() maxLength = 100;

  currentText = '';

  hideToggle = true;

  isCollapsed = true;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _slicePipe: SlicePipe,
  ) { }

  ngOnInit(): void {
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  get itemDescription() {
    return this._text;
  }

  private _sliceString(value: string, start = 0, end?: number | undefined) {
    return this._slicePipe.transform(value, start, end);
  }

  toggleView() {
    this.isCollapsed = !this.isCollapsed;

    this._determineView();
  }

  private _determineView() {
    if (stringIsEmpty(this.itemDescription) || this.itemDescription.length <= this.maxLength) {
      this.currentText = this.itemDescription;

      if (this.isCollapsed) {
        this.isCollapsed = false;
      }

      if (!this.hideToggle) {
        this.hideToggle = true;
      }

      console.log("_determineView_determineView")

      return;
    }

    if (this.hideToggle) {
      this.hideToggle = false;
    }

    if (this.isCollapsed) {
      this.currentText = this._sliceString(this.itemDescription, 0, this.maxLength) + '...';
    } else if (!this.isCollapsed) {
      this.currentText = this.itemDescription;
    }

  }
}
