import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpcomingMomentRoutingModule } from './upcoming-moment-routing.module';
import { UpcomingMomentComponent } from './upcoming-moment.component';


@NgModule({
  declarations: [UpcomingMomentComponent],
  imports: [
    CommonModule,
    UpcomingMomentRoutingModule
  ]
})
export class UpcomingMomentModule { }
