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
        path: ':momentID/details',
        loadChildren: () => import('./event-details/event-details.module')
          .then(e => e.EventDetailsModule),
      },
      {
        path: 'series',
        loadChildren: () => import('./event-series/event-series.module')
          .then(e => e.EventSeriesModule),
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
