import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PastComponent } from './past/past.component';
import { UpcommingComponent } from './upcomming/upcomming.component';


const routes: Routes = [
  {
    path: 'past',
    component: PastComponent,
  },
  {
    path: 'upcoming',
    component: UpcommingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventSeriesRoutingModule { }
