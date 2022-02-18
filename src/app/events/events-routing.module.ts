import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';


const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: 'singles',
        loadChildren: () => import('./singles/singles.module')
        .then(s => s.SinglesModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
