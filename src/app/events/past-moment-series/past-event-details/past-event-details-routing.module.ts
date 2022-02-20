import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PastEventsDetailsComponent } from './past-events-details.component';


const routes: Routes = [
  {
    path: '',
    component: PastEventsDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PastEventDetailsRoutingModule { }
