import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastEventDetailsRoutingModule } from './past-event-details-routing.module';
import { PastEventsDetailsComponent } from './past-events-details.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { SharedModule } from 'src/app/shared/shared.module';
import { PastEventDetailsService } from './past-event-details.service';
import { CompellingEventDescriptionComponent } from './sections/compelling-event-description/compelling-event-description.component';
import { EventSchedulesDateAndTimeComponent } from './sections/event-schedules-date-and-time/event-schedules-date-and-time.component';
import { VenueLocationOrAddressesComponent } from './sections/venue-location-or-addresses/venue-location-or-addresses.component';
import { SocialMediaLinksComponent } from './sections/social-media-links/social-media-links.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SpeakersComponent } from './sections/speakers/speakers.component';
import { LibsModule } from 'src/app/libs/libs.module';
import { TestimonialComponent } from './sections/testimonial/testimonial.component';
import { EventPhotosComponent } from './sections/event-photos/event-photos.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EventVideosComponent } from './sections/event-videos/event-videos.component';
import { SponsorLogosComponent } from './sections/sponsor-logos/sponsor-logos.component';


@NgModule({
  declarations: [
    PastEventsDetailsComponent,
    CompellingEventDescriptionComponent,
    EventSchedulesDateAndTimeComponent,
    VenueLocationOrAddressesComponent,
    SocialMediaLinksComponent,
    SpeakersComponent,
    TestimonialComponent,
    EventPhotosComponent,
    EventVideosComponent,
    SponsorLogosComponent,
  ],
  imports: [
    CommonModule,
    PastEventDetailsRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SharedModule,
    CarouselModule,
    LibsModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [
    PastEventDetailsService,
  ]
})
export class PastEventDetailsModule { }
