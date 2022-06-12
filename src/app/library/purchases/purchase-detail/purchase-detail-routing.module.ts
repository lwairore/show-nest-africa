import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseDetailComponent } from './purchase-detail.component';
import { PurchasedTicketsComponent } from './purchased-tickets/purchased-tickets.component';
import { PurchasedMomentDetailComponent } from './purchased-moment-detail/purchased-moment-detail.component';
import { InvitedMomentDetailComponent } from './invited-moment-detail/invited-moment-detail.component';


const routes: Routes = [
  {
    path: 'ticket-details',
    component: PurchaseDetailComponent,
    children: [
      {
        path: '',
        component: PurchasedMomentDetailComponent,
      },
      {
        path: 'invited-moment',
        component: InvitedMomentDetailComponent,
      },
      {
        path: 'purchased-tickets',
        component: PurchasedTicketsComponent,
      },
      {
        path: 'share-ticket',
        loadChildren: () => import('./share-ticket/share-ticket.module')
          .then(s => s.ShareTicketModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseDetailRoutingModule { }
