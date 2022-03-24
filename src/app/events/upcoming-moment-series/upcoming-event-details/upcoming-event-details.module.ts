import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingEventDetailsRoutingModule } from './upcoming-event-details-routing.module';
import { UpcomingEventDetailsComponent } from './upcoming-event-details.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CompellingEventDescriptionComponent } from './sections/compelling-event-description/compelling-event-description.component';
import { TrailerComponent } from './sections/trailer/trailer.component';
import { LibsModule } from 'src/app/libs/libs.module';
import { UpcommingEventDetailsService } from './upcomming-event-details.service';


@NgModule({
  declarations: [
    UpcomingEventDetailsComponent,
    CompellingEventDescriptionComponent,
    TrailerComponent,
  ],
  imports: [
    CommonModule,
    UpcomingEventDetailsRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
    CarouselModule,
    LibsModule,
  ],
  providers: [
    UpcommingEventDetailsService,
  ]
})
export class UpcomingEventDetailsModule { }
