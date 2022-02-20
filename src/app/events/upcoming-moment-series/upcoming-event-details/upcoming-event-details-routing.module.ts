import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpcomingEventDetailsComponent } from './upcoming-event-details.component';


const routes: Routes = [
  {
    path: '',
    component: UpcomingEventDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingEventDetailsRoutingModule { }
