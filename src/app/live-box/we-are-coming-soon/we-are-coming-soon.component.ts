import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'snap-we-are-coming-soon',
  templateUrl: './we-are-coming-soon.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeAreComingSoonComponent implements OnInit {

  constructor(
    private _router: Router,
    private _location: Location,
  ) { }

  ngOnInit() {
  }

  navigateBackToHome() {
    this._router.navigateByUrl('');
  }

}
