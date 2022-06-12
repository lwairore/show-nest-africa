import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';
import { DetailComponent } from './detail/detail.component';
import { AuthGuard } from '@sharedModule/guards';


const routes: Routes = [
  {
    path: '',
    component: EventDetailsComponent,
    children: [
      {
        path: '',
        component: DetailComponent,
      },
      {
        path: 'stream',
        loadChildren: () => import('./stream-event/stream-event.module')
          .then(s => s.StreamEventModule),
      },
      {
        path: 'get-tickets',
        loadChildren: () => import('./get-tickets/get-tickets.module')
          .then(g => g.GetTicketsModule),
        // canActivate: [
        //   AuthGuard,
        // ]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventDetailsRoutingModule { }
