import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastEventDetailsRoutingModule } from './past-event-details-routing.module';
import { PastEventsDetailsComponent } from './past-events-details.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PastEventsDetailsComponent,
  ],
  imports: [
    CommonModule,
    PastEventDetailsRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
  ]
})
export class PastEventDetailsModule { }
