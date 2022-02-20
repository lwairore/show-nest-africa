import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';


const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./all-moment/all-moment.module')
          .then(a => a.AllMomentModule),
      },
      {
        path: 'happening-now',
        loadChildren: () => import('./happening-now/happening-now.module')
          .then(h => h.HappeningNowModule),
      },
      {
        path: 'past',
        loadChildren: () => import('./past-moment-series/past-moment-series.module')
          .then(p => p.PastMomentSeriesModule),
      },
      {
        path: 'upcoming',
        loadChildren: () => import('./upcoming-moment-series/upcoming-moment.module')
          .then(u => u.UpcomingMomentModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
