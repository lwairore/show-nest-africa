import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'snap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  constructor() {
  }

}