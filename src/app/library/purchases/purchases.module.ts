import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchasesComponent } from './purchases.component';
import { SharedModule } from '@sharedModule/shared.module';
import { ListPurchaseComponent } from './list-purchase/list-purchase.component';


@NgModule({
  declarations: [
    PurchasesComponent,
    ListPurchaseComponent,
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    SharedModule,
  ],
})
export class PurchasesModule { }
