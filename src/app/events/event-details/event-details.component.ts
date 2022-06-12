import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'snap-event-details',
  templateUrl: './event-details.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
