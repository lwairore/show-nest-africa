import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as Immutable from 'immutable';
import { FaqService } from './services';

@Component({
  selector: 'snap-faq',
  templateUrl: './faq.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FaqService,
  ]
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
