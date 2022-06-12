import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareTicketComponent } from './share-ticket.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { ManageAccessComponent } from './manage-access/manage-access.component';
import { SelectPurchasedTicketComponent } from './add-member/select-purchased-ticket/select-purchased-ticket.component';
import { SelectPersonComponent } from './add-member/select-person/select-person.component';


const routes: Routes = [
  {
    path: '',
    component: ShareTicketComponent,
    children: [
      {
        path: '',
        component: ManageAccessComponent,
      },
      {
        path: 'add-member/select',
        component: AddMemberComponent,
        children: [
          {
            path: 'purchased-ticket',
            component: SelectPurchasedTicketComponent,
          },
          {
            path: 'person/:orderItemID/:ticketID',
            component: SelectPersonComponent,
          },
        ]
      },
      {
        path: 'manage-access',
        component: AddMemberComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareTicketRoutingModule { }
