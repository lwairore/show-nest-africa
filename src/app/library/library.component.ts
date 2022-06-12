import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'snap-library',
  templateUrl: './library.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
