import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpcomingMomentComponent } from './upcoming-moment.component';


const routes: Routes = [
  {
    path: '',
    component: UpcomingMomentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingMomentRoutingModule { }
