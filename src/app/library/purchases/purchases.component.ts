import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'snap-purchases',
  templateUrl: './purchases.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }
}
