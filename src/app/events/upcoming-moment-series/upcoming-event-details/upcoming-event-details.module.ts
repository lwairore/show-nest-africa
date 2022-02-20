import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingEventDetailsRoutingModule } from './upcoming-event-details-routing.module';
import { UpcomingEventDetailsComponent } from './upcoming-event-details.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UpcomingEventDetailsComponent,
  ],
  imports: [
    CommonModule,
    UpcomingEventDetailsRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
  ]
})
export class UpcomingEventDetailsModule { }
