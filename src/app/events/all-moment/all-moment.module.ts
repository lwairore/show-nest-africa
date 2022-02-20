import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMomentRoutingModule } from './all-moment-routing.module';
import { AllMomentComponent } from './all-moment.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AllMomentComponent,
  ],
  imports: [
    CommonModule,
    AllMomentRoutingModule,
    SharedModule,
  ]
})
export class AllMomentModule { }
