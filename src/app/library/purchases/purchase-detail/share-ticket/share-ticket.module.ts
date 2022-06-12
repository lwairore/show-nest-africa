import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareTicketRoutingModule } from './share-ticket-routing.module';
import { ShareTicketComponent } from './share-ticket.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { LibsModule } from '@libsModule/libs.module';
import { SharedModule } from '@sharedModule/shared.module';
import { ManageAccessComponent } from './manage-access/manage-access.component';
import { SelectPurchasedTicketComponent } from './add-member/select-purchased-ticket/select-purchased-ticket.component';
import { SelectPersonComponent } from './add-member/select-person/select-person.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShareTicketComponent,
    AddMemberComponent,
    ManageAccessComponent,
    SelectPurchasedTicketComponent,
    SelectPersonComponent,
  ],
  imports: [
    CommonModule,
    ShareTicketRoutingModule,
    LibsModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ShareTicketModule { }
