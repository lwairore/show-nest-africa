import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveBoxRoutingModule } from './live-box-routing.module';
import { LiveBoxComponent } from './live-box.component';
import { LiveboxMainComponent } from './livebox-main/livebox-main.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { WeAreComingSoonComponent } from './we-are-coming-soon/we-are-coming-soon.component';


@NgModule({
  declarations: [
    LiveBoxComponent,
    LiveboxMainComponent,
    WeAreComingSoonComponent
  ],
  imports: [
    CommonModule,
    LiveBoxRoutingModule,
    SharedModule,
    CarouselModule,
  ]
})
export class LiveBoxModule { }
