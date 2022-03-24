import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitEventRoutingModule } from './submit-event-routing.module';
import { SubmitEventComponent } from './submit-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@sharedModule/shared.module';


@NgModule({
  declarations: [
    SubmitEventComponent,
  ],
  imports: [
    CommonModule,
    SubmitEventRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class SubmitEventModule { }
