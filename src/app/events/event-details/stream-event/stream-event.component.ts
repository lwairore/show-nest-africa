import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'snap-stream-event',
  templateUrl: './stream-event.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamEventComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
