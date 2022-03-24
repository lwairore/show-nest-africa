import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import * as Immutable from 'immutable';

@Component({
  selector: 'snap-compelling-event-description',
  templateUrl: './compelling-event-description.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompellingEventDescriptionComponent {
  eventDescription = Immutable.Map({});

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  private _checkComponentForChanges() {
    this._changeDetectorRef.markForCheck();
  }

  setEventDescription(details: string) {
    console.log({ details })
    this.eventDescription = this.eventDescription.set(
      'description', details);

    if (!this.eventDescription.isEmpty()) {
      this._checkComponentForChanges();
    }
  }

}
