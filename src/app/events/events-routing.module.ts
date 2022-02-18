import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';


const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: 'past',
        loadChildren: () => import('./past-moment/past-moment.module')
          .then(p => p.PastMomentModule)
      },
      {
        path: 'upcoming',
        loadChildren: () => import('./upcoming-moment/upcoming-moment.module')
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
