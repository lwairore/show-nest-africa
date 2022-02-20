import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastMomentSeriesRoutingModule } from './past-moment-series-routing.module';
import { PastMomentSeriesComponent } from './past-moment-series.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PastMomentMainComponent } from './past-moment-main/past-moment-main.component';


@NgModule({
  declarations: [
    PastMomentSeriesComponent,
    PastMomentMainComponent,
  ],
  imports: [
    CommonModule,
    PastMomentSeriesRoutingModule,
    SharedModule,
  ]
})
export class PastMomentSeriesModule { }
