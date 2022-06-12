import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'snap-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}