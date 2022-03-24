import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitEventComponent } from './submit-event.component';


const routes: Routes = [
  {
    path: '',
    component: SubmitEventComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmitEventRoutingModule { }
