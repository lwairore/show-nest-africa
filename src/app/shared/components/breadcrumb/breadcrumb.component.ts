import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Immutable from 'immutable';

@Component({
  selector: 'snap-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbDetails = Immutable.fromJS({});

  constructor() { }

  ngOnInit(): void {
  }

}
