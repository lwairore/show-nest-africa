import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveBoxRoutingModule } from './live-box-routing.module';
import { LiveBoxComponent } from './live-box.component';
import { LiveboxMainComponent } from './livebox-main/livebox-main.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    LiveBoxComponent,
    LiveboxMainComponent
  ],
  imports: [
    CommonModule,
    LiveBoxRoutingModule,
    SharedModule,
    CarouselModule,
  ]
})
export class LiveBoxModule { }
