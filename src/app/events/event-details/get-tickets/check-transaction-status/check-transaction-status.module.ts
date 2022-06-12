import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckTransactionStatusRoutingModule } from './check-transaction-status-routing.module';
import { CheckTransactionStatusComponent } from './check-transaction-status.component';
import { CardTransactionStatusComponent } from './card-transaction-status/card-transaction-status.component';
import { MpesaTransactionStatusComponent } from './mpesa-transaction-status/mpesa-transaction-status.component';
import { SharedModule } from '@sharedModule/shared.module';


@NgModule({
  declarations: [
    CheckTransactionStatusComponent,
    CardTransactionStatusComponent,
    MpesaTransactionStatusComponent,
  ],
  imports: [
    CommonModule,
    CheckTransactionStatusRoutingModule,
    SharedModule,
  ]
})
export class CheckTransactionStatusModule { }
