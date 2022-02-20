import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpcomingMomentMainComponent } from './upcoming-moment-main/upcoming-moment-main.component';
import { UpcomingMomentSeriesComponent } from './upcoming-moment-series.component';


const routes: Routes = [
  {
    path: '',
    component: UpcomingMomentSeriesComponent,
    children: [
      {
        path: '',
        component: UpcomingMomentMainComponent,
      },
      {
        path: 'details',
        loadChildren: () => import('./upcoming-event-details/upcoming-event-details.module')
          .then(u => u.UpcomingEventDetailsModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingMomentSeriesRoutingModule { }
