import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HappeningNowEventDetailsRoutingModule } from './happening-now-event-details-routing.module';
import { HappeningNowEventDetailsComponent } from './happening-now-event-details.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HappeningNowEventDetailsComponent,
  ],
  imports: [
    CommonModule,
    HappeningNowEventDetailsRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
  ]
})
export class HappeningNowEventDetailsModule { }
