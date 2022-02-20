import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HappeningNowEventDetailsComponent } from './happening-now-event-details.component';


const routes: Routes = [
  {
    path: '',
    component: HappeningNowEventDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HappeningNowEventDetailsRoutingModule { }
