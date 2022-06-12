import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { SharedModule } from '@sharedModule/shared.module';
import { FanComponent } from './fan/fan.component';
import { CreatorComponent } from './creator/creator.component';


@NgModule({
  declarations: [
    FaqComponent,
    FanComponent,
    CreatorComponent,
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    SharedModule,
  ]
})
export class FaqModule { }
