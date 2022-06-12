import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StreamEventComponent } from './stream-event.component';
import { StreamDetailComponent } from './stream-detail/stream-detail.component';


const routes: Routes = [
  {
    path: '',
    component: StreamEventComponent,
    children: [
      {
        path: '',
        component: StreamDetailComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamEventRoutingModule { }
