import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../shared/shared.module';
import { UpcomingComponent } from './sections/upcoming/upcoming.component';
import { PastComponent } from './sections/past/past.component';
import { OwlCarouselLiveboxComponent } from './sections/owl-carousel-livebox/owl-carousel-livebox.component';
import { OwlCarouselPastHighlightsComponent } from './sections/owl-carousel-past-highlights/owl-carousel-past-highlights.component';
import { HomeService } from './home.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LibsModule } from '../libs/libs.module';


@NgModule({
  declarations: [
    HomeComponent,
    UpcomingComponent,
    PastComponent,
    OwlCarouselLiveboxComponent,
    OwlCarouselPastHighlightsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    LibsModule,
  ],
  providers: [
    HomeService,
  ]
})
export class HomeModule { }
