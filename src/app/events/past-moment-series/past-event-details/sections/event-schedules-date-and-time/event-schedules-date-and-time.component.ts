import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Immutable from 'immutable';
import { EventSchedhuleDetail } from '../../custom-types';

@Component({
  selector: 'snap-event-schedules-date-and-time',
  templateUrl: './event-schedules-date-and-time.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSchedulesDateAndTimeComponent implements OnInit {
  eventSchedhuleDetails = Immutable.fromJS({});

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  private _checkComponentForChanges() {
    this._changeDetectorRef.markForCheck();
  }

  setEventSchedhuleDetails(details: EventSchedhuleDetail) {
    this.eventSchedhuleDetails = Immutable.fromJS(details);

    if (!this.eventSchedhuleDetails.isEmpty()) {
      this._checkComponentForChanges();
    }
  }
}
