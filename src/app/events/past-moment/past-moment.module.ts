import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PastMomentRoutingModule } from './past-moment-routing.module';
import { PastMomentComponent } from './past-moment.component';


@NgModule({
  declarations: [PastMomentComponent],
  imports: [
    CommonModule,
    PastMomentRoutingModule
  ]
})
export class PastMomentModule { }
