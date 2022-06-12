import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetTicketsRoutingModule } from './get-tickets-routing.module';
import { GetTicketsComponent } from './get-tickets.component';
import { PaymentComponent } from './payment/payment.component';
import { CardComponent } from './payment/methods/card/card.component';
import { MPesaComponent } from './payment/methods/m-pesa/m-pesa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@sharedModule/shared.module';
import { LibsModule } from '@libsModule/libs.module';
import { PaymentRequestAcceptedForProcessingComponent } from './payment/payment-request-accepted-for-processing/payment-request-accepted-for-processing.component';


@NgModule({
  declarations: [
    GetTicketsComponent,
    PaymentComponent,
    CardComponent,
    MPesaComponent,
    PaymentRequestAcceptedForProcessingComponent,
  ],
  imports: [
    CommonModule,
    GetTicketsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    LibsModule,
  ]
})
export class GetTicketsModule { }
