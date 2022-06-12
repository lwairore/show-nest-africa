import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventSeriesRoutingModule } from './event-series-routing.module';
import { EventSeriesComponent } from './event-series.component';
import { PastComponent } from './past/past.component';
import { SharedModule } from '@sharedModule/shared.module';
import { UpcommingComponent } from './upcomming/upcomming.component';


@NgModule({
  declarations: [
    EventSeriesComponent,
    PastComponent,
    UpcommingComponent,
  ],
  imports: [
    CommonModule,
    EventSeriesRoutingModule,
    SharedModule,
  ]
})
export class EventSeriesModule { }
