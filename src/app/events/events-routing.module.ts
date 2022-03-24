import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@sharedModule/guards';
import { EventsComponent } from './events.component';


const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
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
      {
        path: 'submit',
        loadChildren: () => import('./submit-event/submit-event.module')
          .then(s => s.SubmitEventModule),
        canActivate: [
          AuthGuard,
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
