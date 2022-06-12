import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckTransactionStatusComponent } from './check-transaction-status.component';
import { CardTransactionStatusComponent } from './card-transaction-status/card-transaction-status.component';
import { MpesaTransactionStatusComponent } from './mpesa-transaction-status/mpesa-transaction-status.component';


const routes: Routes = [
  {
    path: '',
    component: CheckTransactionStatusComponent,
    children: [
      {
        path: 'card/:orderItemID/:transactionID',
        component: CardTransactionStatusComponent
      },
      {
        path: 'mpesa/:orderItemID/:requestRecordID',
        component: MpesaTransactionStatusComponent
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckTransactionStatusRoutingModule { }
