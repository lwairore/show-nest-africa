import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HappeningNowRoutingModule } from './happening-now-routing.module';
import { HappeningNowComponent } from './happening-now.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HappeningNowMainComponent } from './happening-now-main/happening-now-main.component';


@NgModule({
  declarations: [
    HappeningNowComponent,
    HappeningNowMainComponent,
  ],
  imports: [
    CommonModule,
    HappeningNowRoutingModule,
    SharedModule,
  ]
})
export class HappeningNowModule { }
