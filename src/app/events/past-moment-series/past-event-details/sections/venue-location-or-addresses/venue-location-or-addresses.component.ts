import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Immutable from 'immutable';

@Component({
  selector: 'snap-venue-location-or-addresses',
  templateUrl: './venue-location-or-addresses.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VenueLocationOrAddressesComponent {
  venueDetails = Immutable.Map({});

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  private _checkComponentForChanges() {
    this._changeDetectorRef.markForCheck();
  }

  setVenueDetails(details: string) {
    this.venueDetails = this.venueDetails.set(
      'venue', details);

    if (!this.venueDetails.isEmpty()) {
      this._checkComponentForChanges();
    }
  }

}
