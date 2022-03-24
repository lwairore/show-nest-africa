import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtcRoutingModule } from './rtc-routing.module';
import { RtcComponent } from './rtc.component';
import { StRtcComponent } from './st-rtc/st-rtc.component';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './st-rtc/item-list/item-list.component';


@NgModule({
  declarations: [
    RtcComponent,
    StRtcComponent,
    ItemListComponent,

  ],
  imports: [
    CommonModule,
    RtcRoutingModule,
    FormsModule,
  ]
})
export class RtcModule { }
