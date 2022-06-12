import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetTicketsComponent } from './get-tickets.component';
import { PaymentRequestAcceptedForProcessingComponent } from './payment/payment-request-accepted-for-processing/payment-request-accepted-for-processing.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
  {
    path: '',
    component: GetTicketsComponent,
    children: [
      {
        path: '',
        component: PaymentComponent,
      },
      {
        path: 'check-transcation-status',
        loadChildren: () =>
          import('./check-transaction-status/check-transaction-status.module')
            .then(c => c.CheckTransactionStatusModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetTicketsRoutingModule { }
