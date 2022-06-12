import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseDetailRoutingModule } from './purchase-detail-routing.module';
import { PurchaseDetailComponent } from './purchase-detail.component';
import { SharedModule } from '@sharedModule/shared.module';
import { PurchasedTicketsComponent } from './purchased-tickets/purchased-tickets.component';
import { PurchasedMomentDetailComponent } from './purchased-moment-detail/purchased-moment-detail.component';
import { LibsModule } from '@libsModule/libs.module';
import { InvitedMomentDetailComponent } from './invited-moment-detail/invited-moment-detail.component';


@NgModule({
  declarations: [
    PurchaseDetailComponent,
    PurchasedTicketsComponent,
    PurchasedMomentDetailComponent,
    InvitedMomentDetailComponent,
  ],
  imports: [
    CommonModule,
    PurchaseDetailRoutingModule,
    LibsModule,
    SharedModule,
  ]
})
export class PurchaseDetailModule { }
