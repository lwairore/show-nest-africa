import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'snap-past-moment-series',
  templateUrl: './past-moment-series.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PastMomentSeriesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
