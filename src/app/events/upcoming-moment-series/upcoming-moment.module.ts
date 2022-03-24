import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingMomentSeriesRoutingModule } from './upcoming-moment-series-routing.module';
import { UpcomingMomentSeriesComponent } from './upcoming-moment-series.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpcomingMomentMainComponent } from './upcoming-moment-main/upcoming-moment-main.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [
    UpcomingMomentSeriesComponent,
    UpcomingMomentMainComponent,
  ],
  imports: [
    CommonModule,
    UpcomingMomentSeriesRoutingModule,
    SharedModule,
    NgxSkeletonLoaderModule,
  ],
})
export class UpcomingMomentModule { }
