import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EventDetailsRoutingModule } from './event-details-routing.module';
import { EventDetailsComponent } from './event-details.component';
import { TrailerComponent } from './detail/sections/trailer/trailer.component';
import { LibsModule } from '@libsModule/libs.module';
import { HighlightsComponent } from './detail/sections/highlights/highlights.component';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    EventDetailsComponent,
    TrailerComponent,
    HighlightsComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    EventDetailsRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
    CarouselModule,
    LibsModule,
  ]
})
export class EventDetailsModule { }
